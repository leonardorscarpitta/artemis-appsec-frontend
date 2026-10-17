import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../../core/i18n';
import { OrgLink } from '../../../shared/org-link';
import { ChartSeries } from './chart';

export interface BarRow {
  label: string;
  values: number[];
  /** Query parameters of the row's link to the findings list. */
  query: Record<string, string>;
}

/** Horizontal bars (stacked when there is more than one series), each linking to the matching findings. */
@Component({
  selector: 'app-bar-list',
  imports: [RouterLink, OrgLink],
  template: `
    @if (series().length > 1) {
      <ul class="legend">
        @for (s of series(); track s.label) {
          <li><span class="swatch" aria-hidden="true" [style.background]="s.color"></span>{{ s.label }}</li>
        }
      </ul>
    }
    <ul class="bars">
      @for (row of bars(); track row.label) {
        <li>
          <a class="bar" [routerLink]="'/vulnerabilities' | orgLink" [queryParams]="row.query" [attr.aria-label]="row.description">
            <span class="name" [class.mono]="mono()" [title]="row.label">{{ row.label }}</span>
            <span class="track" aria-hidden="true">
              @for (seg of row.segments; track $index) {
                <span class="seg" [style.width.%]="seg.percent" [style.background]="seg.color"></span>
              }
              <strong class="value">{{ row.total }}</strong>
            </span>
            @if (series().length > 1) {
              <span class="tooltip" aria-hidden="true">
                <strong class="when">{{ row.label }}</strong>
                @for (s of series(); track s.label; let i = $index) {
                  <span class="row"><span class="key" [style.background]="s.color"></span><strong>{{ row.values[i] }}</strong> {{ s.label }}</span>
                }
              </span>
            }
          </a>
        </li>
      }
    </ul>
  `,
  styleUrl: './bar-list.scss',
})
export class BarList {
  private readonly i18n = inject(I18n);
  readonly series = input.required<ChartSeries[]>();
  readonly rows = input.required<BarRow[]>();
  /** Monospace names (repositories). */
  readonly mono = input(false);

  protected readonly bars = computed(() => {
    const series = this.series();
    const totals = this.rows().map((r) => r.values.reduce((a, b) => a + b, 0));
    const max = Math.max(1, ...totals);
    return this.rows().map((row, r) => ({
      ...row,
      total: totals[r],
      // Leaves room for the value label at the tip of the longest bar.
      segments: row.values
        .map((v, i) => ({ percent: (v / max) * 85, color: series[i].color }))
        .filter((s) => s.percent > 0),
      description: `${row.label}: ${totals[r]}${
        series.length > 1 ? ` (${series.map((s, i) => `${s.label} ${row.values[i]}`).join(', ')})` : ''
      }. ${this.i18n.t('dash.viewFindings')}`,
    }));
  });
}
