import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal, viewChild } from '@angular/core';
import { I18n } from '../../../core/i18n';
import { ChartPoint, ChartSeries, columnPath, compact, countTicks } from './chart';

type Kind = 'area' | 'stacked' | 'grouped';

const MARGIN = { top: 10, right: 8, bottom: 24, left: 36 };
const GAP = 2;
const MAX_BAR = 24;

/**
 * Time series as a stacked area, stacked columns or grouped columns, with a hover/keyboard readout and a data table.
 * Series are stacked in the given order (first at the bottom).
 */
@Component({
  selector: 'app-time-chart',
  templateUrl: './time-chart.html',
  styleUrl: './time-chart.scss',
  host: { '[class.compact]': 'width() < 480' },
})
export class TimeChart {
  protected readonly i18n = inject(I18n);
  readonly series = input.required<ChartSeries[]>();
  readonly points = input.required<ChartPoint[]>();
  readonly kind = input<Kind>('area');
  /** Accessible name of the plot; also the caption of the data table. */
  readonly label = input.required<string>();

  private readonly plot = viewChild.required<ElementRef<HTMLElement>>('plot');
  protected readonly width = signal(640);
  protected readonly active = signal<number | null>(null);

  protected readonly height = computed(() => (this.width() < 480 ? 180 : 220));

  protected readonly geometry = computed(() => {
    const points = this.points();
    const kind = this.kind();
    const width = this.width();
    const height = this.height();
    const plotW = Math.max(1, width - MARGIN.left - MARGIN.right);
    const plotH = height - MARGIN.top - MARGIN.bottom;
    const n = points.length;
    const max = Math.max(
      0,
      ...points.map((p) => (kind === 'grouped' ? Math.max(0, ...p.values) : p.values.reduce((a, b) => a + b, 0))),
    );
    const ticks = countTicks(max);
    const top = ticks[ticks.length - 1];
    const y = (v: number) => MARGIN.top + plotH - (v / top) * plotH;
    const band = plotW / Math.max(1, n);
    const x = (i: number) =>
      kind === 'area' ? MARGIN.left + (n <= 1 ? plotW / 2 : (i * plotW) / (n - 1)) : MARGIN.left + band * (i + 0.5);

    const labelEvery = Math.max(1, Math.ceil(n / (width < 480 ? 4 : 7)));
    const xLabels = points
      .map((p, i) => {
        const at = x(i);
        const anchor = at > width - MARGIN.right - 28 ? 'end' : at < MARGIN.left + 28 ? 'start' : 'middle';
        return { i, text: p.axisLabel, x: anchor === 'end' ? width - MARGIN.right : at, anchor };
      })
      .filter(({ i }) => (n - 1 - i) % labelEvery === 0);

    return {
      width,
      height,
      plotW,
      baseline: y(0),
      top: MARGIN.top,
      left: MARGIN.left,
      band,
      x,
      yTicks: ticks.map((t) => ({ value: compact(t, this.i18n.lang()), y: y(t) })),
      xLabels,
      areas: kind === 'area' ? this.areas(points, x, y) : [],
      columns: kind === 'area' ? [] : this.columns(points, kind, x, y, band),
    };
  });

  protected readonly readout = computed(() => {
    const index = this.active();
    const point = index === null ? undefined : this.points()[index];
    if (!point || index === null) return null;
    const g = this.geometry();
    const x = g.x(index);
    return {
      point,
      x,
      total: point.values.reduce((a, b) => a + b, 0),
      // Keeps the tooltip inside the plot: right of the crosshair on the left half, left of it otherwise.
      flip: x > g.width / 2,
    };
  });

  protected readonly summary = computed(() => {
    const points = this.points();
    const last = points[points.length - 1];
    if (!last) return this.label();
    const parts = this.series().map((s, i) => `${s.label} ${last.values[i]}`);
    return `${this.label()}. ${last.title}: ${parts.join(', ')}. ${this.i18n.t('dash.chartHint')}`;
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new ResizeObserver(([entry]) => this.width.set(Math.max(240, Math.floor(entry.contentRect.width))));
      observer.observe(this.plot().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected point(event: PointerEvent): void {
    const n = this.points().length;
    if (!n) return;
    const g = this.geometry();
    const rect = this.plot().nativeElement.getBoundingClientRect();
    const px = event.clientX - rect.left - g.left;
    const index = this.kind() === 'area' ? Math.round(n <= 1 ? 0 : (px / g.plotW) * (n - 1)) : Math.floor(px / g.band);
    this.active.set(Math.min(n - 1, Math.max(0, index)));
  }

  protected key(event: KeyboardEvent): void {
    const n = this.points().length;
    if (!n) return;
    const current = this.active() ?? n;
    const next = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: n - 1 }[event.key];
    if (next === undefined) {
      if (event.key === 'Escape') this.active.set(null);
      return;
    }
    event.preventDefault();
    this.active.set(Math.min(n - 1, Math.max(0, next)));
  }

  private areas(points: ChartPoint[], x: (i: number) => number, y: (v: number) => number) {
    const lower = points.map(() => 0);
    return this.series().map((series, s) => {
      const upper = points.map((p, i) => lower[i] + p.values[s]);
      const top = upper.map((v, i) => `${x(i)},${y(v)}`);
      const bottom = lower.map((v, i) => `${x(i)},${y(v)}`).reverse();
      const fill = `M${top.join('L')}L${bottom.join('L')}Z`;
      const edge = `M${top.join('L')}`;
      upper.forEach((v, i) => (lower[i] = v));
      return { color: series.color, fill, edge };
    });
  }

  private columns(points: ChartPoint[], kind: Kind, x: (i: number) => number, y: (v: number) => number, band: number) {
    const count = this.series().length;
    const marks: { color: string; d: string }[] = [];
    points.forEach((p, i) => {
      if (kind === 'stacked') {
        const width = Math.min(MAX_BAR, Math.max(2, band * 0.7));
        const left = x(i) - width / 2;
        const topmost = p.values.reduce((last, v, s) => (v > 0 ? s : last), -1);
        let base = 0;
        p.values.forEach((v, s) => {
          if (v <= 0) return;
          const yTop = y(base + v);
          const height = y(base) - yTop - (s === topmost ? 0 : GAP);
          marks.push({ color: this.series()[s].color, d: columnPath(left, yTop + (s === topmost ? 0 : GAP), width, height, s === topmost) });
          base += v;
        });
      } else {
        const width = Math.min(MAX_BAR, Math.max(2, (band * 0.8 - GAP * (count - 1)) / count));
        const start = x(i) - (width * count + GAP * (count - 1)) / 2;
        p.values.forEach((v, s) => {
          if (v <= 0) return;
          const yTop = y(v);
          marks.push({ color: this.series()[s].color, d: columnPath(start + s * (width + GAP), yTop, width, y(0) - yTop, true) });
        });
      }
    });
    return marks;
  }
}
