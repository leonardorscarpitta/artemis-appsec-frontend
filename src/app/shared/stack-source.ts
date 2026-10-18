import { Component, computed, inject, input } from '@angular/core';
import { StackSource } from '../core/api/projects';
import { I18n } from '../core/i18n';

const AUTO =
  'M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25z';
const MANUAL = 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4';

/** Small symbol telling a detected stack (sparkles) from one chosen by a person. */
@Component({
  selector: 'app-stack-source',
  template: `
    @if (path(); as d) {
      <svg width="13" height="13" viewBox="0 0 24 24" role="img" [attr.aria-label]="label()">
        <title>{{ label() }}</title>
        <path fill="currentColor" [attr.d]="d" />
      </svg>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      vertical-align: -2px;
      margin-right: 0.3rem;
      color: var(--primary);
    }
    :host(.manual) {
      color: var(--text-muted);
    }
  `,
  host: { '[class.manual]': "source() === 'manual'" },
})
export class StackSourceIcon {
  private readonly i18n = inject(I18n);
  readonly source = input.required<StackSource>();

  protected readonly path = computed(() => (this.source() === 'detected' ? AUTO : this.source() === 'manual' ? MANUAL : null));
  protected readonly label = computed(() =>
    this.i18n.t(this.source() === 'detected' ? 'rs.stackDetectedHint' : 'repo.stackManualHint'),
  );
}
