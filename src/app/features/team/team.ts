import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { problemMessage } from '../../core/api/api';
import {
  Invitation,
  Member,
  OrganizationApi,
  Permission,
  Role,
  RoleInfo,
  invitationsUrl,
  membersUrl,
  rolesUrl,
} from '../../core/api/organization';
import { Auth } from '../../core/auth/auth';
import { I18n } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';
import { RequestState } from '../../shared/request-state';
import { LOCK_ICON, RoleNotice } from '../../shared/role-notice';
import { Paginator, paginate } from '../../shared/paginator';
import { forkJoin } from 'rxjs';

const PERMISSIONS: Permission[] = ['viewFindings', 'triage', 'pipelines', 'integrations', 'team', 'billing'];

@Component({
  selector: 'app-team',
  imports: [DatePipe, RequestState, RoleNotice, Paginator],
  templateUrl: './team.html',
  styleUrl: './team.scss',
})
export class Team {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(OrganizationApi);
  protected readonly org = inject(OrgContext);
  private readonly auth = inject(Auth);
  protected readonly canManage = computed(() => this.org.can('team'));
  protected readonly isOwner = computed(() => this.org.current()?.role === 'owner');

  protected readonly members = httpResource<Member[]>(() => membersUrl(), { defaultValue: [] });
  protected readonly invitations = httpResource<Invitation[]>(() => invitationsUrl(), { defaultValue: [] });
  protected readonly memberPager = paginate(this.members.value);
  protected readonly invitationPager = paginate(this.invitations.value);
  private readonly roleInfo = httpResource<RoleInfo[]>(() => rolesUrl(), { defaultValue: [] });

  protected readonly roles = computed(() => this.roleInfo.value().map((r) => r.role));
  // Ownership is transferred, never assigned from the role picker.
  // Only the owner manages admins, so admins never see the admin role in the pickers.
  protected readonly assignableRoles = computed(() =>
    this.roleInfo
      .value()
      .filter((r) => r.assignable && (this.isOwner() || r.role !== 'admin'))
      .map((r) => r.role),
  );
  protected readonly permissions = PERMISSIONS;
  protected readonly lock = LOCK_ICON;

  // Draft of the role → permission matrix while an owner or admin edits it.
  protected readonly draft = linkedSignal(() =>
    Object.fromEntries(this.roleInfo.value().map((r) => [r.role, [...r.permissions]])) as Record<Role, Permission[]>,
  );
  protected readonly canEditMatrix = computed(() => this.roleInfo.value().some((r) => r.editable));
  protected readonly dirtyRoles = computed(() =>
    this.roleInfo.value().filter((r) => {
      const draft = this.draft()[r.role] ?? [];
      return r.editable && (draft.length !== r.permissions.length || draft.some((p) => !r.permissions.includes(p)));
    }),
  );
  protected readonly savingMatrix = signal(false);
  protected readonly matrixMessage = signal<{ ok: boolean; text: string } | null>(null);

  protected readonly inviting = signal(false);
  protected readonly link = signal<{ email: string; url: string } | null>(null);
  protected readonly copied = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly inviteError = signal<string | null>(null);

  protected roleLabel(role: Role): string {
    return this.i18n.t(`team.role.${role}`);
  }

  protected permLabel(permission: Permission): string {
    return this.i18n.t(`team.perm.${permission}`);
  }

  protected can(role: Role, permission: Permission): boolean {
    return this.draft()[role]?.includes(permission) ?? false;
  }

  /** Why a cell cannot be changed by the signed-in user, or null when it can. */
  protected lockReason(role: Role, permission: Permission): string | null {
    if (role === 'owner') return this.i18n.t('team.lock.owner');
    if (permission === 'viewFindings') return this.i18n.t('team.lock.viewFindings');
    if (permission === 'billing') return this.i18n.t('team.lock.billing');
    if (!this.roleInfo.value().find((r) => r.role === role)?.editable) {
      return role === 'admin' ? this.i18n.t('team.lock.admin') : this.i18n.t('team.lock.role');
    }
    return null;
  }

