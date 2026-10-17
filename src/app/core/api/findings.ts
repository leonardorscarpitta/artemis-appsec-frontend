import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FindingStatus, Severity } from '../domain';
import { StageId } from '../pipeline';
import { apiUrl } from './api';

/** Ecosystems reported by the scanners (npm, maven, pypi, go, debian, alpine…). */
export type Ecosystem = string;
export type FindingSort = 'cvss' | 'detected';
export type FindingKind = 'vulnerability' | 'secret' | 'code' | 'config' | 'license';
export const FINDING_KINDS: FindingKind[] = ['vulnerability', 'secret', 'code', 'config', 'license'];

export interface FindingLocation {
  path: string;
  line: number | null;
}

/**
 * Package, CVE and CVSS fields are only set for dependency vulnerabilities (and package for licenses);
 * secrets, code and configuration findings carry a rule and a file location instead.
 */
export interface FindingSummary {
  id: string;
  reference: string;
  kind: FindingKind;
  ruleId: string | null;
  location: FindingLocation | null;
  cve: string | null;
  repository: string;
  /** The repository was removed and this finding is kept as history. */
  repositoryRemoved: boolean;
  packageName: string | null;
  packageGroup: string | null;
  installedVersion: string | null;
  fixedVersion: string | null;
  ecosystem: Ecosystem | null;
  title: string;
  cvss: number | null;
  severity: Severity;
  status: FindingStatus;
  stage: StageId;
  tool: string;
  detectedAt: string;
  statusChangedAt: string;
  /** Remediation deadline from the organization's SLA for this severity (null without an SLA). */
  dueAt: string | null;
  /** Still open or triaged after its due date. */
  overdue: boolean;
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
  vector: string | null;
  cwe: string | null;
  timeline: FindingEvent[];
  related: FindingSummary[];
}

export interface FindingFilters {
  q?: string;
  kind?: FindingKind | '';
  severity?: Severity | '';
  status?: FindingStatus | '';
  repository?: string;
  sort?: FindingSort;
  dir?: 'asc' | 'desc';
}

export interface DashboardSummary {
  openFindings: number;
  criticalFindings: number;
  // Null when no open finding has a CVSS score (e.g. only secrets or code issues).
  averageCvss: number | null;
  lastScanAt: string | null;
  repositories: number;
  bySeverity: { severity: Severity; count: number }[];
  recent: FindingSummary[];
  /** Open findings past their remediation SLA. */
  overdueFindings: number;
  byKind: { kind: FindingKind; count: number }[];
  /** Top 5 repositories by open findings. */
  topRepositories: { repository: string; total: number; critical: number; high: number; medium: number; low: number }[];
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

export function locationLabel(location: FindingLocation | null): string {
  if (!location) return '';
  return location.line ? `${location.path}:${location.line}` : location.path;
}

/** Package (dependency findings) or file location (everything else). */
export function packageLabel(f: Pick<FindingSummary, 'packageName' | 'installedVersion' | 'location'>): string {
  if (f.packageName) return f.installedVersion ? `${f.packageName}@${f.installedVersion}` : f.packageName;
  return locationLabel(f.location) || '—';
}

/** Short identifier shown in lists: the CVE when there is one, otherwise the scanner rule. */
export function findingIdentifier(f: Pick<FindingSummary, 'cve' | 'ruleId' | 'reference'>): string {
  return f.cve ?? f.ruleId ?? f.reference;
}

/** Route segment for the detail page: CVE pages group every occurrence, other findings open by id. */
export function findingRoute(f: Pick<FindingSummary, 'cve' | 'id'>): string {
  return f.cve ?? f.id;
}

@Service()
export class FindingsApi {
  private readonly http = inject(HttpClient);

  /** Every finding of the organization as CSV (same filters as the list). */
  exportCsv(filters: Record<string, string> = {}): Observable<Blob> {
    return this.http.get(`${findingsUrl()}/export`, { params: filters, responseType: 'blob' });
  }

  /** Accepting a risk needs a justification (note, 10+ characters) and an expiry date (yyyy-MM-dd). */
  changeStatus(id: string, status: FindingStatus, note?: string, expiresAt?: string): Observable<FindingDetails> {
    return this.http.post<FindingDetails>(`${findingUrl(id)}/status`, { status, note: note ?? null, expiresAt: expiresAt ?? null });
  }
}
