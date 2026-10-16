import { Component, computed, inject, input, signal } from '@angular/core';
import { I18n } from '../../core/i18n';
import { TrendPoint } from '../../core/api/reports';

const W = 640;
const H = 240;
const PAD = { top: 16, right: 64, bottom: 32, left: 36 };

@Component({
  selector: 'app-trend-chart',
  templateUrl: './trend-chart.html',
  styleUrl: './trend-chart.scss',
})
export class TrendChart {
  protected readonly i18n = inject(I18n);
  readonly data = input.required<TrendPoint[]>();

  protected readonly width = W;
  protected readonly height = H;
  protected readonly pad = PAD;
  protected readonly active = signal<number | null>(null);

  private readonly max = computed(() => {
    const peak = Math.max(...this.data().flatMap((d) => [d.opened, d.fixed]));
    return Math.ceil(peak / 5) * 5;
  });

  protected readonly ticks = computed(() => {
    const step = this.max() / 3;
    return [0, 1, 2, 3].map((i) => Math.round(i * step));
  });

  protected readonly step = computed(() => (W - PAD.left - PAD.right) / (this.data().length - 1));

  protected x(i: number): number {
    return PAD.left + i * this.step();
  }

  protected y(value: number): number {
    return PAD.top + (1 - value / this.max()) * (H - PAD.top - PAD.bottom);
  }

  protected path(key: 'opened' | 'fixed'): string {
    return this.data()
      .map((d, i) => `${i ? 'L' : 'M'}${this.x(i)},${this.y(d[key])}`)
      .join(' ');
  }

  protected readonly last = computed(() => this.data().at(-1)!);

  // Keeps the two end labels from overlapping when the series end close together.
  protected readonly labelY = computed(() => {
    const a = this.y(this.last().opened);
    const b = this.y(this.last().fixed);
    if (Math.abs(a - b) >= 14) return { opened: a, fixed: b };
    const mid = (a + b) / 2;
    return a <= b ? { opened: mid - 7, fixed: mid + 7 } : { opened: mid + 7, fixed: mid - 7 };
  });

  protected readonly tooltip = computed(() => {
    const i = this.active();
    if (i === null) return null;
    const d = this.data()[i];
    return { ...d, left: (this.x(i) / W) * 100, flip: i > this.data().length / 2 };
  });

  protected hover(event: PointerEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * W;
    const i = Math.round((px - PAD.left) / this.step());
    this.active.set(Math.min(Math.max(i, 0), this.data().length - 1));
  }

  protected key(event: KeyboardEvent): void {
    const n = this.data().length;
    const current = this.active() ?? -1;
    if (event.key === 'ArrowRight') this.active.set(Math.min(current + 1, n - 1));
    else if (event.key === 'ArrowLeft') this.active.set(Math.max(current - 1, 0));
    else return;
    event.preventDefault();
  }
}
