import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  RunStatus,
  RunTrigger,
  RunView,
  RunsSummary,
  formatDuration,
  runFilterParams,
  runsSummaryUrl,
  runsUrl,
} from '../../core/api/pipeline-runs';
import { ProjectSummary, repositoriesUrl } from '../../core/api/projects';
import { I18n } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';
import { RunStatusBadge } from './run-status';
import { OrgSummary } from '../../core/org/org-summary';
import { NoRepositories } from '../../shared/no-repositories';
import { OrgLink } from '../../shared/org-link';

const STATUSES: RunStatus[] = ['success', 'failed', 'running', 'queued', 'cancelled'];

@Component({
  selector: 'app-pipeline-runs',
  imports: [RouterLink, DatePipe, RunStatusBadge, RequestState, OrgLink, NoRepositories],
  templateUrl: './pipeline-runs.html',
  styleUrl: './pipeline-runs.scss',
})
export class PipelineRuns {
  protected readonly orgSummary = inject(OrgSummary);
  protected readonly i18n = inject(I18n);

  protected readonly statuses = STATUSES;
  protected readonly duration = formatDuration;

  protected readonly repository = signal('');
  protected readonly status = signal<RunStatus | ''>('');
  protected readonly branch = signal('');

  private readonly projects = httpResource<ProjectSummary[]>(() => repositoriesUrl());
  protected readonly repositories = computed(() => (this.projects.value() ?? []).map((p) => p.name));

  protected readonly summary = httpResource<RunsSummary>(() => runsSummaryUrl());
  protected readonly runs = httpResource<RunView[]>(() => ({
    url: runsUrl(),
    params: runFilterParams({ repository: this.repository(), status: this.status(), branch: this.branch() }),
  }));

  protected readonly hasFilters = computed(() => !!(this.repository() || this.status() || this.branch()));

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