  protected toggle(role: Role, permission: Permission, checked: boolean): void {
    this.matrixMessage.set(null);
    this.draft.update((d) => {
      const current = d[role] ?? [];
      const next = checked ? [...current, permission] : current.filter((p) => p !== permission);
      return { ...d, [role]: PERMISSIONS.filter((p) => next.includes(p)) };
    });
  }

  protected resetMatrix(): void {
    this.draft.set(Object.fromEntries(this.roleInfo.value().map((r) => [r.role, [...r.permissions]])) as Record<Role, Permission[]>);
    this.matrixMessage.set(null);
  }

  protected saveMatrix(): void {
    const changed = this.dirtyRoles();
    if (!changed.length) return;
    this.savingMatrix.set(true);
    this.matrixMessage.set(null);
    forkJoin(changed.map((r) => this.api.updateRolePermissions(r.role, this.draft()[r.role]))).subscribe({
      next: () => {
        this.savingMatrix.set(false);
        this.matrixMessage.set({ ok: true, text: this.i18n.t('team.matrixSaved') });
        this.roleInfo.reload();
        // The signed-in user's own permissions may have changed.
        void this.org.load(true);
      },
      error: (err) => {
        this.savingMatrix.set(false);
        this.roleInfo.reload();
        this.matrixMessage.set({ ok: false, text: problemMessage(err) ?? this.i18n.t('api.saveError') });
      },
    });
  }

  protected isSelf(member: Member): boolean {
    // E-mails are hidden from roles without the team permission; those roles cannot edit anyone anyway.
    return !!member.email && member.email.toLowerCase() === this.auth.profile()?.email?.toLowerCase();
  }



  protected initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2);
  }

  /** Owners manage everyone but themselves; admins manage analysts, developers and viewers. */
  protected canEdit(member: Member): boolean {
    if (!this.canManage() || this.isSelf(member) || member.role === 'owner') return false;
    return this.isOwner() || member.role !== 'admin';
  }

  protected remove(member: Member): void {
    if (!confirm(this.i18n.t('team.removeConfirm').replace('{name}', member.name))) return;
    this.error.set(null);
    this.api.removeMember(member.id).subscribe({
      next: () => this.members.update((list) => list.filter((m) => m.id !== member.id)),
      error: (err) => this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
  }

  protected setRole(member: Member, event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.error.set(null);
    this.api.changeRole(member.id, select.value as Role).subscribe({
      next: (updated) => this.members.update((list) => list.map((m) => (m.id === updated.id ? updated : m))),
      error: (err) => {
        select.value = member.role;
        this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }

  protected invite(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    this.busy.set(true);
    this.inviteError.set(null);
    this.api.invite(String(data.get('email') ?? '').trim(), data.get('role') as Role).subscribe({
      next: (invitation) => {
        this.invitations.update((list) => [invitation, ...list]);
        this.share(invitation);
        form.reset();
        this.inviting.set(false);
        this.busy.set(false);
      },
      error: (err) => {
        this.busy.set(false);
        this.inviteError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }

  protected resend(invitation: Invitation): void {
    this.error.set(null);
    this.api.resendInvitation(invitation.id).subscribe({
      next: (updated) => {
        this.invitations.update((list) => list.map((i) => (i.id === updated.id ? updated : i)));
        this.share(updated);
      },
      error: (err) => this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
  }

  /** Shows the one-time link of a new or renewed invitation; it cannot be displayed again later. */
  private share(invitation: Invitation): void {
    this.copied.set(false);
    this.link.set(invitation.token ? { email: invitation.email, url: `${location.origin}/invite/${invitation.token}` } : null);
  }

  protected copyLink(url: string): void {
    void navigator.clipboard?.writeText(url).then(() => this.copied.set(true));
  }

  protected revoke(invitation: Invitation): void {
    this.error.set(null);
    this.api.revokeInvitation(invitation.id).subscribe({
      next: () => this.invitations.update((list) => list.filter((i) => i.id !== invitation.id)),
      error: (err) => this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
  }
}
