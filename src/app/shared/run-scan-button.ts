import { Component, inject, input, linkedSignal, signal } from '@angular/core';
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
      [attr.aria-expanded]="folders().length > 1 ? picking() : null"
      (click)="folders().length > 1 ? togglePicker() : run()"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" [attr.d]="org.can('pipelines') ? 'M8 5v14l11-7z' : lock" />
      </svg>
      {{ running() ? i18n.t('scan.starting') : i18n.t('scan.run') }}
    </button>
    @if (picking()) {
      <div class="picker" role="group" [attr.aria-label]="i18n.t('scan.pickFolders')">
        <strong>{{ i18n.t('scan.pickFolders') }}</strong>
        @for (folder of folders(); track folder) {
          <label class="check">
            <input type="checkbox" [checked]="selected().includes(folder)" (change)="toggle(folder, $any($event.target).checked)" />
            <span class="mono">{{ folder }}</span>
          </label>
        }
        <div class="actions">
          <button type="button" class="btn ghost" (click)="picking.set(false)">{{ i18n.t('scan.cancel') }}</button>
          <button type="button" class="btn primary" [disabled]="!selected().length || running()" (click)="run()">
            {{ i18n.t('scan.runSelected').replace('{n}', '' + selected().length) }}
          </button>
        </div>
      </div>
    }
    @if (error(); as message) {
      <span class="error" role="alert">{{ message }}</span>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.35rem;
    }

    .compact {
      padding: 0.3rem 0.7rem;
      font-size: 0.85rem;
    }

    .picker {
      position: absolute;
      top: calc(100% + 0.4rem);
      right: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 16rem;
      padding: 0.9rem 1rem;
      text-align: left;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius);
      box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
    }

    .check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.25rem;
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
  /** Monorepo folders; with more than one, the button first asks which ones to scan. */
  readonly folders = input<string[]>([]);

  protected readonly picking = signal(false);
  protected readonly selected = linkedSignal(() => this.folders());

  protected readonly running = signal(false);
  protected readonly error = signal<string | null>(null);

  protected togglePicker(): void {
    this.selected.set(this.folders());
    this.picking.update((open) => !open);
  }

  protected toggle(folder: string, checked: boolean): void {
    // Keeps the repository's folder order.
    this.selected.update((list) => this.folders().filter((f) => (f === folder ? checked : list.includes(f))));
  }

  protected run(): void {
    this.running.set(true);
    this.error.set(null);
    const folders = this.folders().length > 1 ? this.selected() : undefined;
    this.api.runScan(this.repository(), folders).subscribe({
      next: (created) => this.router.navigate([this.org.url('/pipelines'), created.run.number]),
      error: (err) => {
        this.running.set(false);
        this.error.set(problemMessage(err) ?? this.i18n.t('scan.failed'));
      },
    });
  }
}
