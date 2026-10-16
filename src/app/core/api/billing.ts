import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from './api';

export type PlanId = 'free' | 'pro';
export type Feature = 'aiTriage';

export interface Plan {
  id: PlanId;
  monthlyPriceCents: number;
  currency: string;
  features: Feature[];
}

export interface BillingOverview {
  enabled: boolean;
  currentPlan: PlanId;
  since: string;
  plans: Plan[];
  entitlements: Feature[];
}

export const billingUrl = () => apiUrl('/billing');

@Service()
export class BillingApi {
  private readonly http = inject(HttpClient);

  changePlan(plan: PlanId): Observable<BillingOverview> {
    return this.http.put<BillingOverview>(`${billingUrl()}/subscription`, { plan });
  }
}
