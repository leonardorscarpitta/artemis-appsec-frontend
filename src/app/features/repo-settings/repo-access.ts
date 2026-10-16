import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { problemMessage } from '../../core/api/api';
import { ProjectSummary, ProjectsApi, RepositoryAccess, repositoryAccessUrl } from '../../core/api/projects';
import { I18n, TranslationKey } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';
import { RoleNotice } from '../../shared/role-notice';
import { RunScanButton } from '../../shared/run-scan-button';

type Provider = 'github' | 'gitlab' | 'bitbucket' | 'other';

const POLL_MS = 2000;

/** Deploy key, provider instructions and access checks of a private (SSH) repository. */
@Component({
  selector: 'app-repo-access',
  imports: [RoleNotice, RunScanButton],
  templateUrl: './repo-access.html',
  styleUrl: './repo-access.scss',
})
export class RepoAccess {
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);
  private readonly api = inject(ProjectsApi);

  readonly repository = input.required<ProjectSummary>();
  /** Emitted when the access status may have changed, so the page can refresh the repository. */
  readonly changed = output<void>();

  protected readonly access = httpResource<RepositoryAccess>(() =>
    this.repository().access === 'ssh' ? repositoryAccessUrl(this.repository().name) : undefined,
  );
  protected readonly check = computed(() => this.access.value()?.lastCheck ?? null);
  protected readonly checking = computed(() => this.check()?.status === 'queued' || this.check()?.status === 'running');
  protected readonly provider = computed<Provider>(() => {
    const host = (this.access.value()?.host ?? '').toLowerCase();
    if (host === 'github.com') return 'github';
    if (host === 'gitlab.com') return 'gitlab';
    if (host === 'bitbucket.org') return 'bitbucket';
    return 'other';
  });
  protected readonly steps = computed<TranslationKey[]>(() => {
    const p = this.provider();
    return [`access.steps.${p}.1`, `access.steps.${p}.2`, `access.steps.${p}.3`] as TranslationKey[];
  });

  protected readonly copied = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    let wasChecking = false;
    effect((onCleanup) => {
      const checking = this.checking();
      if (wasChecking && !checking) this.changed.emit();
      wasChecking = checking;
      if (!checking) return;
      const timer = setTimeout(() => this.access.reload(), POLL_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected copy(key: string): void {
    void navigator.clipboard?.writeText(key).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  protected testAccess(): void {
    this.run(this.api.checkAccess(this.repository().name));
  }

  protected rotate(): void {
    const hasKey = !!this.access.value()?.deployKey;
    if (hasKey && !confirm(this.i18n.t('access.rotateConfirm'))) return;
    this.run(this.api.rotateKey(this.repository().name), true);
  }

  private run(request: ReturnType<ProjectsApi['checkAccess']>, notify = false): void {
    this.busy.set(true);
    this.error.set(null);
    request.subscribe({
      next: (access) => {
        this.access.set(access);
        this.busy.set(false);
        if (notify) this.changed.emit();
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }
}
