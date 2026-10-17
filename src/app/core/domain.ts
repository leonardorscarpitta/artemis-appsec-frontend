import type { TranslationKey } from './i18n';

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'triaged' | 'falsePositive' | 'accepted' | 'fixed';
export type Stack =
  | 'React'
  | 'Angular'
  | 'Java + Spring'
  | 'Python + Flask'
  | 'Python + FastAPI'
  | 'Python + Django';

export const STATUS_KEYS: Record<FindingStatus, TranslationKey> = {
  open: 'status.open',
  triaged: 'status.triaged',
  falsePositive: 'status.falsePositive',
  accepted: 'vuln.status.accepted',
  fixed: 'status.fixed',
};

export function severityOf(cvss: number): Severity {
  if (cvss >= 9) return 'critical';
  if (cvss >= 7) return 'high';
  if (cvss >= 4) return 'medium';
  return 'low';
}
