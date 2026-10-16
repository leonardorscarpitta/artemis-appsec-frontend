import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Severity } from '../domain';
import { FailThreshold, StageId } from '../pipeline';
import { apiUrl } from './api';

export interface StageGate {
  stage: StageId;
  /** Null for artifact-only stages. */
  failOn: FailThreshold | null;
  required: boolean;
}

export interface Sla {
  severity: Severity;
  days: number;
}

export interface Policies {
  stages: StageGate[];
  slaDays: Sla[];
  licensesAllowed: string[];
  licensesDenied: string[];
}

export interface RiskAcceptance {
  id: string;
  cve: string;
  repository: string;
  justification: string;
  approvedBy: string;
  expiresAt: string;
}

export const policiesUrl = () => apiUrl('/policies');
export const riskAcceptancesUrl = () => apiUrl('/risk-acceptances');

@Service()
export class PoliciesApi {
  private readonly http = inject(HttpClient);

  update(policies: Policies): Observable<Policies> {
    return this.http.put<Policies>(policiesUrl(), policies);
  }

  revokeRiskAcceptance(id: string): Observable<void> {
    return this.http.delete<void>(`${riskAcceptancesUrl()}/${encodeURIComponent(id)}`);
  }
}
