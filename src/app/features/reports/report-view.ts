import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentConcern, ImageStanding, ReportDetails, ReportError, ReportsApi, reportUrl } from '../../core/api/reports';
import { problemMessage } from '../../core/api/api';
import { SPARKLE_ICON } from '../../shared/stack-source';
import { I18n } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';
import { Severity } from '../../core/domain';
import { RequestState } from '../../shared/request-state';
import { SeverityBadge } from '../../shared/severity-badge';
import { TrendChart } from './trend-chart';
import { OrgLink } from '../../shared/org-link';

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

@Component({
  selector: 'app-report-view',
  imports: [RouterLink, DatePipe, SeverityBadge, TrendChart, RequestState, OrgLink],
  templateUrl: './report-view.html',
  styleUrl: './report-view.scss',
})
export class ReportView {
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);
  private readonly api = inject(ReportsApi);
  protected readonly sparkle = SPARKLE_ICON;

  readonly id = input.required<string>();

  protected readonly details = httpResource<ReportDetails>(() => ({
    url: reportUrl(this.id()),
    headers: { 'Accept-Language': this.i18n.lang() },
  }));
  protected readonly notFound = computed(() => {
    const status = (this.details.error() as { status?: number } | undefined)?.status;
    return status === 404 || status === 400;
  });
  protected readonly report = computed(() => this.details.value()?.report);
  protected readonly content = computed(() => this.details.value()?.content ?? null);
  protected readonly copied = signal(false);
  protected readonly retrying = signal(false);
  protected readonly retryError = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      if (this.report()?.status !== 'generating') return;
      const timer = setInterval(() => this.details.reload(), 4000);
      onCleanup(() => clearInterval(timer));
    });
  }

  protected isCve(id: string): boolean {
    return /^CVE-\d{4}-\d+$/.test(id);
  }

  protected errorLabel(error: ReportError | null): string {
    return this.i18n.t(`reports.error.${error ?? 'generation-failed'}`);
  }

  protected retry(): void {
    this.retrying.set(true);
    this.retryError.set(null);
    this.api.retry(this.id()).subscribe({
      next: () => {
        this.retrying.set(false);
        this.details.reload();
      },
      error: (err) => {
        this.retrying.set(false);
        this.retryError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }

  protected readonly severity = computed(() => {
    const counts = this.content()?.severity;
    if (!counts) return [];
    const total = SEVERITIES.reduce((sum, s) => sum + (counts[s] ?? 0), 0);
    return SEVERITIES.map((s) => ({
      severity: s,
      count: counts[s] ?? 0,
      percent: total ? ((counts[s] ?? 0) / total) * 100 : 0,
      label: this.i18n.t(`sev.${s}`),
    }));
  });

  protected readonly owaspMax = computed(() => Math.max(1, ...(this.content()?.owasp ?? []).map((o) => o.findings)));

  /** License or ecosystem counts as bars; "no license" is shown as its own row. */
  protected readonly licenseRows = computed(() => {
    const dep = this.content()?.dependencies;
    if (!dep) return [];
    const rows = dep.licenses.map((l) => ({ name: l.license, count: l.components }));
    if (dep.withoutLicense) rows.push({ name: this.i18n.t('reports.deps.noLicense'), count: dep.withoutLicense });
    return bars(rows);
  });
  protected readonly ecosystemRows = computed(() =>
    bars(Object.entries(this.content()?.dependencies?.ecosystems ?? {}).map(([name, count]) => ({ name, count }))),
  );

  protected concernLabel(concern: ComponentConcern): string {
    return this.i18n.t(`reports.deps.concern.${concern}`);
  }

  protected standingLabel(standing: ImageStanding): string {
    return this.i18n.t(`reports.deps.standing.${standing}`);
  }

  protected print(): void {
    window.print();
  }

  protected async share(): Promise<void> {
    await navigator.clipboard.writeText(location.href);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}

function bars(rows: { name: string; count: number }[]): { name: string; count: number; percent: number }[] {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return rows.map((r) => ({ ...r, percent: (r.count / max) * 100 }));
}
