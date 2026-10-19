import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { Policies, StageGate, policiesUrl } from '../core/api/policies';
import { I18n } from '../core/i18n';
import { OrgContext } from '../core/org/org-context';
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
  private readonly org = inject(OrgContext);

  // The organization policy: required stages stay on and thresholds cannot be looser than its minimum.
  private readonly policy = httpResource<Policies>(() => (this.org.slug() ? policiesUrl() : undefined));
  private readonly gates = computed(
    () => new Map<StageId, StageGate>((this.policy.value()?.stages ?? []).map((g) => [g.stage, g])),
  );

  constructor() {
    effect(() => {
      const gates = this.gates();
      if (!gates.size) return;
      const current = this.stages();
      const normalized = enforce(current, gates);
      if (normalized.some((s, i) => s !== current[i])) this.stages.set(normalized);
    });
  }

  protected required(stage: PipelineStage): boolean {
    return stage.available !== false && !!this.gates().get(stage.id)?.required;
  }

  /** Thresholds looser than the organization minimum cannot be picked. */
  protected tooLoose(stage: PipelineStage, threshold: FailThreshold): boolean {
    const minimum = this.gates().get(stage.id)?.failOn;
    return !!minimum && FAIL_THRESHOLDS.indexOf(threshold) < FAIL_THRESHOLDS.indexOf(minimum);
  }

  protected readonly phases = PHASES;
  protected readonly thresholds = FAIL_THRESHOLDS;
  protected readonly presets: Preset[] = ['minimal', 'recommended', 'full'];
  protected readonly provider = signal<CiProvider>('github');
  protected readonly copied = signal(false);

  // Stages the runner cannot execute (e.g. DAST) are not offered.
  protected readonly visible = computed(() => this.stages().filter((s) => s.available !== false));
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
    return this.visible().filter((s) => s.phase === phase);
  }

  protected setPreset(preset: Preset): void {
    this.stages.update((stages) => enforce(applyPreset(stages, preset), this.gates()));
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

/** Applies the organization's stage gates to a pipeline (unchanged stages keep their identity). */
function enforce(stages: PipelineStage[], gates: Map<StageId, StageGate>): PipelineStage[] {
  return stages.map((stage) => {
    const gate = gates.get(stage.id);
    if (!gate || stage.available === false) return stage;
    const enabled = stage.enabled || gate.required;
    const looser =
      !!gate.failOn && !!stage.failOn && FAIL_THRESHOLDS.indexOf(stage.failOn) < FAIL_THRESHOLDS.indexOf(gate.failOn);
    return enabled === stage.enabled && !looser ? stage : { ...stage, enabled, failOn: looser ? gate.failOn : stage.failOn };
  });
}
