import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardSummary, FindingsApi, dashboardUrl, findingIdentifier, findingRoute, packageLabel } from '../../core/api/findings';
import { problemMessage } from '../../core/api/api';
import { OrgContext } from '../../core/org/org-context';
import { I18n } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';
import { SeverityBadge } from '../../shared/severity-badge';
import { StatusLabel } from '../vulnerabilities/status-label';
import { OrgLink } from '../../shared/org-link';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, SeverityBadge, StatusLabel, RequestState, OrgLink],
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
}
