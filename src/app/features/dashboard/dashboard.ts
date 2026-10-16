import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { FINDINGS, Severity, severityOf } from '../../core/mock-data';
import { SeverityBadge } from '../../shared/severity-badge';
import { StatusLabel } from '../vulnerabilities/status-label';

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, SeverityBadge, StatusLabel],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly i18n = inject(I18n);
  protected readonly findings = FINDINGS;
  protected readonly recent = [...FINDINGS].sort((a, b) => b.detected.localeCompare(a.detected)).slice(0, 8);

  private readonly open = computed(() => this.findings.filter((f) => f.status === 'open' || f.status === 'triaged'));

  protected readonly stats = computed(() => {
    const open = this.open();
    const avg = open.reduce((sum, f) => sum + f.cvss, 0) / (open.length || 1);
    return {
      open: open.length,
      critical: open.filter((f) => severityOf(f.cvss) === 'critical').length,
      avgCvss: avg.toFixed(1),
    };
  });

  protected readonly distribution = computed(() => {
    const open = this.open();
    return SEVERITIES.map((severity) => {
      const count = open.filter((f) => severityOf(f.cvss) === severity).length;
      return {
        severity,
        count,
        percent: open.length ? (count / open.length) * 100 : 0,
        label: this.i18n.t(`sev.${severity}`),
      };
    });
  });
}
