import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BillingOverview, billingUrl } from '../../core/api/billing';
import { DashboardSummary, dashboardUrl } from '../../core/api/findings';
import { OrganizationSummary } from '../../core/api/organization';
import { I18n, TranslationKey } from '../../core/i18n';
import { ORG_HEADER } from '../../core/org/org-context';

/** One organization on the home workspace, with its headline numbers. */
@Component({
  selector: 'app-home-org-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './home-org-card.html',
  styleUrl: './home-workspace.scss',
})
export class HomeOrgCard {
  protected readonly i18n = inject(I18n);

  readonly org = input.required<OrganizationSummary>();

  // The home page has no organization in its URL, so each card scopes its own requests.
  private readonly headers = computed(() => ({ [ORG_HEADER]: this.org().slug }));
  protected readonly summary = httpResource<DashboardSummary>(() => ({ url: dashboardUrl(), headers: this.headers() }));
  protected readonly billing = httpResource<BillingOverview>(() => ({ url: billingUrl(), headers: this.headers() }));

  protected readonly usage = computed(() => this.billing.value()?.usage ?? null);
  protected readonly usagePercent = computed(() => {
    const u = this.usage();
    return u && u.scanLimit > 0 ? Math.min(100, Math.round((u.scansThisMonth / u.scanLimit) * 100)) : 0;
  });

  protected roleLabel(role: string): string {
    return this.i18n.t(`team.role.${role}` as TranslationKey);
  }

  protected planLabel(plan: string): string {
    return this.i18n.t(`nav.plan.${plan}` as TranslationKey);
  }
}
