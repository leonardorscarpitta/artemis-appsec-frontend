import { Severity } from '../../core/domain';

/** Static sample shown in the public home page's product preview (not real customer data). */
export const HOME_PREVIEW = {
  open: 14,
  critical: 5,
  avg: '7.4',
  repos: 3,
  severities: [
    { severity: 'critical', count: 5 },
    { severity: 'high', count: 4 },
    { severity: 'medium', count: 4 },
    { severity: 'low', count: 1 },
  ] satisfies { severity: Severity; count: number }[],
  rows: [
    { id: 'F-1102', cve: 'CVE-2024-47875', pkg: 'dompurify@3.1.2', cvss: 10 },
    { id: 'F-1201', cve: 'CVE-2025-24813', pkg: 'tomcat-embed-core@10.1.30', cvss: 9.8 },
    { id: 'F-1203', cve: 'CVE-2024-45490', pkg: 'libexpat1@2.5.0-1', cvss: 9.8 },
    { id: 'F-1101', cve: 'CVE-2025-29927', pkg: 'next@14.2.10', cvss: 9.1 },
  ],
};
