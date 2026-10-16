import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { problemMessage } from '../../core/api/api';
import { DEFAULT_SETTINGS, ProjectsApi, stageCatalogUrl, toStageUpdate } from '../../core/api/projects';
import { I18n, TranslationKey } from '../../core/i18n';
import { Stack } from '../../core/mock-data';
import { PipelineStage, defaultPipeline } from '../../core/pipeline';
import { PipelineEditor } from '../../shared/pipeline-editor';
import { ScanSettings } from '../../shared/scan-settings';

const SSH_URL = /^(git@[\w.-]+:[\w./-]+\.git|ssh:\/\/[\w.@:/-]+)$/;

@Component({
  selector: 'app-onboarding',
  imports: [ScanSettings, PipelineEditor],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding {
  protected readonly i18n = inject(I18n);
  private readonly router = inject(Router);
  private readonly api = inject(ProjectsApi);

  protected readonly steps: TranslationKey[] = ['ob.step1', 'ob.step2', 'ob.step3', 'ob.step4', 'ob.step5'];
  protected readonly step = signal(0);
  protected readonly isLast = computed(() => this.step() === this.steps.length - 1);

  protected readonly url = signal('');
  protected readonly branch = signal('main');
  protected readonly settings = signal(DEFAULT_SETTINGS);
  private readonly catalog = httpResource<PipelineStage[]>(() => stageCatalogUrl());
  protected readonly pipeline = linkedSignal(() => this.catalog.value() ?? defaultPipeline());
  protected readonly stacks: Stack[] = ['React', 'Angular', 'Java + Spring'];
  protected readonly stack = signal<Stack | null>(null);

  protected readonly urlValid = computed(() => SSH_URL.test(this.url().trim()));
  protected readonly showErrors = signal(false);
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected next(): void {
    if (this.step() === 1 && (!this.urlValid() || !this.branch().trim())) {
      this.showErrors.set(true);
      return;
    }
    if (this.isLast()) {
      this.submit();
      return;
    }
    this.showErrors.set(false);
    this.step.update((s) => s + 1);
  }

  protected back(): void {
    this.step.update((s) => Math.max(0, s - 1));
  }

  protected input(target: EventTarget | null): string {
    return (target as HTMLInputElement).value;
  }

  private submit(): void {
    const stack = this.stack();
    if (!stack) {
      this.showErrors.set(true);
      return;
    }
    this.submitting.set(true);
    this.submitError.set(null);
    this.api
      .create({
        url: this.url().trim(),
        branch: this.branch().trim(),
        stack,
        settings: this.settings(),
        pipeline: this.pipeline().map(toStageUpdate),
      })
      .subscribe({
        next: (created) => this.router.navigate(['/repositories', created.project.name]),
        error: (err) => {
          this.submitting.set(false);
          this.submitError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
        },
      });
  }
}
