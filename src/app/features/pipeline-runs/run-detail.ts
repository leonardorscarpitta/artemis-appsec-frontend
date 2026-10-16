import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { RUNS, RunStatus, RunTrigger, formatDuration } from '../../core/mock-runs';
import { FailThreshold, PHASES, Phase, StageId } from '../../core/pipeline';
import { RunStatusBadge } from './run-status';

@Component({
  selector: 'app-run-detail',
  imports: [RouterLink, RunStatusBadge],
  templateUrl: './run-detail.html',
  styleUrl: './run-detail.scss',
})
export class RunDetail {
  protected readonly i18n = inject(I18n);

  readonly id = input.required<string>();

  protected readonly run = computed(() => RUNS.find((r) => r.id === Number(this.id())));
  // Local-only until the API exists: re-run/cancel just change what is shown.
  protected readonly status = linkedSignal<RunStatus | undefined>(() => this.run()?.status);
  protected readonly message = signal('');
  protected readonly duration = formatDuration;

  protected readonly phases = computed(() => {
    const stages = this.run()?.stages ?? [];
    return PHASES.map((phase) => ({ phase, stages: stages.filter((s) => s.phase === phase) })).filter(
      (p) => p.stages.length,
    );
  });

  protected rerun(): void {
    this.status.set('queued');
    this.message.set(this.i18n.t('runs.rerunQueued'));
  }

  protected cancel(): void {
    this.status.set('cancelled');
    this.message.set(this.i18n.t('runs.cancelledMsg'));
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

  protected failLabel(threshold: FailThreshold): string {
    return this.i18n.t(`pipe.fail.${threshold}`);
  }
}
