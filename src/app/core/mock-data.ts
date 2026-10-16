import type { TranslationKey } from './i18n';

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'triaged' | 'falsePositive' | 'accepted' | 'fixed';
export type Stack = 'React' | 'Angular' | 'Java + Spring';

export interface Repository {
  name: string;
  url: string;
  stack: Stack;
  schedule: string;
  findings: number;
  lastScan: string;
}

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

// Static repository list still used by screens not yet connected to the API.
export const REPOSITORIES: Repository[] = [
  { name: 'storefront-web', url: 'git@github.com:acme/storefront-web.git', stack: 'React', schedule: '24h', findings: 4, lastScan: '2026-10-15 22:10' },
  { name: 'payments-api', url: 'git@github.com:acme/payments-api.git', stack: 'Java + Spring', schedule: 'push', findings: 6, lastScan: '2026-10-15 21:42' },
  { name: 'backoffice', url: 'git@gitlab.com:acme/backoffice.git', stack: 'Angular', schedule: '7d', findings: 4, lastScan: '2026-10-12 08:00' },
];
