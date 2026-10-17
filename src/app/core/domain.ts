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

/** Status changes a user can make (fixed is set by scans). */
export const STATUS_ACTIONS = ['triaged', 'falsePositive', 'accepted', 'open'] as const;
export type StatusAction = (typeof STATUS_ACTIONS)[number];

// Mirrors the transitions the API allows.
export const STATUS_TRANSITIONS: Record<FindingStatus, FindingStatus[]> = {
  open: ['triaged', 'falsePositive', 'accepted', 'fixed'],
  triaged: ['open', 'falsePositive', 'accepted', 'fixed'],
  falsePositive: ['open'],
  accepted: ['open'],
  fixed: ['open'],
};

export function severityOf(cvss: number): Severity {
  if (cvss >= 9) return 'critical';
  if (cvss >= 7) return 'high';
  if (cvss >= 4) return 'medium';
  return 'low';
}

/** Local date {@code days} from today as yyyy-MM-dd. */
export function isoDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
