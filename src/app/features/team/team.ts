import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
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
import { RoleNotice } from '../../shared/role-notice';

const PERMISSIONS: Permission[] = ['viewFindings', 'triage', 'pipelines', 'integrations', 'team', 'billing'];

@Component({
  selector: 'app-team',
  imports: [DatePipe, RequestState, RoleNotice],
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
    return this.roleInfo.value().find((r) => r.role === role)?.permissions.includes(permission) ?? false;
  }

  protected isSelf(member: Member): boolean {
    return member.email.toLowerCase() === this.auth.profile()?.email?.toLowerCase();
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
