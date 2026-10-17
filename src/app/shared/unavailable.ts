import { Component, inject, input } from '@angular/core';
import { I18n, TranslationKey } from '../core/i18n';
import { LOCK_ICON } from './role-notice';

/** Marks a planned feature that is shown but not implemented yet (never hidden silently). */
@Component({
  selector: 'app-unavailable',
  template: `
    <span class="tag" [title]="i18n.t(hint())">
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" [attr.d]="lock" /></svg>
      {{ i18n.t('unavailable.tag') }}
    </span>
    @if (showHint()) {
      <span class="hint">{{ i18n.t(hint()) }}</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.1rem 0.45rem;
      border-radius: var(--radius-sm);
      background: var(--surface-hover);
      color: var(--text-muted);
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .hint {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  `,
})
export class Unavailable {
  protected readonly i18n = inject(I18n);
  protected readonly lock = LOCK_ICON;

  readonly hint = input<TranslationKey>('unavailable.hint');
  readonly showHint = input(false);
}
