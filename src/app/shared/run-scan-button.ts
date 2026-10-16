import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { problemMessage } from '../core/api/api';
import { ProjectsApi } from '../core/api/projects';
import { I18n } from '../core/i18n';
import { OrgContext } from '../core/org/org-context';
import { LOCK_ICON } from './role-notice';

/** Queues a scan of a repository and opens the new pipeline run. */
@Component({
  selector: 'app-run-scan-button',
  template: `
    <button
      type="button"
      class="btn"
      [class.primary]="primary()"
      [class.compact]="compact()"
      [disabled]="running() || !org.can('pipelines')"
      [title]="org.can('pipelines') ? '' : org.reason('pipelines')"
      (click)="run()"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" [attr.d]="org.can('pipelines') ? 'M8 5v14l11-7z' : lock" />
      </svg>
      {{ running() ? i18n.t('scan.starting') : i18n.t('scan.run') }}
    </button>
    @if (error(); as message) {
      <span class="error" role="alert">{{ message }}</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.35rem;
    }

    .compact {
      padding: 0.3rem 0.7rem;
      font-size: 0.85rem;
    }

    .error {
      max-width: 22rem;
      color: var(--sev-critical);
      font-size: 0.8rem;
      text-align: right;
    }
  `,
})
export class RunScanButton {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(ProjectsApi);
  private readonly router = inject(Router);
  protected readonly org = inject(OrgContext);
  protected readonly lock = LOCK_ICON;

  readonly repository = input.required<string>();
  readonly primary = input(false);
  readonly compact = input(false);

  protected readonly running = signal(false);
  protected readonly error = signal<string | null>(null);

  protected run(): void {
    this.running.set(true);
    this.error.set(null);
    this.api.runScan(this.repository()).subscribe({
      next: (created) => this.router.navigate([this.org.url('/pipelines'), created.run.number]),
      error: (err) => {
        this.running.set(false);
        this.error.set(problemMessage(err) ?? this.i18n.t('scan.failed'));
      },
    });
  }
}
