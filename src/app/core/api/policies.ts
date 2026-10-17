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

/** {@code findingId}, {@code reference} and {@code title} are null for acceptances not linked to a finding. */
export interface RiskAcceptance {
  id: string;
  findingId: string | null;
  reference: string | null;
  title: string | null;
  cve: string | null;
  repository: string;
  justification: string;
  approvedBy: string;
  expiresAt: string;
  expired: boolean;
}

/** {@code finding} is a finding reference (F-1101) or a CVE; a CVE accepts every open finding of it in the repository. */
export interface AcceptRisk {
  finding: string;
  repository: string;
  justification: string;
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

  acceptRisk(body: AcceptRisk): Observable<RiskAcceptance[]> {
    return this.http.post<RiskAcceptance[]>(riskAcceptancesUrl(), body);
  }

  revokeRiskAcceptance(id: string): Observable<void> {
    return this.http.delete<void>(`${riskAcceptancesUrl()}/${encodeURIComponent(id)}`);
  }
}
