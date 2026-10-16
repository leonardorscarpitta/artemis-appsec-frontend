import { Component, ElementRef, inject, input, linkedSignal, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { problemMessage } from '../core/api/api';
import { ProjectsApi } from '../core/api/projects';
import { I18n } from '../core/i18n';
import { OrgContext } from '../core/org/org-context';
import { LOCK_ICON } from './role-notice';

/** Queues a scan of a repository and opens the new pipeline run. */
@Component({
  selector: 'app-run-scan-button',
  host: {
    '(document:keydown.escape)': 'picking.set(false)',
    '(window:resize)': 'picking.set(false)',
    '(window:scroll)': 'picking.set(false)',
  },
  template: `
    <button
      #trigger
      type="button"
      class="btn"
      [class.primary]="primary()"
      [class.compact]="compact()"
      [disabled]="running() || !org.can('pipelines') || !ready()"
      [title]="!org.can('pipelines') ? org.reason('pipelines') : ready() ? '' : i18n.t('scan.needsAccess')"
      [attr.aria-expanded]="folders().length > 1 ? picking() : null"
      (click)="folders().length > 1 ? togglePicker() : run()"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" [attr.d]="org.can('pipelines') && ready() ? 'M8 5v14l11-7z' : lock" />
      </svg>
      {{ running() ? i18n.t('scan.starting') : i18n.t('scan.run') }}
    </button>
    @if (picking()) {
      <div class="picker" role="group" [attr.aria-label]="i18n.t('scan.pickFolders')" [style.top.px]="position().top" [style.right.px]="position().right">
        <div class="picker-head">
          <strong>{{ i18n.t('scan.pickFolders') }}</strong>
          <button type="button" class="link" (click)="selectAll(selected().length < folders().length)">
            {{ selected().length < folders().length ? i18n.t('scan.selectAll') : i18n.t('scan.selectNone') }}
          </button>
        </div>
        <ul class="folder-list">
          @for (folder of folders(); track folder) {
            <li>
              <label class="check" [class.on]="selected().includes(folder)">
                <input type="checkbox" [checked]="selected().includes(folder)" (change)="toggle(folder, $any($event.target).checked)" />
                <span class="mono path">{{ folder }}</span>
                @if (stackOf(folder); as stack) {
                  <span class="tag">{{ stack }}</span>
                }
              </label>
            </li>
          }
        </ul>
        <div class="actions">
          <button type="button" class="btn ghost" (click)="picking.set(false)">{{ i18n.t('scan.cancel') }}</button>
          <button type="button" class="btn primary" [disabled]="!selected().length || running()" (click)="run()">
            {{ selected().length === 1 ? i18n.t('scan.runOne') : i18n.t('scan.runMany').replace('{n}', '' + selected().length) }}
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
      // Fixed so it is never clipped by scrolling containers such as table cards.
      position: fixed;
      z-index: 60;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: max-content;
      min-width: 17rem;
      max-width: min(26rem, calc(100vw - 2rem));
      padding: 1rem;
      text-align: left;
      white-space: nowrap;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius);
      box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
    }

    .picker-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .link {
      padding: 0;
      font: inherit;
      font-size: 0.82rem;
      color: var(--primary);
      background: none;
      border: 0;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .folder-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .check {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0.6rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background 0.12s ease, border-color 0.12s ease;

      &:hover {
        background: var(--surface-hover);
      }

      &.on {
        border-color: var(--primary);
        background: var(--primary-soft);
      }

      .path {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tag {
        font-size: 0.72rem;
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
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
  /** False while the repository's deploy key is not verified: scans would be refused. */
  readonly ready = input(true);
  /** Monorepo folders; with more than one, the button first asks which ones to scan. */
  readonly folders = input<string[]>([]);
  /** Optional stack per folder path, shown next to each folder. */
  readonly stacks = input<Record<string, string>>({});

  protected readonly picking = signal(false);
  protected readonly position = signal({ top: 0, right: 0 });
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  protected readonly selected = linkedSignal(() => this.folders());

  protected readonly running = signal(false);
  protected readonly error = signal<string | null>(null);

  protected togglePicker(): void {
    const rect = this.trigger().nativeElement.getBoundingClientRect();
    this.position.set({ top: rect.bottom + 6, right: Math.max(16, window.innerWidth - rect.right) });
    this.selected.set(this.folders());
    this.picking.update((open) => !open);
  }

  protected stackOf(folder: string): string | undefined {
    return this.stacks()[folder];
  }

  protected selectAll(all: boolean): void {
    this.selected.set(all ? this.folders() : []);
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
