import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n, TranslationKey } from '../../core/i18n';
import { Severity } from '../../core/mock-data';
import { REPORTS, REPORT_DETAIL, ReportType } from '../../core/mock-reports';
import { SeverityBadge } from '../../shared/severity-badge';
import { TrendChart } from './trend-chart';

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

@Component({
  selector: 'app-report-view',
  imports: [RouterLink, SeverityBadge, TrendChart],
  templateUrl: './report-view.html',
  styleUrl: './report-view.scss',
})
export class ReportView {
  protected readonly i18n = inject(I18n);

  readonly id = input.required<string>();

  protected readonly report = computed(() => REPORTS.find((r) => r.id === this.id()));
  // Placeholder: every report shows the same sample content until the API exists.
  protected readonly detail = REPORT_DETAIL;
  protected readonly copied = signal(false);

  protected readonly severity = computed(() => {
    const total = SEVERITIES.reduce((sum, s) => sum + this.detail.severity[s], 0);
    return SEVERITIES.map((s) => ({
      severity: s,
      count: this.detail.severity[s],
      percent: total ? (this.detail.severity[s] / total) * 100 : 0,
      label: this.i18n.t(`sev.${s}`),
    }));
  });

  protected readonly owaspMax = Math.max(...REPORT_DETAIL.owasp.map((o) => o.findings));
  protected readonly recommendations: TranslationKey[] = ['reports.rec1', 'reports.rec2', 'reports.rec3', 'reports.rec4'];

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
