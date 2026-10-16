import { Severity } from './mock-data';
import { FailThreshold, StageId } from './pipeline';

export interface RiskAcceptance {
  cve: string;
  repository: string;
  justification: string;
  approvedBy: string;
  expires: string;
}

export interface Policies {
  failOn: Partial<Record<StageId, FailThreshold>>;
  required: StageId[];
  slaDays: Record<Severity, number>;
  licensesAllowed: string[];
  licensesDenied: string[];
  exceptions: RiskAcceptance[];
}

// Placeholder data until the API is available.
export function defaultPolicies(): Policies {
  return {
    failOn: {
      secrets: 'low',
      sast: 'high',
      sca: 'critical',
      license: 'never',
      dockerfile: 'high',
      image: 'critical',
      iac: 'high',
      dast: 'high',
    },
    required: ['secrets', 'sca'],
    slaDays: { critical: 7, high: 30, medium: 90, low: 180 },
    licensesAllowed: ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC'],
    licensesDenied: ['GPL-3.0', 'AGPL-3.0', 'SSPL-1.0'],
    exceptions: [
      { cve: 'CVE-2024-21490', repository: 'backoffice', justification: 'AngularJS is only used in an internal admin page scheduled for removal.', approvedBy: 'Security team', expires: '2026-12-31' },
      { cve: 'CVE-2024-55565', repository: 'backoffice', justification: 'nanoid is not used to generate security tokens.', approvedBy: 'Security team', expires: '2027-03-31' },
    ],
  };
}
