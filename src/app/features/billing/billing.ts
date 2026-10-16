import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { problemMessage } from '../../core/api/api';
import { BillingApi, BillingOverview, PLAN_FEATURES, Plan, PlanId, billingUrl, formatPrice } from '../../core/api/billing';
import { I18n } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';
import { RequestState } from '../../shared/request-state';
import { RoleNotice } from '../../shared/role-notice';

@Component({
  selector: 'app-billing',
  imports: [DatePipe, RequestState, RoleNotice],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class Billing {
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);
  private readonly api = inject(BillingApi);

  protected readonly billing = httpResource<BillingOverview>(() => billingUrl());
  protected readonly features = PLAN_FEATURES;
  protected readonly changing = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly currentPlan = computed(() => this.billing.value()?.currentPlan);

  protected readonly usagePercent = computed(() => {
    const usage = this.billing.value()?.usage;
    return usage ? Math.min(100, (usage.scansThisMonth / usage.scanLimit) * 100) : 0;
  });

  protected price(plan: Plan): string {
    return formatPrice(plan, this.i18n.lang());
  }

  protected scans(plan: Plan): string {
    return this.i18n.t('billing.f.scans').replace('{n}', String(plan.monthlyScanLimit));
  }

  protected planName(id: PlanId): string {
    return this.i18n.t(`billing.plan.${id}`);
  }

  protected planTagline(id: PlanId): string {
    return this.i18n.t(`billing.plan.${id}.tagline`);
  }

  protected choose(plan: PlanId): void {
    this.changing.set(true);
    this.error.set(null);
    this.api.changePlan(plan).subscribe({
      next: (updated) => {
        this.billing.set(updated);
        this.changing.set(false);
      },
      error: (err) => {
        this.changing.set(false);
        this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }
}
