import { Component, computed, inject, input } from '@angular/core';
import { I18n } from '../../core/i18n';
import { FindingStatus, STATUS_KEYS } from '../../core/mock-data';

@Component({
  selector: 'app-status-label',
  host: { '[class]': 'status()' },
  template: `{{ label() }}`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      white-space: nowrap;

      &::before {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: currentColor;
      }
    }

    :host(.open) {
      color: var(--sev-high);
    }

    :host(.triaged) {
      color: var(--primary);
    }

    :host(.falsePositive) {
      color: var(--text-muted);
    }

    :host(.accepted) {
      color: var(--sev-medium);
    }

    :host(.fixed) {
      color: var(--sev-low);
    }
  `,
})
export class StatusLabel {
  private readonly i18n = inject(I18n);
  readonly status = input.required<FindingStatus>();
  protected readonly label = computed(() => this.i18n.t(STATUS_KEYS[this.status()]));
}
