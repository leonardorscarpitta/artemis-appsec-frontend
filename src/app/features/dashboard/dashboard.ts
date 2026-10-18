import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardSummary, FINDING_KINDS, FindingsApi, dashboardUrl, findingIdentifier, findingRoute, packageLabel } from '../../core/api/findings';
import { DashboardTrends, TrendDay, TrendPeriod, browserTimeZone, dashboardTrendsUrl } from '../../core/api/dashboard';
import { problemMessage } from '../../core/api/api';
import { OrgContext } from '../../core/org/org-context';
import { I18n } from '../../core/i18n';
import { Severity, severityOf } from '../../core/domain';
import { RequestState } from '../../shared/request-state';
import { SeverityBadge } from '../../shared/severity-badge';
import { NoRepositories } from '../../shared/no-repositories';
import { StatusLabel } from '../vulnerabilities/status-label';
import { OrgLink } from '../../shared/org-link';
import { ChartPoint, ChartSeries, formatDay } from './charts/chart';
import { TimeChart } from './charts/time-chart';
import { BarList, BarRow } from './charts/bar-list';
import { Sparkline } from './charts/sparkline';

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];
const SHORT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
const LONG: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, NgTemplateOutlet, SeverityBadge, StatusLabel, RequestState, OrgLink, NoRepositories, TimeChart, BarList, Sparkline],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly i18n = inject(I18n);
  private readonly findingsApi = inject(FindingsApi);
  private readonly org = inject(OrgContext);
  protected readonly exporting = signal(false);
  protected readonly exportError = signal<string | null>(null);
  protected readonly summary = httpResource<DashboardSummary>(() => dashboardUrl());
  protected readonly packageLabel = packageLabel;
  protected readonly findingIdentifier = findingIdentifier;
  protected readonly findingRoute = findingRoute;

  protected readonly periods: TrendPeriod[] = [30, 90];
  protected readonly period = signal<TrendPeriod>(30);
  protected readonly trends = httpResource<DashboardTrends>(() => ({
    url: dashboardTrendsUrl(),
    params: { days: this.period(), tz: browserTimeZone() },
  }));
  // Keeps the previous charts on screen (dimmed) while another period loads.
  protected readonly trendData = linkedSignal<DashboardTrends | undefined, DashboardTrends | undefined>({
    source: this.trends.value,
    computation: (value, previous) => value ?? previous?.value,
  });

  protected readonly distribution = computed(() => {
    const summary = this.summary.value();
    if (!summary) return [];
    return summary.bySeverity.map(({ severity, count }) => ({
      severity,
      count,
      percent: summary.openFindings ? (count / summary.openFindings) * 100 : 0,
      label: this.i18n.t(`sev.${severity}`),
    }));
  });

  /** Daily open totals and critical counts of the period, for the KPI sparklines and deltas. */
  protected readonly openSeries = computed(() => (this.trendData()?.days ?? []).map((d) => d.critical + d.high + d.medium + d.low));
  protected readonly criticalSeries = computed(() => (this.trendData()?.days ?? []).map((d) => d.critical));

  protected readonly criticalShare = computed(() => {
    const s = this.summary.value();
    return s?.openFindings ? Math.round((s.criticalFindings / s.openFindings) * 100) : 0;
  });

  protected readonly cvssRisk = computed<Severity | null>(() => {
    const cvss = this.summary.value()?.averageCvss;
    return cvss != null ? severityOf(cvss) : null;
  });

  protected readonly lastScan = computed(() => {
    const at = this.summary.value()?.lastScanAt;
    return at ? relativeTime(new Date(at), this.i18n.lang()) : null;
  });

  protected readonly runFigures = computed(() => {
    const days = this.trendData()?.days ?? [];
    const succeeded = sum(days, (d) => d.runsSucceeded);
    const total = succeeded + sum(days, (d) => d.runsFailed + d.runsCancelled);
    return { total, successRate: total ? Math.round((succeeded / total) * 100) : null };
  });

  protected readonly severitySeries = computed<ChartSeries[]>(() =>
    SEVERITIES.map((s) => ({ label: this.i18n.t(`sev.${s}`), color: `var(--chart-${s})` })),
  );

  protected readonly flowSeries = computed<ChartSeries[]>(() => [
    { label: this.i18n.t('dash.new'), color: 'var(--chart-high)' },
    { label: this.i18n.t('dash.fixed'), color: 'var(--chart-low)' },
  ]);

  protected readonly runSeries = computed<ChartSeries[]>(() => [
    { label: this.i18n.t('dash.runsSucceeded'), color: 'var(--chart-low)' },
    { label: this.i18n.t('dash.runsFailed'), color: 'var(--chart-critical)' },
    { label: this.i18n.t('dash.runsCancelled'), color: 'var(--chart-neutral)' },
  ]);

  protected readonly kindSeries = computed<ChartSeries[]>(() => [
    { label: this.i18n.t('dash.openFindings'), color: 'var(--primary)' },
  ]);

  protected readonly openPoints = computed(() =>
    this.dailyPoints((d) => [d.critical, d.high, d.medium, d.low]),
  );

  protected readonly runPoints = computed(() =>
    this.dailyPoints((d) => [d.runsSucceeded, d.runsFailed, d.runsCancelled]),
  );

  /** New vs fixed in 7-day buckets ending today (the oldest bucket may be shorter). */
  protected readonly weeklyPoints = computed<ChartPoint[]>(() => {
    const days = this.trendData()?.days ?? [];
    const lang = this.i18n.lang();
    const weeks: ChartPoint[] = [];
    for (let end = days.length; end > 0; end -= 7) {
      const chunk = days.slice(Math.max(0, end - 7), end);
      const first = chunk[0].date;
      const last = chunk[chunk.length - 1].date;
      weeks.unshift({
        key: first,
        axisLabel: formatDay(first, lang, SHORT),
        title: `${formatDay(first, lang, SHORT)} – ${formatDay(last, lang, SHORT)}`,
        values: [sum(chunk, (d) => d.detected), sum(chunk, (d) => d.fixed)],
      });
    }
    return weeks;
  });

  /** Every kind, largest first; kinds without open findings stay listed, dimmed. */
  protected readonly kindRows = computed<BarRow[]>(() => {
    const byKind = this.summary.value()?.byKind ?? [];
    return FINDING_KINDS.map((kind) => ({ kind, count: byKind.find((k) => k.kind === kind)?.count ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .map((k) => ({ label: this.i18n.t(`vuln.kind.${k.kind}`), values: [k.count], query: { kind: k.kind }, muted: k.count === 0 }));
  });

  protected readonly repositoryRows = computed<BarRow[]>(() =>
    (this.summary.value()?.topRepositories ?? []).map((r) => ({
      label: r.repository,
      values: [r.critical, r.high, r.medium, r.low],
      query: { repository: r.repository },
    })),
  );

  protected hasData(points: ChartPoint[]): boolean {
    return points.some((p) => p.values.some((v) => v > 0));
  }

  protected mttr(days: number): string {
    return this.i18n.t('dash.mttrValue').replace('{n}', days.toLocaleString(this.i18n.lang(), { maximumFractionDigits: 1 }));
  }

  /** Change between the first and the last day of the period; null while the trends load. */
  protected delta(series: number[]): number | null {
    return series.length ? series[series.length - 1] - series[0] : null;
  }

  protected deltaText(delta: number): string {
    const n = String(this.period());
    if (delta === 0) return this.i18n.t('dash.noChange').replace('{n}', n);
    return `${Math.abs(delta).toLocaleString(this.i18n.lang())} ${this.i18n.t('dash.vsAgo').replace('{n}', n)}`;
  }

  protected count(key: 'dash.shareOfOpen' | 'dash.monitoredOne' | 'dash.monitoredMany' | 'dash.openCount', n: number): string {
    return this.i18n.t(key).replace('{n}', n.toLocaleString(this.i18n.lang()));
  }

  protected periodLabel(period: TrendPeriod): string {
    return this.i18n.t(period === 30 ? 'dash.days30' : 'dash.days90');
  }

  protected exportCsv(): void {
    this.exporting.set(true);
    this.exportError.set(null);
    this.findingsApi.exportCsv().subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `artemis-findings-${this.org.slug()}-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.exporting.set(false);
      },
      error: (err) => {
        this.exporting.set(false);
        this.exportError.set(problemMessage(err) ?? this.i18n.t('dash.exportError'));
      },
    });
  }

  private dailyPoints(values: (day: TrendDay) => number[]): ChartPoint[] {
    const lang = this.i18n.lang();
    return (this.trendData()?.days ?? []).map((d) => ({
      key: d.date,
      axisLabel: formatDay(d.date, lang, SHORT),
      title: formatDay(d.date, lang, LONG),
      values: values(d),
    }));
  }
}

function relativeTime(date: Date, lang: string): string {
  const seconds = (date.getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['day', 86400], ['hour', 3600], ['minute', 60]];
  const format = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return format.format(0, 'minute');
}

function sum(days: TrendDay[], value: (day: TrendDay) => number): number {
  return days.reduce((total, d) => total + value(d), 0);
}
