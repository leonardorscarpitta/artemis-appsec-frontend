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
import { I18n } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';

const PERMISSIONS: Permission[] = ['viewFindings', 'triage', 'pipelines', 'integrations', 'team', 'billing'];

@Component({
  selector: 'app-team',
  imports: [DatePipe, RequestState],
  templateUrl: './team.html',
  styleUrl: './team.scss',
})
export class Team {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(OrganizationApi);

  protected readonly members = httpResource<Member[]>(() => membersUrl(), { defaultValue: [] });
  protected readonly invitations = httpResource<Invitation[]>(() => invitationsUrl(), { defaultValue: [] });
  private readonly roleInfo = httpResource<RoleInfo[]>(() => rolesUrl(), { defaultValue: [] });

  protected readonly roles = computed(() => this.roleInfo.value().map((r) => r.role));
  // Ownership is transferred, never assigned from the role picker.
  protected readonly assignableRoles = computed(() =>
    this.roleInfo.value().filter((r) => r.assignable).map((r) => r.role),
  );
  protected readonly permissions = PERMISSIONS;

  protected readonly inviting = signal(false);
  protected readonly resent = signal<string | null>(null);
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

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2);
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
        this.resent.set(updated.id);
        setTimeout(() => this.resent.set(null), 2500);
      },
      error: (err) => this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
  }

  protected revoke(invitation: Invitation): void {
    this.error.set(null);
    this.api.revokeInvitation(invitation.id).subscribe({
      next: () => this.invitations.update((list) => list.filter((i) => i.id !== invitation.id)),
      error: (err) => this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
  }
}
