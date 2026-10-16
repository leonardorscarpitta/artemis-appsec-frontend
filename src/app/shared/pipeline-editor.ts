import { Component, computed, inject, model, signal } from '@angular/core';
import { I18n } from '../core/i18n';
import {
  CiProvider,
  FAIL_THRESHOLDS,
  FailThreshold,
  PHASES,
  Phase,
  PipelineStage,
  Preset,
  StageId,
  applyPreset,
  matchingPreset,
  toYaml,
} from '../core/pipeline';

@Component({
  selector: 'app-pipeline-editor',
  templateUrl: './pipeline-editor.html',
  styleUrl: './pipeline-editor.scss',
})
export class PipelineEditor {
  protected readonly i18n = inject(I18n);

  readonly stages = model.required<PipelineStage[]>();

  protected readonly phases = PHASES;
  protected readonly thresholds = FAIL_THRESHOLDS;
  protected readonly presets: Preset[] = ['minimal', 'recommended', 'full'];
  protected readonly provider = signal<CiProvider>('github');
  protected readonly copied = signal(false);

  protected readonly activePreset = computed(() => matchingPreset(this.stages()));
  protected readonly enabledCount = computed(() => this.stages().filter((s) => s.enabled).length);
  protected readonly minutes = computed(() =>
    this.stages()
      .filter((s) => s.enabled)
      .reduce((sum, s) => sum + s.minutes, 0),
  );
  protected readonly yaml = computed(() => toYaml(this.stages(), this.provider()));

  protected stageText(id: StageId, part: 'name' | 'desc' | 'why'): string {
    return this.i18n.t(`stage.${id}.${part}`);
  }

  protected phaseName(phase: Phase): string {
    return this.i18n.t(`pipe.phase.${phase}`);
  }

  protected phaseDesc(phase: Phase): string {
    return this.i18n.t(`pipe.phase.${phase}.desc`);
  }

  protected presetLabel(preset: Preset): string {
    return this.i18n.t(`pipe.preset.${preset}`);
  }

  protected failLabel(threshold: FailThreshold): string {
    return this.i18n.t(`pipe.fail.${threshold}`);
  }

  protected byPhase(phase: Phase): PipelineStage[] {
    return this.stages().filter((s) => s.phase === phase);
  }

  protected setPreset(preset: Preset): void {
    this.stages.update((stages) => applyPreset(stages, preset));
  }

  protected patch(id: StageId, change: Partial<PipelineStage>): void {
    this.stages.update((stages) => stages.map((s) => (s.id === id ? { ...s, ...change } : s)));
  }

  protected setTool(id: StageId, event: Event): void {
    this.patch(id, { tool: (event.target as HTMLSelectElement).value });
  }

  protected setFailOn(id: StageId, event: Event): void {
    this.patch(id, { failOn: (event.target as HTMLSelectElement).value as FailThreshold });
  }

  protected setProvider(event: Event): void {
    this.provider.set((event.target as HTMLSelectElement).value as CiProvider);
  }

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.yaml());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
