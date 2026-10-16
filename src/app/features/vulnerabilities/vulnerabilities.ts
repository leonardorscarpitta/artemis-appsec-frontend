import { Component, WritableSignal, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { FINDINGS, FindingStatus, REPOSITORIES, STATUS_KEYS, Severity, severityOf } from '../../core/mock-data';
import { SeverityBadge } from '../../shared/severity-badge';
import { StatusLabel } from './status-label';

type Sort = 'cvssDesc' | 'cvssAsc' | 'dateDesc' | 'dateAsc';

@Component({
  selector: 'app-vulnerabilities',
  imports: [RouterLink, SeverityBadge, StatusLabel],
  templateUrl: './vulnerabilities.html',
  styleUrl: './vulnerabilities.scss',
})
export class Vulnerabilities {
  protected readonly i18n = inject(I18n);

  protected readonly severities: Severity[] = ['critical', 'high', 'medium', 'low'];
  protected readonly statuses = Object.keys(STATUS_KEYS) as FindingStatus[];
  protected readonly repositories = REPOSITORIES.map((r) => r.name);
  protected readonly sorts: Sort[] = ['cvssDesc', 'cvssAsc', 'dateDesc', 'dateAsc'];

  protected readonly query = signal('');
  protected readonly severity = signal<Severity | ''>('');
  protected readonly status = signal<FindingStatus | ''>('');
  protected readonly repository = signal('');
  protected readonly sort = signal<Sort>('cvssDesc');

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const results = FINDINGS.filter(
      (f) =>
        (!q || [f.cve, f.pkg, f.title].some((v) => v.toLowerCase().includes(q))) &&
        (!this.severity() || severityOf(f.cvss) === this.severity()) &&
        (!this.status() || f.status === this.status()) &&
        (!this.repository() || f.repository === this.repository()),
    );
    const compare: Record<Sort, (a: (typeof results)[0], b: (typeof results)[0]) => number> = {
      cvssDesc: (a, b) => b.cvss - a.cvss,
      cvssAsc: (a, b) => a.cvss - b.cvss,
      dateDesc: (a, b) => b.detected.localeCompare(a.detected),
      dateAsc: (a, b) => a.detected.localeCompare(b.detected),
    };
    return results.sort(compare[this.sort()]);
  });

  protected readonly hasFilters = computed(
    () => !!(this.query() || this.severity() || this.status() || this.repository()),
  );

  protected severityLabel(severity: Severity): string {
    return this.i18n.t(`sev.${severity}`);
  }

  protected statusLabel(status: FindingStatus): string {
    return this.i18n.t(STATUS_KEYS[status]);
  }

  protected sortLabel(sort: Sort): string {
    return this.i18n.t(`vuln.sort.${sort}`);
  }

  protected update<T extends string>(target: WritableSignal<T>, event: Event): void {
    target.set((event.target as HTMLInputElement | HTMLSelectElement).value as T);
  }

  protected clear(): void {
    this.query.set('');
    this.severity.set('');
    this.status.set('');
    this.repository.set('');
  }
}
