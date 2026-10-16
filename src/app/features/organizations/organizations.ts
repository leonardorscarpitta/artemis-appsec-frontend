import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { problemCode, problemMessage } from '../../core/api/api';
import { MyInvitation, OrganizationApi, myInvitationsUrl } from '../../core/api/organization';
import { Auth } from '../../core/auth/auth';
import { I18n, TranslationKey } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';
import { LangSwitch } from '../../shared/lang-switch';
import { Logo } from '../../shared/logo';
import { ThemeToggle } from '../../shared/theme-toggle';
import { UserBadge } from '../../shared/user-badge';

const CREATE_ERRORS: Record<string, TranslationKey> = {
  'slug-taken': 'orgs.error.slugTaken',
  'slug-reserved': 'orgs.error.slugReserved',
  'organization-limit': 'orgs.error.limit',
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '');
}

/** Organization picker: the user's organizations, invitations addressed to them, and creating a new one. */
@Component({
  selector: 'app-organizations',
  imports: [RouterLink, DatePipe, Logo, LangSwitch, ThemeToggle, UserBadge],
  templateUrl: './organizations.html',
  styleUrl: './organizations.scss',
})
export class Organizations {
  protected readonly i18n = inject(I18n);
  protected readonly auth = inject(Auth);
  protected readonly org = inject(OrgContext);
  private readonly api = inject(OrganizationApi);
  private readonly router = inject(Router);

  protected readonly invitations = httpResource<MyInvitation[]>(() => myInvitationsUrl(), { defaultValue: [] });
  protected readonly pending = computed(() => (this.invitations.hasValue() ? this.invitations.value() : []));
  protected readonly loadFailed = signal(false);

  protected readonly name = signal('');
  protected readonly slug = signal('');
  private slugEdited = false;
  protected readonly creating = signal(false);
  protected readonly createError = signal<string | null>(null);
  protected readonly busyInvitation = signal<string | null>(null);
  protected readonly invitationError = signal<string | null>(null);

  constructor() {
    this.org.slug.set(null);
    this.reload();
  }

  protected reload(): void {
    this.loadFailed.set(false);
    this.org.load(true).catch(() => this.loadFailed.set(true));
  }

  protected roleLabel(role: string): string {
    return this.i18n.t(`team.role.${role}` as TranslationKey);
  }

  protected planLabel(plan: string): string {
    return this.i18n.t(`nav.plan.${plan}` as TranslationKey);
  }

  protected setName(value: string): void {
    this.name.set(value);
    if (!this.slugEdited) this.slug.set(slugify(value));
  }

  protected setSlug(value: string): void {
    this.slugEdited = true;
    this.slug.set(value.toLowerCase());
  }

  protected create(event: Event): void {
    event.preventDefault();
    if (!(event.target as HTMLFormElement).reportValidity()) return;
    this.creating.set(true);
    this.createError.set(null);
    this.api.createOrganization(this.name().trim(), this.slug()).subscribe({
      next: (created) => {
        this.org.upsert(created);
        void this.router.navigate(['/', created.slug, 'onboarding']);
      },
      error: (error: unknown) => {
        this.creating.set(false);
        const key = CREATE_ERRORS[problemCode(error) ?? ''];
        this.createError.set(key ? this.i18n.t(key) : (problemMessage(error) ?? this.i18n.t('api.saveError')));
      },
    });
  }

  protected accept(invitation: MyInvitation): void {
    this.busyInvitation.set(invitation.id);
    this.invitationError.set(null);
    this.api.acceptInvitation(invitation.id).subscribe({
      next: (joined) => {
        this.org.upsert(joined);
        void this.router.navigate(['/', joined.slug, 'dashboard']);
      },
      error: (error: unknown) => this.invitationFailed(error),
    });
  }

  protected decline(invitation: MyInvitation): void {
    this.busyInvitation.set(invitation.id);
    this.invitationError.set(null);
    this.api.declineInvitation(invitation.id).subscribe({
      next: () => {
        this.busyInvitation.set(null);
        this.invitations.reload();
      },
      error: (error: unknown) => this.invitationFailed(error),
    });
  }

  protected signOut(): void {
    void this.auth.logout();
  }

  private invitationFailed(error: unknown): void {
    this.busyInvitation.set(null);
    this.invitationError.set(problemMessage(error) ?? this.i18n.t('api.saveError'));
    this.invitations.reload();
  }
}
