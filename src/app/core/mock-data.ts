export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'triaged' | 'falsePositive' | 'fixed';
export type Stack = 'React' | 'Angular' | 'Java + Spring';

export interface Finding {
  cve: string;
  pkg: string;
  repository: string;
  cvss: number;
  status: FindingStatus;
  detected: string;
}

export interface Repository {
  name: string;
  url: string;
  stack: Stack;
  schedule: string;
  findings: number;
  lastScan: string;
}

export function severityOf(cvss: number): Severity {
  if (cvss >= 9) return 'critical';
  if (cvss >= 7) return 'high';
  if (cvss >= 4) return 'medium';
  return 'low';
}

// Placeholder data until the API is available.
export const FINDINGS: Finding[] = [
  { cve: 'CVE-2025-29927', pkg: 'next@14.2.10', repository: 'storefront-web', cvss: 9.1, status: 'open', detected: '2026-10-15' },
  { cve: 'CVE-2024-38816', pkg: 'spring-webmvc@6.1.12', repository: 'payments-api', cvss: 7.5, status: 'triaged', detected: '2026-10-14' },
  { cve: 'CVE-2024-45296', pkg: 'path-to-regexp@0.1.7', repository: 'storefront-web', cvss: 7.5, status: 'open', detected: '2026-10-14' },
  { cve: 'CVE-2025-24813', pkg: 'tomcat-embed-core@10.1.30', repository: 'payments-api', cvss: 9.8, status: 'open', detected: '2026-10-13' },
  { cve: 'CVE-2024-21490', pkg: 'angular@1.8.3', repository: 'backoffice', cvss: 7.5, status: 'falsePositive', detected: '2026-10-12' },
  { cve: 'CVE-2024-47764', pkg: 'cookie@0.6.0', repository: 'backoffice', cvss: 5.3, status: 'open', detected: '2026-10-11' },
  { cve: 'CVE-2024-52798', pkg: 'path-to-regexp@0.1.10', repository: 'storefront-web', cvss: 5.9, status: 'fixed', detected: '2026-10-09' },
  { cve: 'CVE-2024-38808', pkg: 'spring-expression@6.1.10', repository: 'payments-api', cvss: 4.3, status: 'triaged', detected: '2026-10-08' },
  { cve: 'CVE-2024-55565', pkg: 'nanoid@3.3.7', repository: 'backoffice', cvss: 3.7, status: 'open', detected: '2026-10-07' },
];

export const REPOSITORIES: Repository[] = [
  { name: 'storefront-web', url: 'git@github.com:acme/storefront-web.git', stack: 'React', schedule: '24h', findings: 3, lastScan: '2026-10-15 22:10' },
  { name: 'payments-api', url: 'git@github.com:acme/payments-api.git', stack: 'Java + Spring', schedule: 'push', findings: 3, lastScan: '2026-10-15 21:42' },
  { name: 'backoffice', url: 'git@gitlab.com:acme/backoffice.git', stack: 'Angular', schedule: '7d', findings: 3, lastScan: '2026-10-12 08:00' },
];
