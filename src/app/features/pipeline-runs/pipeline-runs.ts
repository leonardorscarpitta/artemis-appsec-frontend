import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { REPOSITORIES } from '../../core/mock-data';
import { RUNS, RunStatus, RunTrigger, formatDuration } from '../../core/mock-runs';
import { RunStatusBadge } from './run-status';

const STATUSES: RunStatus[] = ['success', 'failed', 'running', 'queued', 'cancelled'];

@Component({
  selector: 'app-pipeline-runs',
  imports: [RouterLink, RunStatusBadge],
  templateUrl: './pipeline-runs.html',
  styleUrl: './pipeline-runs.scss',
})
export class PipelineRuns {
  protected readonly i18n = inject(I18n);

  protected readonly repositories = REPOSITORIES.map((r) => r.name);
  protected readonly statuses = STATUSES;
  protected readonly duration = formatDuration;

  protected readonly repository = signal('');
  protected readonly status = signal<RunStatus | ''>('');
  protected readonly branch = signal('');

  protected readonly runs = computed(() => {
    const repo = this.repository();
    const status = this.status();
    const branch = this.branch().trim().toLowerCase();
    return RUNS.filter(
      (r) =>
        (!repo || r.repository === repo) &&
        (!status || r.status === status) &&
        (!branch || r.branch.toLowerCase().includes(branch)),
    );
  });

  protected readonly hasFilters = computed(() => !!(this.repository() || this.status() || this.branch()));

  protected readonly summary = computed(() => {
    const finished = RUNS.filter((r) => r.status === 'success' || r.status === 'failed');
    const success = finished.filter((r) => r.status === 'success').length;
    const timed = RUNS.filter((r) => r.seconds && r.status !== 'running');
    return {
      total: RUNS.length,
      successRate: finished.length ? Math.round((success / finished.length) * 100) : 0,
      avgDuration: formatDuration(Math.round(timed.reduce((sum, r) => sum + r.seconds, 0) / (timed.length || 1))),
      failedByPolicy: RUNS.filter((r) => r.stages.some((s) => s.failedBy)).length,
    };
  });

  protected statusLabel(status: RunStatus): string {
    return this.i18n.t(`runs.status.${status}`);
  }

  protected triggerLabel(trigger: RunTrigger): string {
    return this.i18n.t(`runs.trigger.${trigger}`);
  }

  protected setStatus(event: Event): void {
    this.status.set(this.value(event) as RunStatus | '');
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected clear(): void {
    this.repository.set('');
    this.status.set('');
    this.branch.set('');
  }
}
