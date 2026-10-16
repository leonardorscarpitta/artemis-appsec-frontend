import { Component, computed, inject, input } from '@angular/core';
import { I18n } from '../core/i18n';
import { severityOf } from '../core/mock-data';

@Component({
  selector: 'app-severity-badge',
  template: `
    <span class="score">{{ cvss().toFixed(1) }}</span>
    <span class="tag" [style.color]="'var(--sev-' + severity() + ')'" [style.background]="'var(--sev-' + severity() + '-bg)'">
      {{ label() }}
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
    }

    .score {
      min-width: 2rem;
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
  `,
})
export class SeverityBadge {
  private readonly i18n = inject(I18n);
  readonly cvss = input.required<number>();

  protected readonly severity = computed(() => severityOf(this.cvss()));
  protected readonly label = computed(() => this.i18n.t(`sev.${this.severity()}`));
}
