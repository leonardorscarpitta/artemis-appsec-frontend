import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { REPOSITORIES } from '../../core/mock-data';
import { applyPreset, defaultPipeline } from '../../core/pipeline';
import { PipelineEditor } from '../../shared/pipeline-editor';
import { ScanSettings } from '../../shared/scan-settings';

type Tab = 'general' | 'pipeline';

@Component({
  selector: 'app-repo-settings',
  imports: [RouterLink, ScanSettings, PipelineEditor],
  templateUrl: './repo-settings.html',
  styleUrl: './repo-settings.scss',
})
export class RepoSettings {
  protected readonly i18n = inject(I18n);

  readonly name = input.required<string>();

  protected readonly repo = computed(() => REPOSITORIES.find((r) => r.name === this.name()));
  // Placeholder: until the API exists, each repository starts from a preset.
  protected readonly pipeline = linkedSignal(() =>
    applyPreset(defaultPipeline(), this.repo()?.stack === 'Java + Spring' ? 'full' : 'recommended'),
  );
  protected readonly tab = signal<Tab>('pipeline');
  protected readonly saved = signal(false);

  protected save(): void {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}
