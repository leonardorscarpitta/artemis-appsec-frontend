import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Severity } from '../domain';
import { apiUrl } from './api';

export type ReportType = 'summary' | 'compliance' | 'dependencies';
export type ReportAuthor = 'schedule' | 'user';
export type ReportStatus = 'ready' | 'generating' | 'failed';
/** Who wrote the summary and recommendations. */
export type ReportNarrative = 'ai' | 'artemis';
/** Why AI text was not used although the organization has AI: provider unavailable or daily limit reached. */
export type ReportAiNotice = 'unavailable' | 'limit';
export type ReportError = 'generation-failed' | 'too-many-attempts';
export type ReportPeriod = 'week' | 'month' | 'quarter';

export interface ReportSummary {
  id: string;
  title: string;
  type: ReportType;
  /** Repository name, or null for the whole organization. */
  scope: string | null;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  generatedBy: ReportAuthor;
  status: ReportStatus;
  error: ReportError | null;
  narrative: ReportNarrative | null;
}

export interface TrendPoint {
  week: string;
  opened: number;
  fixed: number;
}

export interface TopRisk {
  /** CVE, or the rule id of findings without one. */
  cve: string;
  repository: string;
  cvss: number | null;
  ageDays: number;
  title: string | null;
  severity: Severity | null;
  kind: string | null;
  packageName: string | null;
  fixedVersion: string | null;
}

export interface OwaspCategory {
  id: string;
  name: string;
  findings: number;
}

export interface ReportContent {
  summary: string;
  kpis: { opened: number; fixed: number; open: number; mttrDays: number; slaCompliance: number };
  trend: TrendPoint[];
  severity: Record<Severity, number>;
  topRisks: TopRisk[];
  owasp: OwaspCategory[];
  recommendations: string[];
  narrative: ReportNarrative | null;
  aiNotice: ReportAiNotice | null;
  /** Set when the AI text is written in the organization's language rather than the reader's. */
  textLanguage: 'en-US' | 'pt-BR' | null;
  /** Only in dependency (SBOM) reports. */
  dependencies: Dependencies | null;
}

export type ComponentConcern = 'unknown-publisher' | 'low-adoption' | 'typosquat-risk' | 'unmaintained' | 'deprecated' | 'license' | 'other';
export type ImageStanding = 'official' | 'widely-used' | 'unknown';

/** Built from the latest SBOM of each repository; the notes are the AI supply-chain review (null without AI). */
export interface Dependencies {
  components: number;
  unique: number;
  vulnerable: number;
  withoutLicense: number;
  ecosystems: Record<string, number>;
  licenses: { license: string; components: number }[];
  repositories: {
    repository: string;
    runNumber: number;
    scannedAt: string;
    folders: string[];
    components: number;
    vulnerable: number;
    withoutLicense: number;
    image: string | null;
  }[];
  vulnerableComponents: {
    repository: string;
    name: string;
    version: string;
    fixedVersion: string | null;
    severity: Severity;
    vulnerabilities: number;
    ids: string[];
  }[];
  withoutSbom: string[];
  componentNotes: { component: string; concern: ComponentConcern; note: string }[] | null;
  imageNotes: { image: string; standing: ImageStanding; note: string }[] | null;
}

export interface ReportDetails {
  report: ReportSummary;
  /** Null while the report is being generated. */
  content: ReportContent | null;
}

export interface GenerateReport {
  type: ReportType;
  scope: string | null;
  period: ReportPeriod;
}

export const reportsUrl = () => apiUrl('/reports');
export const reportUrl = (id: string) => apiUrl(`/reports/${encodeURIComponent(id)}`);

@Service()
export class ReportsApi {
  private readonly http = inject(HttpClient);

  generate(body: GenerateReport): Observable<ReportSummary> {
    return this.http.post<ReportSummary>(reportsUrl(), body);
  }

  retry(id: string): Observable<ReportSummary> {
    return this.http.post<ReportSummary>(`${reportUrl(id)}/retry`, {});
  }
}
