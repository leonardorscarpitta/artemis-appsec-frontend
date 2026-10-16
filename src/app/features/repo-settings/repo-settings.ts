import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { concatMap } from 'rxjs';
import { problemMessage } from '../../core/api/api';
import { DEFAULT_SETTINGS, ProjectDetails, ProjectsApi, repositoryUrl } from '../../core/api/projects';
import { I18n } from '../../core/i18n';
import { PipelineEditor } from '../../shared/pipeline-editor';
import { RequestState } from '../../shared/request-state';
import { ScanSettings } from '../../shared/scan-settings';
import { OrgLink } from '../../shared/org-link';

type Tab = 'general' | 'pipeline';

@Component({
  selector: 'app-repo-settings',
  imports: [RouterLink, ScanSettings, PipelineEditor, RequestState, OrgLink],
  templateUrl: './repo-settings.html',
  styleUrl: './repo-settings.scss',
})
export class RepoSettings {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(ProjectsApi);

  readonly name = input.required<string>();

  protected readonly details = httpResource<ProjectDetails>(() => repositoryUrl(this.name()));
  protected readonly notFound = computed(() => (this.details.error() as { status?: number } | undefined)?.status === 404);
  protected readonly repo = computed(() => this.details.value()?.project);
  protected readonly settings = linkedSignal(() => this.details.value()?.settings ?? DEFAULT_SETTINGS);
  protected readonly pipeline = linkedSignal(() => this.details.value()?.pipeline ?? []);
  protected readonly tab = signal<Tab>('pipeline');
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected save(): void {
    this.saving.set(true);
    this.saveError.set(null);
    this.api
      .updateSettings(this.name(), this.settings())
      .pipe(concatMap(() => this.api.updatePipeline(this.name(), this.pipeline())))
      .subscribe({
        next: (updated) => {
          this.details.set(updated);
          this.saving.set(false);
          this.saved.set(true);
          setTimeout(() => this.saved.set(false), 3000);
        },
        error: (err) => {
          this.saving.set(false);
          this.saveError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
        },
      });
  }
}
