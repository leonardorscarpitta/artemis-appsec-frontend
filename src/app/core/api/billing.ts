import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslationKey } from '../i18n';
import { apiUrl } from './api';

export type PlanId = 'free' | 'pro';
export type Feature = 'aiTriage' | 'scheduledScans' | 'organizationRename';

export interface Plan {
  id: PlanId;
  monthlyPriceCents: number;
  currency: string;
  monthlyScanLimit: number;
  features: Feature[];
}

export interface Usage {
  scansThisMonth: number;
  scanLimit: number;
  periodStart: string;
}

export interface BillingOverview {
  enabled: boolean;
  currentPlan: PlanId;
  since: string;
  plans: Plan[];
  entitlements: Feature[];
  usage: Usage;
}

export const billingUrl = () => apiUrl('/billing');
/** Public endpoint (no sign-in required). */
export const plansUrl = () => apiUrl('/billing/plans');

/** What each plan includes, besides its scan limit; AI triage is the PRO differentiator. */
export const PLAN_FEATURES: Record<PlanId, TranslationKey[]> = {
  free: ['billing.f.scanning', 'billing.f.pipeline', 'billing.f.dashboard', 'billing.f.reports', 'billing.f.team'],
  pro: ['billing.f.everythingFree', 'billing.f.schedules', 'billing.f.rename', 'billing.f.aiTriage', 'billing.f.aiReports'],
};

export function formatPrice(plan: Plan, lang: string): string {
  return new Intl.NumberFormat(lang, { style: 'currency', currency: plan.currency }).format(plan.monthlyPriceCents / 100);
}

@Service()
export class BillingApi {
  private readonly http = inject(HttpClient);

  changePlan(plan: PlanId): Observable<BillingOverview> {
    return this.http.put<BillingOverview>(`${billingUrl()}/subscription`, { plan });
  }
}
