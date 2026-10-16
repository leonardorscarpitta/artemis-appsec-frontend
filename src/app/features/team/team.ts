import { Component, inject, signal } from '@angular/core';
import { I18n } from '../../core/i18n';
import {
  INVITATIONS,
  Invitation,
  MEMBERS,
  Member,
  PERMISSIONS,
  Permission,
  ROLE_PERMISSIONS,
  ROLES,
  Role,
} from '../../core/mock-org';

@Component({
  selector: 'app-team',
  templateUrl: './team.html',
  styleUrl: './team.scss',
})
export class Team {
  protected readonly i18n = inject(I18n);

  protected readonly roles = ROLES;
  // Ownership is transferred, never assigned from the role picker.
  protected readonly assignableRoles = ROLES.filter((r) => r !== 'owner');
  protected readonly permissions = PERMISSIONS;

  protected readonly members = signal<Member[]>(MEMBERS);
  protected readonly invitations = signal<Invitation[]>(INVITATIONS);
  protected readonly inviting = signal(false);
  protected readonly resent = signal<string | null>(null);

  protected roleLabel(role: Role): string {
    return this.i18n.t(`team.role.${role}`);
  }

  protected permLabel(permission: Permission): string {
    return this.i18n.t(`team.perm.${permission}`);
  }

  protected can(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role].includes(permission);
  }

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2);
  }

  protected setRole(id: string, event: Event): void {
    const role = (event.target as HTMLSelectElement).value as Role;
    this.members.update((list) => list.map((m) => (m.id === id ? { ...m, role } : m)));
  }

  protected invite(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    if (!email) return;
    this.invitations.update((list) => [
      { email, role: data.get('role') as Role, sent: '2026-10-16' },
      ...list,
    ]);
    form.reset();
    this.inviting.set(false);
  }

  protected resend(email: string): void {
    this.resent.set(email);
    setTimeout(() => this.resent.set(null), 2500);
  }

  protected revoke(email: string): void {
    this.invitations.update((list) => list.filter((i) => i.email !== email));
  }
}
