import { Severity } from './mock-data';

export type ReportType = 'summary' | 'aiTriage' | 'compliance';
export type ReportAuthor = 'schedule' | 'ai' | 'user';
export type ReportStatus = 'ready' | 'generating';

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  // null means the whole organization.
  scope: string | null;
  period: string;
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

export interface ReportDetail {
  kpis: { opened: number; fixed: number; open: number; mttrDays: number; slaCompliance: number };
  trend: TrendPoint[];
  severity: Record<Severity, number>;
  topRisks: TopRisk[];
  aiTriage: { reviewed: number; dismissed: number; confidence: number };
  owasp: OwaspCategory[];
}

// Placeholder data until the API is available.
export const REPORTS: Report[] = [
  { id: 'r-2026-10-w41', title: 'Weekly security summary', type: 'summary', scope: null, period: '2026-10-05 – 2026-10-11', generatedAt: '2026-10-12 06:00', generatedBy: 'schedule', status: 'ready' },
  { id: 'r-2026-10-ai-payments', title: 'AI triage – payments-api', type: 'aiTriage', scope: 'payments-api', period: '2026-10-01 – 2026-10-15', generatedAt: '2026-10-15 21:50', generatedBy: 'ai', status: 'ready' },
  { id: 'r-2026-09-month', title: 'Monthly security summary', type: 'summary', scope: null, period: '2026-09-01 – 2026-09-30', generatedAt: '2026-10-01 06:00', generatedBy: 'schedule', status: 'ready' },
  { id: 'r-2026-q3-owasp', title: 'OWASP Top 10 compliance – Q3', type: 'compliance', scope: null, period: '2026-07-01 – 2026-09-30', generatedAt: '2026-10-02 10:14', generatedBy: 'user', status: 'ready' },
  { id: 'r-2026-10-storefront', title: 'Weekly security summary – storefront-web', type: 'summary', scope: 'storefront-web', period: '2026-10-12 – 2026-10-18', generatedAt: '2026-10-16 07:30', generatedBy: 'user', status: 'generating' },
];

export const REPORT_DETAIL: ReportDetail = {
  kpis: { opened: 14, fixed: 11, open: 7, mttrDays: 6.4, slaCompliance: 92 },
  trend: [
    { week: 'W34', opened: 9, fixed: 4 },
    { week: 'W35', opened: 12, fixed: 7 },
    { week: 'W36', opened: 7, fixed: 9 },
    { week: 'W37', opened: 10, fixed: 8 },
    { week: 'W38', opened: 6, fixed: 10 },
    { week: 'W39', opened: 8, fixed: 6 },
    { week: 'W40', opened: 5, fixed: 9 },
    { week: 'W41', opened: 4, fixed: 7 },
  ],
  severity: { critical: 2, high: 2, medium: 2, low: 1 },
  topRisks: [
    { cve: 'CVE-2025-24813', repository: 'payments-api', cvss: 9.8, ageDays: 3 },
    { cve: 'CVE-2025-29927', repository: 'storefront-web', cvss: 9.1, ageDays: 1 },
    { cve: 'CVE-2024-45296', repository: 'storefront-web', cvss: 7.5, ageDays: 2 },
    { cve: 'CVE-2024-38816', repository: 'payments-api', cvss: 7.5, ageDays: 2 },
    { cve: 'CVE-2024-47764', repository: 'backoffice', cvss: 5.3, ageDays: 5 },
  ],
  aiTriage: { reviewed: 23, dismissed: 6, confidence: 87 },
  owasp: [
    { id: 'A01', name: 'Broken Access Control', findings: 1 },
    { id: 'A02', name: 'Cryptographic Failures', findings: 0 },
    { id: 'A03', name: 'Injection', findings: 2 },
    { id: 'A04', name: 'Insecure Design', findings: 0 },
    { id: 'A05', name: 'Security Misconfiguration', findings: 1 },
    { id: 'A06', name: 'Vulnerable and Outdated Components', findings: 6 },
    { id: 'A07', name: 'Identification and Authentication Failures', findings: 1 },
    { id: 'A08', name: 'Software and Data Integrity Failures', findings: 0 },
    { id: 'A09', name: 'Security Logging and Monitoring Failures', findings: 0 },
    { id: 'A10', name: 'Server-Side Request Forgery', findings: 0 },
  ],
};
