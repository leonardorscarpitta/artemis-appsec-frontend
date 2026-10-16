import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { problemMessage } from '../core/api/api';
import { ProjectsApi } from '../core/api/projects';
import { I18n } from '../core/i18n';
import { OrgContext } from '../core/org/org-context';

/** Queues a scan of a repository and opens the new pipeline run. */
@Component({
  selector: 'app-run-scan-button',
  template: `
    <button type="button" class="btn" [class.primary]="primary()" [disabled]="running()" (click)="run()">
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
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
  private readonly org = inject(OrgContext);

  readonly repository = input.required<string>();
  readonly primary = input(false);

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
