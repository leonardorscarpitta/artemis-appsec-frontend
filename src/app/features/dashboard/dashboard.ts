import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardSummary, dashboardUrl, packageLabel } from '../../core/api/findings';
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
  protected readonly summary = httpResource<DashboardSummary>(() => dashboardUrl());
  protected readonly packageLabel = packageLabel;

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
}
