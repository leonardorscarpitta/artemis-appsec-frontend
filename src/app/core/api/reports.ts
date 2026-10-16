import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Severity } from '../mock-data';
import { apiUrl } from './api';

export type ReportType = 'summary' | 'compliance';
export type ReportAuthor = 'schedule' | 'user';
export type ReportStatus = 'ready' | 'generating';
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
}

export interface TrendPoint {
  week: string;
  opened: number;
  fixed: number;
}

export interface TopRisk {
  cve: string;
  repository: string;
  cvss: number;
  ageDays: number;
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
}
