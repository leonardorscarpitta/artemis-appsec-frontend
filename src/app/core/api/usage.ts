import { apiUrl } from './api';

/** Optional features the Artemis administrators enable per organization. */
export type Feature = 'aiTriage' | 'scheduledScans' | 'organizationRename';
export const FEATURES: Feature[] = ['scheduledScans', 'organizationRename', 'aiTriage'];

export interface UsageOverview {
  scansThisMonth: number;
  scanLimit: number;
  periodStart: string;
  /** Start of the next month (UTC), when the counter starts again. */
  resetsAt: string;
  features: Feature[];
}

export const usageUrl = () => apiUrl('/usage');
