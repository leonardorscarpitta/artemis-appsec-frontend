import { Component, inject } from '@angular/core';
import { I18n, Lang } from '../core/i18n';

@Component({
  selector: 'app-lang-switch',
  template: `
    <label class="sr-only" for="lang">{{ i18n.t('lang.label') }}</label>
    <select id="lang" class="input" [value]="i18n.lang()" (change)="change($event)">
      <option value="en-US">English (US)</option>
      <option value="pt-BR">Português (BR)</option>
    </select>
  `,
  styles: `
    select {
      width: auto;
      padding: 0.4rem 0.6rem;
      font-size: 0.85rem;
    }
  `,
})
export class LangSwitch {
  protected readonly i18n = inject(I18n);

  protected change(event: Event): void {
    this.i18n.lang.set((event.target as HTMLSelectElement).value as Lang);
  }
}
