import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { concatMap } from 'rxjs';
import { problemMessage } from '../../core/api/api';
import { DEFAULT_SETTINGS, ProjectDetails, ProjectFolder, ProjectsApi, repositoryUrl } from '../../core/api/projects';
import { I18n } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';
import { PipelineEditor } from '../../shared/pipeline-editor';
import { RequestState } from '../../shared/request-state';
import { ScanSettings } from '../../shared/scan-settings';
import { OrgLink } from '../../shared/org-link';
import { RunScanButton } from '../../shared/run-scan-button';
import { RoleNotice } from '../../shared/role-notice';
import { MonorepoFolders, STACKS, foldersValid, normalizeFolder } from '../../shared/monorepo-folders';
import { Stack } from '../../core/domain';
import { RepoAccess } from './repo-access';

type Tab = 'general' | 'pipeline' | 'access';

@Component({
  selector: 'app-repo-settings',
  imports: [RouterLink, ScanSettings, PipelineEditor, RequestState, OrgLink, RunScanButton, RoleNotice, MonorepoFolders, RepoAccess],
  templateUrl: './repo-settings.html',
  styleUrl: './repo-settings.scss',
})
export class RepoSettings {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(ProjectsApi);
  private readonly org = inject(OrgContext);
  private readonly router = inject(Router);
  protected readonly canEdit = computed(() => this.org.can('pipelines'));

  readonly name = input.required<string>();
  /** `?tab=access` opens the Deploy Key tab (e.g. right after adding a repository). */
  readonly initialTab = input<string | undefined>(undefined, { alias: 'tab' });

  protected readonly details = httpResource<ProjectDetails>(() => repositoryUrl(this.name()));
  protected readonly notFound = computed(() => (this.details.error() as { status?: number } | undefined)?.status === 404);
  protected readonly repo = computed(() => this.details.value()?.project);
  protected readonly settings = linkedSignal(() => this.details.value()?.settings ?? DEFAULT_SETTINGS);
  protected readonly pipeline = linkedSignal(() => this.details.value()?.pipeline ?? []);
  protected readonly tab = linkedSignal<Tab>(() => {
    const requested = this.initialTab();
    return requested === 'access' || requested === 'general' ? requested : 'pipeline';
  });
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly saveError = signal<string | null>(null);
  protected readonly showErrors = signal(false);
  protected readonly folderStacks = computed(() =>
    Object.fromEntries((this.repo()?.folders ?? []).map((f) => [f.path, f.stack ?? ''])),
  );
  protected readonly folderPaths = computed(() => (this.repo()?.folders ?? []).map((f) => f.path));
  protected readonly confirmName = signal('');
  protected readonly removing = signal(false);
  protected readonly removeError = signal<string | null>(null);
  protected readonly purge = signal(false);

  protected openRemove(dialog: HTMLDialogElement): void {
    dialog.showModal();
  }

  protected closeRemove(): void {
    this.purge.set(false);
    this.confirmName.set('');
    this.removeError.set(null);
  }

  protected setPurge(event: Event): void {
    this.purge.set((event.target as HTMLInputElement).checked);
  }

  protected setConfirmName(event: Event): void {
    this.confirmName.set((event.target as HTMLInputElement).value.trim());
    this.removeError.set(null);
  }

  protected remove(): void {
    this.removing.set(true);
    this.removeError.set(null);
    this.api.remove(this.name(), this.purge()).subscribe({
      next: () => void this.router.navigateByUrl(this.org.url('/repositories')),
      error: (err) => {
        this.removing.set(false);
        this.removeError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }

  protected readonly stacks = STACKS;

  protected setStack(event: Event): void {
    const stack = ((event.target as HTMLSelectElement).value || null) as Stack | null;
    this.settings.update((s) => ({ ...s, stack }));
  }

  protected setFolders(folders: ProjectFolder[]): void {
    this.settings.update((s) => ({ ...s, folders }));
  }

  protected save(): void {
    if (!foldersValid(this.settings().folders)) {
      this.showErrors.set(true);
      this.tab.set('general');
      this.saveError.set(this.i18n.t('mono.invalid'));
      return;
    }
    this.showErrors.set(false);
    const settings = { ...this.settings(), folders: this.settings().folders.map((f) => ({ ...f, path: normalizeFolder(f.path) })) };
    this.saving.set(true);
    this.saveError.set(null);
    this.api
      .updateSettings(this.name(), settings)
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
