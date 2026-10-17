import { Component, ElementRef, Signal, computed, inject, input, linkedSignal } from '@angular/core';
import { I18n } from '../core/i18n';

export const PAGE_SIZE = 15;

export interface Pager<T> {
  /** Rows of the current page. */
  readonly items: Signal<T[]>;
  /** Zero-based page index, clamped to the last page. */
  readonly index: Signal<number>;
  readonly pageCount: Signal<number>;
  readonly total: Signal<number>;
  /** Paging only shows up when there is more than one page. */
  readonly visible: Signal<boolean>;
  go(index: number): void;
}

/**
 * Client-side paging of `rows`. The page goes back to the first one whenever `resetOn` changes
 * (filters, search, sort); a reload of the same list keeps the page, clamped to the new last page.
 */
export function paginate<T>(rows: () => readonly T[], resetOn: () => unknown = () => null): Pager<T> {
  const requested = linkedSignal({ source: resetOn, computation: () => 0 });
  const total = computed(() => rows().length);
  const pageCount = computed(() => Math.max(1, Math.ceil(total() / PAGE_SIZE)));
  const index = computed(() => Math.min(requested(), pageCount() - 1));
  return {
    items: computed(() => rows().slice(index() * PAGE_SIZE, (index() + 1) * PAGE_SIZE)),
    index,
    pageCount,
    total,
    visible: computed(() => total() > PAGE_SIZE),
    go: (i) => requested.set(Math.max(0, Math.min(i, pageCount() - 1))),
  };
}

const TOPBAR_HEIGHT = 56;

/** Pagination controls for a `Pager`; place it right after the table, inside the same card. */
@Component({
  selector: 'app-paginator',
  template: `
    @if (pager().visible()) {
      <nav class="paginator" [attr.aria-label]="i18n.t('page.label')">
        <p class="range">{{ range() }}</p>
        <div class="controls">
          <button type="button" class="btn" [disabled]="pager().index() === 0" (click)="go(pager().index() - 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z" /></svg>
            <span class="label">{{ i18n.t('page.previous') }}</span>
          </button>
          <ol class="pages">
            @for (p of pages(); track p) {
              @if (p < 0) {
                <li class="gap" aria-hidden="true">…</li>
              } @else {
                <li>
                  <button
                    type="button"
                    class="btn page"
                    [attr.aria-current]="p === pager().index() ? 'page' : null"
                    [attr.aria-label]="pageLabel(p)"
                    (click)="go(p)"
                  >
                    {{ p + 1 }}
                  </button>
                </li>
              }
            }
          </ol>
          <span class="compact" aria-hidden="true">{{ compact() }}</span>
          <button type="button" class="btn" [disabled]="pager().index() >= pager().pageCount() - 1" (click)="go(pager().index() + 1)">
            <span class="label">{{ i18n.t('page.next') }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z" /></svg>
          </button>
        </div>
      </nav>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .paginator {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--border);
    }

    .range {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .pages {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .btn {
      padding: 0.35rem 0.6rem;
      font-size: 0.85rem;
      gap: 0.25rem;
    }

    .page {
      min-width: 2.1rem;
      font-variant-numeric: tabular-nums;

      &[aria-current='page'] {
        background: var(--primary-soft);
        border-color: var(--primary);
        color: var(--primary);
        font-weight: 600;
      }
    }

    .gap {
      padding: 0 0.2rem;
      color: var(--text-muted);
    }

    .compact {
      display: none;
      font-size: 0.85rem;
      white-space: nowrap;
    }

    @media (max-width: 599px) {
      .paginator {
        justify-content: center;
      }

      .range {
        width: 100%;
        text-align: center;
      }

      .pages {
        display: none;
      }

      .compact {
        display: inline;
        padding: 0 0.5rem;
      }
    }
  `,
})
export class Paginator {
  protected readonly i18n = inject(I18n);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly pager = input.required<Pager<unknown>>();

  protected readonly range = computed(() => {
    const p = this.pager();
    const from = p.index() * PAGE_SIZE + 1;
    return this.i18n
      .t('page.range')
      .replace('{from}', String(from))
      .replace('{to}', String(Math.min(from + PAGE_SIZE - 1, p.total())))
      .replace('{total}', String(p.total()));
  });

  protected readonly compact = computed(() =>
    this.i18n
      .t('page.of')
      .replace('{n}', String(this.pager().index() + 1))
      .replace('{total}', String(this.pager().pageCount())),
  );

  /** Page indexes to show: first, last and the neighbours of the current page; -1/-2 mark gaps. */
  protected readonly pages = computed(() => {
    const count = this.pager().pageCount();
    const current = this.pager().index();
    if (count <= 7) return Array.from({ length: count }, (_, i) => i);
    const start = Math.max(1, Math.min(current - 1, count - 4));
    const end = Math.min(count - 2, Math.max(current + 1, 3));
    const pages: number[] = [0];
    if (start > 1) pages.push(-1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < count - 2) pages.push(-2);
    pages.push(count - 1);
    return pages;
  });

  protected pageLabel(index: number): string {
    return this.i18n.t('page.goTo').replace('{n}', String(index + 1));
  }

  protected go(index: number): void {
    this.pager().go(index);
    // Bring the top of the table back into view when it scrolled out of sight.
    const container = this.host.nativeElement.parentElement;
    const top = container?.getBoundingClientRect().top ?? 0;
    if (top < TOPBAR_HEIGHT) window.scrollBy({ top: top - TOPBAR_HEIGHT - 16 });
  }
}
