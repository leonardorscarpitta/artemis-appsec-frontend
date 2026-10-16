import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FindingStatus, Severity } from '../domain';
import { StageId } from '../pipeline';
import { apiUrl } from './api';

export type Ecosystem = 'npm' | 'maven' | 'debian';
export type FindingSort = 'cvss' | 'detected';

export interface FindingSummary {
  id: string;
  reference: string;
  cve: string;
  repository: string;
  packageName: string;
  packageGroup: string | null;
  installedVersion: string;
  fixedVersion: string | null;
  ecosystem: Ecosystem;
  title: string;
  cvss: number;
  severity: Severity;
  status: FindingStatus;
  stage: StageId;
  tool: string;
  detectedAt: string;
  statusChangedAt: string;
}

export interface FindingEvent {
  type: 'detected' | 'statusChanged';
  status: FindingStatus;
  note: string | null;
  occurredAt: string;
}

export interface FindingDetails {
  finding: FindingSummary;
  description: string;
  vector: string;
  cwe: string | null;
  timeline: FindingEvent[];
  related: FindingSummary[];
}

export interface FindingFilters {
  q?: string;
  severity?: Severity | '';
  status?: FindingStatus | '';
  repository?: string;
  sort?: FindingSort;
  dir?: 'asc' | 'desc';
}

export interface DashboardSummary {
  openFindings: number;
  criticalFindings: number;
  averageCvss: number;
  lastScanAt: string | null;
  repositories: number;
  bySeverity: { severity: Severity; count: number }[];
  recent: FindingSummary[];
}

export const findingsUrl = () => apiUrl('/findings');
export const findingUrl = (id: string) => apiUrl(`/findings/${encodeURIComponent(id)}`);
export const dashboardUrl = () => apiUrl('/dashboard/summary');

/** Drops empty filters so they are not sent as query parameters. */
export function findingParams(filters: FindingFilters): Record<string, string> {
  return Object.fromEntries(
    Object.entries(filters).filter((entry): entry is [string, string] => !!entry[1]?.toString().trim()),
  );
}

export function packageLabel(f: Pick<FindingSummary, 'packageName' | 'installedVersion'>): string {
  return `${f.packageName}@${f.installedVersion}`;
}

@Service()
export class FindingsApi {
  private readonly http = inject(HttpClient);

  changeStatus(id: string, status: FindingStatus, note?: string): Observable<FindingDetails> {
    return this.http.post<FindingDetails>(`${findingUrl(id)}/status`, { status, note: note ?? null });
  }
}
