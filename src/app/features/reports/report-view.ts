import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportDetails, ReportType, reportUrl } from '../../core/api/reports';
import { I18n } from '../../core/i18n';
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

  protected typeLabel(type: ReportType): string {
    return this.i18n.t(`reports.type.${type}`);
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
