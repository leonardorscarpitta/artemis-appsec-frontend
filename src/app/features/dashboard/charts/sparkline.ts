import { Component, computed, input } from '@angular/core';

/** A tiny decorative trend line; the values are always available elsewhere on the page. */
@Component({
  selector: 'app-sparkline',
  template: `
    @if (paths(); as p) {
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="fill" [attr.d]="p.area" [style.fill]="color()" />
        <path class="line" [attr.d]="p.line" [style.stroke]="color()" />
      </svg>
    }
  `,
  styles: `
    :host {
      display: block;
      width: 96px;
      height: 32px;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .fill {
      opacity: 0.12;
    }

    .line {
      fill: none;
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
    }
  `,
})
export class Sparkline {
  readonly values = input.required<number[]>();
  readonly color = input('var(--primary)');

  protected readonly paths = computed(() => {
    const values = this.values();
    if (values.length < 2 || !values.some((v) => v > 0)) return null;
    const max = Math.max(1, ...values);
    const step = 100 / (values.length - 1);
    const points = values.map((v, i) => `${(i * step).toFixed(2)},${(30 - (v / max) * 28).toFixed(2)}`);
    const line = `M${points.join('L')}`;
    return { line, area: `${line}L100,32L0,32Z` };
  });
}
