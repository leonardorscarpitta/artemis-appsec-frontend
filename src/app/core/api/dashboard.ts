import { apiUrl } from './api';

export type TrendPeriod = 30 | 90;

/** One day of the period, already bucketed in the browser's time zone by the API. */
export interface TrendDay {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  detected: number;
  fixed: number;
  runsSucceeded: number;
  runsFailed: number;
  runsCancelled: number;
}

export interface DashboardTrends {
  periodDays: number;
  timeZone: string;
  days: TrendDay[];
  /** Null when nothing was fixed in the period. */
  meanTimeToRemediateDays: number | null;
  fixedInPeriod: number;
}

export const dashboardTrendsUrl = () => apiUrl('/dashboard/trends');

export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}
