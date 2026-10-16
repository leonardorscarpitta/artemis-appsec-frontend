import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n, TranslationKey } from '../core/i18n';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <h1>{{ heading() }}</h1>
    </header>
    <div class="card empty">
      <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M22.7 19 13.6 9.9c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4" />
      </svg>
      <h2>{{ i18n.t('wip.title') }}</h2>
      <p class="muted">{{ i18n.t('wip.desc') }}</p>
      <a class="btn" routerLink="/dashboard">{{ i18n.t('wip.back') }}</a>
    </div>
  `,
  styles: `
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 3.5rem 1.5rem;
      text-align: center;

      svg {
        color: var(--text-muted);
        margin-bottom: 0.5rem;
      }

      p {
        max-width: 420px;
      }

      .btn {
        margin-top: 1rem;
      }
    }
  `,
})
export class ComingSoon {
  protected readonly i18n = inject(I18n);

  // Bound from the route's `data.title`.
  readonly title = input.required<TranslationKey>();
  protected readonly heading = computed(() => this.i18n.t(this.title()));
}
