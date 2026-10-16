import { Component, computed, inject, input } from '@angular/core';
import { I18n } from '../core/i18n';
import { severityOf } from '../core/mock-data';

@Component({
  selector: 'app-severity-badge',
  template: `<span class="badge" [style.color]="color()">{{ cvss().toFixed(1) }} · {{ label() }}</span>`,
})
export class SeverityBadge {
  private readonly i18n = inject(I18n);
  readonly cvss = input.required<number>();

  private readonly severity = computed(() => severityOf(this.cvss()));
  protected readonly color = computed(() => `var(--sev-${this.severity()})`);
  protected readonly label = computed(() => this.i18n.t(`sev.${this.severity()}`));
}
