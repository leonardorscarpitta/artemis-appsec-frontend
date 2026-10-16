import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, WritableSignal, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FindingSummary, findingParams, findingsUrl, packageLabel } from '../../core/api/findings';
import { ProjectSummary, repositoriesUrl } from '../../core/api/projects';
import { I18n } from '../../core/i18n';
import { FindingStatus, STATUS_KEYS, Severity } from '../../core/domain';
import { RequestState } from '../../shared/request-state';
import { SeverityBadge } from '../../shared/severity-badge';
import { StatusLabel } from './status-label';

type Sort = 'cvssDesc' | 'cvssAsc' | 'dateDesc' | 'dateAsc';

const SORT_PARAMS: Record<Sort, { sort: 'cvss' | 'detected'; dir: 'asc' | 'desc' }> = {
  cvssDesc: { sort: 'cvss', dir: 'desc' },
  cvssAsc: { sort: 'cvss', dir: 'asc' },
  dateDesc: { sort: 'detected', dir: 'desc' },
  dateAsc: { sort: 'detected', dir: 'asc' },
};

@Component({
  selector: 'app-vulnerabilities',
  imports: [RouterLink, DatePipe, SeverityBadge, StatusLabel, RequestState],
  templateUrl: './vulnerabilities.html',
  styleUrl: './vulnerabilities.scss',
})
export class Vulnerabilities {
  protected readonly i18n = inject(I18n);

  protected readonly severities: Severity[] = ['critical', 'high', 'medium', 'low'];
  protected readonly statuses = Object.keys(STATUS_KEYS) as FindingStatus[];
  protected readonly sorts: Sort[] = ['cvssDesc', 'cvssAsc', 'dateDesc', 'dateAsc'];
  protected readonly packageLabel = packageLabel;

  protected readonly query = signal('');
  protected readonly severity = signal<Severity | ''>('');
  protected readonly status = signal<FindingStatus | ''>('');
  protected readonly repository = signal('');
  protected readonly sort = signal<Sort>('cvssDesc');

  // Only sent to the API once typing pauses.
  private readonly searchTerm = signal('');

  private readonly repositoryList = httpResource<ProjectSummary[]>(() => repositoriesUrl());
  protected readonly repositories = computed(() => (this.repositoryList.value() ?? []).map((r) => r.name));

  protected readonly results = httpResource<FindingSummary[]>(() => ({
    url: findingsUrl(),
    params: findingParams({
      q: this.searchTerm(),
      severity: this.severity(),
      status: this.status(),
      repository: this.repository(),
      ...SORT_PARAMS[this.sort()],
    }),
  }));

  // Keeps the previous rows on screen while a new filter combination loads.
  protected readonly rows = linkedSignal<FindingSummary[] | undefined, FindingSummary[]>({
    source: this.results.value,
    computation: (value, previous) => value ?? previous?.value ?? [],
  });

  protected readonly hasFilters = computed(
    () => !!(this.query() || this.severity() || this.status() || this.repository()),
  );

  constructor() {
    effect((onCleanup) => {
      const term = this.query();
      const timer = setTimeout(() => this.searchTerm.set(term.trim()), 300);
      onCleanup(() => clearTimeout(timer));
    });
  }

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
    this.searchTerm.set('');
    this.severity.set('');
    this.status.set('');
    this.repository.set('');
  }
}
