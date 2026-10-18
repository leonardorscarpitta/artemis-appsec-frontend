import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyInvitation, myInvitationsUrl } from '../../core/api/organization';
import { Account } from '../../core/auth/account';
import { Auth } from '../../core/auth/auth';
import { I18n } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';
import { LOCK_ICON } from '../../shared/role-notice';
import { HomeOrgCard } from './home-org-card';

/** Shortcuts into the signed-in user's organizations, shown on the public home page. */
@Component({
  selector: 'app-home-workspace',
  imports: [RouterLink, HomeOrgCard],
  templateUrl: './home-workspace.html',
  styleUrl: './home-workspace.scss',
})
export class HomeWorkspace {
  protected readonly i18n = inject(I18n);
  protected readonly auth = inject(Auth);
  protected readonly org = inject(OrgContext);
  protected readonly account = inject(Account);

  protected readonly invitations = httpResource<MyInvitation[]>(() => myInvitationsUrl(), { defaultValue: [] });
  protected readonly pending = computed(() => (this.invitations.hasValue() ? this.invitations.value() : []));
  protected readonly firstName = computed(() => this.auth.profile()?.name.split(/\s+/)[0] ?? '');
  protected readonly failed = signal(false);
  protected readonly lock = LOCK_ICON;
  /** Each account can own one organization; owning one blocks creating another. */
  protected readonly owned = computed(() => this.org.organizations()?.find((o) => o.role === 'owner') ?? null);

  constructor() {
    this.org.load(true).catch(() => this.failed.set(true));
    this.account.load().catch(() => undefined);
  }
}
