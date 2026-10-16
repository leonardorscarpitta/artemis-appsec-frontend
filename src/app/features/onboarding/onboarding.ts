import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { I18n, TranslationKey } from '../../core/i18n';
import { Stack } from '../../core/mock-data';
import { defaultPipeline } from '../../core/pipeline';
import { PipelineEditor } from '../../shared/pipeline-editor';
import { ScanSettings } from '../../shared/scan-settings';

@Component({
  selector: 'app-onboarding',
  imports: [ScanSettings, PipelineEditor],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding {
  protected readonly i18n = inject(I18n);
  private readonly router = inject(Router);

  protected readonly steps: TranslationKey[] = ['ob.step1', 'ob.step2', 'ob.step3', 'ob.step4', 'ob.step5'];
  protected readonly step = signal(0);
  protected readonly isLast = computed(() => this.step() === this.steps.length - 1);

  protected readonly pipeline = signal(defaultPipeline());
  protected readonly stacks: Stack[] = ['React', 'Angular', 'Java + Spring'];
  protected readonly detected: Stack = 'Angular';

  protected next(): void {
    if (this.isLast()) {
      this.router.navigate(['/repositories']);
      return;
    }
    this.step.update((s) => s + 1);
  }

  protected back(): void {
    this.step.update((s) => Math.max(0, s - 1));
  }
}
