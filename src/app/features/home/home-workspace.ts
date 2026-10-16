import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyInvitation, myInvitationsUrl } from '../../core/api/organization';
import { Auth } from '../../core/auth/auth';
import { I18n, TranslationKey } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';

/** Shortcuts into the signed-in user's organizations, shown on the public home page. */
@Component({
  selector: 'app-home-workspace',
  imports: [RouterLink],
  templateUrl: './home-workspace.html',
  styleUrl: './home-workspace.scss',
})
export class HomeWorkspace {
  protected readonly i18n = inject(I18n);
  protected readonly auth = inject(Auth);
  protected readonly org = inject(OrgContext);

  protected readonly invitations = httpResource<MyInvitation[]>(() => myInvitationsUrl(), { defaultValue: [] });
  protected readonly firstName = computed(() => this.auth.profile()?.name.split(/\s+/)[0] ?? '');
  protected readonly failed = signal(false);

  constructor() {
    this.org.load(true).catch(() => this.failed.set(true));
  }

  protected roleLabel(role: string): string {
    return this.i18n.t(`team.role.${role}` as TranslationKey);
  }

  protected planLabel(plan: string): string {
    return this.i18n.t(`nav.plan.${plan}` as TranslationKey);
  }
}
