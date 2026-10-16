import { Component, computed, inject, input } from '@angular/core';
import { I18n } from '../core/i18n';
import { Severity, severityOf } from '../core/domain';

@Component({
  selector: 'app-severity-badge',
  template: `
    @if (cvss() != null) {
      <span class="score">{{ cvss()!.toFixed(1) }}</span>
    }
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
  /** CVSS score when known (dependency vulnerabilities). */
  readonly cvss = input<number | null>(null);
  /** Severity reported by the scanner; used when there is no CVSS score. */
  readonly level = input<Severity | null>(null);

  protected readonly severity = computed(() => {
    const score = this.cvss();
    return score != null ? severityOf(score) : (this.level() ?? 'low');
  });
  protected readonly label = computed(() => this.i18n.t(`sev.${this.severity()}`));
}
