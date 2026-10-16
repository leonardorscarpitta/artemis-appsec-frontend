import { Component, computed, inject, input } from '@angular/core';
import { I18n } from '../core/i18n';
import { problemMessage } from '../core/api/api';

/** Minimal shape shared by `httpResource` and `resource`. */
export interface LoadableResource {
  isLoading(): boolean;
  error(): unknown;
  reload(): boolean;
}

/** Shows a loading or error (with retry) state for a resource; renders nothing once loaded. */
@Component({
  selector: 'app-request-state',
  template: `
    @if (resource().error()) {
      <div class="card state error" role="alert">
        <strong>{{ i18n.t('api.error') }}</strong>
        <p class="muted">{{ message() }}</p>
        <button type="button" class="btn" (click)="resource().reload()">{{ i18n.t('api.retry') }}</button>
      </div>
    } @else if (resource().isLoading()) {
      <div class="card state" role="status" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        {{ i18n.t('api.loading') }}
      </div>
    }
  `,
  styles: `
    .state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 2.5rem 1.5rem;
      text-align: center;
      color: var(--text-muted);
    }

    .error strong {
      color: var(--sev-critical);
    }

    .spinner {
      width: 22px;
      height: 22px;
      border: 2px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 2.4s;
      }
    }
  `,
})
export class RequestState {
  protected readonly i18n = inject(I18n);
  readonly resource = input.required<LoadableResource>();
  protected readonly message = computed(
    () => problemMessage(this.resource().error()) ?? this.i18n.t('api.errorDesc'),
  );
}
