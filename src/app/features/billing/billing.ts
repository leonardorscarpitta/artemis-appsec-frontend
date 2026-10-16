import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { problemMessage } from '../../core/api/api';
import { BillingApi, BillingOverview, Plan, PlanId, billingUrl } from '../../core/api/billing';
import { I18n, TranslationKey } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';

/** What each plan includes; AI triage is the PRO differentiator. */
const PLAN_FEATURES: Record<PlanId, TranslationKey[]> = {
  free: ['billing.f.scanning', 'billing.f.pipeline', 'billing.f.dashboard', 'billing.f.reports', 'billing.f.team'],
  pro: ['billing.f.everythingFree', 'billing.f.aiTriage', 'billing.f.aiReports'],
};

@Component({
  selector: 'app-billing',
  imports: [DatePipe, RequestState],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class Billing {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(BillingApi);

  protected readonly billing = httpResource<BillingOverview>(() => billingUrl());
  protected readonly features = PLAN_FEATURES;
  protected readonly changing = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly currentPlan = computed(() => this.billing.value()?.currentPlan);

  protected price(plan: Plan): string {
    return new Intl.NumberFormat(this.i18n.lang(), { style: 'currency', currency: plan.currency }).format(
      plan.monthlyPriceCents / 100,
    );
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
