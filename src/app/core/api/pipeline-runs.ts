import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Severity } from '../domain';
import { Phase, StageId } from '../pipeline';
import { apiUrl } from './api';

export type RunStatus = 'success' | 'failed' | 'running' | 'queued' | 'cancelled';
export type RunTrigger = 'push' | 'schedule' | 'manual' | 'mergeRequest';
export type StageStatus = 'passed' | 'failed' | 'warning' | 'running' | 'pending' | 'skipped';

export interface RunView {
  number: number;
  repository: string;
  branch: string;
  commit: string;
  message: string;
  trigger: RunTrigger;
  actor: string;
  status: RunStatus;
  startedAt: string;
  durationSeconds: number;
  newFindings: number;
  totalFindings: number;
  failedByPolicy: boolean;
  /** Monorepo folders this run scans; empty for the whole repository. */
  folders: string[];
}

export interface StageRunView {
  id: StageId;
  phase: Phase;
  tool: string;
  status: StageStatus;
  durationSeconds: number;
  findings: number;
  failedBy: Severity | null;
  log: string[];
}

export interface RunDetails {
  run: RunView;
  stages: StageRunView[];
}

/** Aggregates over the last 7 days. */
export interface RunsSummary {
  runs: number;
  successRate: number;
  averageDurationSeconds: number;
  failedByPolicy: number;
}

export interface RunFilter {
  repository: string;
  status: RunStatus | '';
  branch: string;
}

export const runsUrl = () => apiUrl('/pipeline-runs');
export const runsSummaryUrl = () => apiUrl('/pipeline-runs/summary');
export const runUrl = (number: number | string) => apiUrl(`/pipeline-runs/${encodeURIComponent(number)}`);

/** Query params for the runs list, omitting empty filters. */
export function runFilterParams(filter: RunFilter): Record<string, string> {
  return Object.fromEntries(Object.entries(filter).filter(([, v]) => v.trim() !== ''));
}

@Service()
export class PipelineRunsApi {
  private readonly http = inject(HttpClient);

  rerun(number: number): Observable<RunDetails> {
    return this.http.post<RunDetails>(`${runUrl(number)}/rerun`, null);
  }

  cancel(number: number): Observable<RunDetails> {
    return this.http.post<RunDetails>(`${runUrl(number)}/cancel`, null);
  }
}

export function formatDuration(seconds: number): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`;
}
