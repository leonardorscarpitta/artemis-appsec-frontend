import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { problemMessage } from '../../core/api/api';
import { PipelineRunsApi, RunDetails, RunTrigger, StageStatus, formatDuration, runUrl } from '../../core/api/pipeline-runs';
import { I18n } from '../../core/i18n';
import { Severity } from '../../core/domain';
import { PHASES, Phase, StageId } from '../../core/pipeline';
import { RequestState } from '../../shared/request-state';
import { RunStatusBadge } from './run-status';
import { OrgLink } from '../../shared/org-link';
import { OrgContext } from '../../core/org/org-context';

@Component({
  selector: 'app-run-detail',
  imports: [RouterLink, DatePipe, RunStatusBadge, RequestState, OrgLink],
  templateUrl: './run-detail.html',
  styleUrl: './run-detail.scss',
})
export class RunDetail {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(PipelineRunsApi);
  private readonly router = inject(Router);
  protected readonly org = inject(OrgContext);

  readonly id = input.required<string>();

  protected readonly details = httpResource<RunDetails>(() => runUrl(this.id()));
  protected readonly notFound = computed(() => {
    const status = (this.details.error() as { status?: number } | undefined)?.status;
    return status === 404 || status === 400;
  });
  protected readonly run = computed(() => this.details.value()?.run);
  protected readonly busy = signal(false);
  protected readonly message = signal('');
  protected readonly error = signal('');
  protected readonly duration = formatDuration;

  protected readonly live = computed(() => this.run()?.status === 'running' || this.run()?.status === 'queued');
  // Stages report only when they finish, and the scanner runs them in order: the first pending one is in progress.
  protected readonly currentStage = computed(() =>
    this.run()?.status === 'running' ? this.ordered().find((s) => s.status === 'pending') ?? null : null,
  );
  protected readonly progress = computed(() => {
    const stages = this.ordered();
    const done = stages.filter((s) => s.status !== 'pending').length;
    return { done, total: stages.length, step: Math.min(done + 1, stages.length), percent: stages.length ? (done / stages.length) * 100 : 0 };
  });
  private readonly ordered = computed(() => this.phases().flatMap((p) => p.stages));

  constructor() {
    // Follows the run while the scanner works on it; stops once it finishes.
    effect((onCleanup) => {
      if (!this.live()) return;
      const timer = setInterval(() => this.details.reload(), 2500);
      onCleanup(() => clearInterval(timer));
    });
  }

  protected displayStatus(id: StageId, status: StageStatus): StageStatus {
    return this.currentStage()?.id === id ? 'running' : status;
  }

  protected readonly phases = computed(() => {
    const stages = this.details.value()?.stages ?? [];
    return PHASES.map((phase) => ({ phase, stages: stages.filter((s) => s.phase === phase) })).filter(
      (p) => p.stages.length,
    );
  });

  protected rerun(number: number): void {
    this.act(() =>
      this.api.rerun(number).subscribe({
        next: (created) => {
          this.busy.set(false);
          this.router.navigate([this.org.url('/pipelines'), created.run.number]);
        },
        error: (err) => this.fail(err),
      }),
    );
  }

  protected cancel(number: number): void {
    this.act(() =>
      this.api.cancel(number).subscribe({
        next: (updated) => {
          this.busy.set(false);
          this.details.set(updated);
          this.message.set(this.i18n.t('runs.cancelledMsg'));
        },
        error: (err) => this.fail(err),
      }),
    );
  }

  protected stageName(id: StageId): string {
    return this.i18n.t(`stage.${id}.name`);
  }

  protected phaseName(phase: Phase): string {
    return this.i18n.t(`pipe.phase.${phase}`);
  }

  protected triggerLabel(trigger: RunTrigger): string {
    return this.i18n.t(`runs.trigger.${trigger}`);
  }

  protected failLabel(threshold: Severity): string {
    return this.i18n.t(`pipe.fail.${threshold}`);
  }

  private act(request: () => void): void {
    this.busy.set(true);
    this.message.set('');
    this.error.set('');
    request();
  }

  private fail(err: unknown): void {
    this.busy.set(false);
    this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
  }
}
