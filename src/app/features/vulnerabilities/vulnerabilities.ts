import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, WritableSignal, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FINDING_KINDS,
  FindingKind,
  FindingSummary,
  FindingsApi,
  findingIdentifier,
  findingParams,
  findingRoute,
  findingsUrl,
  packageLabel,
} from '../../core/api/findings';
import { ProjectSummary, repositoriesUrl } from '../../core/api/projects';
import { I18n } from '../../core/i18n';
import { FindingStatus, STATUS_ACTIONS, STATUS_KEYS, STATUS_TRANSITIONS, Severity, StatusAction, isoDate } from '../../core/domain';
import { problemMessage } from '../../core/api/api';
import { OrgContext } from '../../core/org/org-context';
import { RequestState } from '../../shared/request-state';
import { SeverityBadge } from '../../shared/severity-badge';
import { StatusLabel } from './status-label';
import { OrgSummary } from '../../core/org/org-summary';
import { NoRepositories } from '../../shared/no-repositories';
import { OrgLink } from '../../shared/org-link';
import { RepoName } from '../../shared/repo-name';
import { Paginator, paginate } from '../../shared/paginator';

type Sort = 'cvssDesc' | 'cvssAsc' | 'dateDesc' | 'dateAsc';

const SORT_PARAMS: Record<Sort, { sort: 'cvss' | 'detected'; dir: 'asc' | 'desc' }> = {
  cvssDesc: { sort: 'cvss', dir: 'desc' },
  cvssAsc: { sort: 'cvss', dir: 'asc' },
  dateDesc: { sort: 'detected', dir: 'desc' },
  dateAsc: { sort: 'detected', dir: 'asc' },
};

@Component({
  selector: 'app-vulnerabilities',
  imports: [RouterLink, DatePipe, SeverityBadge, StatusLabel, RequestState, OrgLink, NoRepositories, RepoName, Paginator],
  templateUrl: './vulnerabilities.html',
  styleUrl: './vulnerabilities.scss',
})
export class Vulnerabilities {
  protected readonly orgSummary = inject(OrgSummary);
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);
  private readonly api = inject(FindingsApi);

  /** "Overdue" or "Due in N days" from the remediation SLA. */
  protected dueLabel(dueAt: string, overdue: boolean): string {
    if (overdue) return this.i18n.t('vuln.overdue');
    const days = Math.max(0, Math.ceil((new Date(dueAt).getTime() - Date.now()) / 86_400_000));
    return this.i18n.t('vuln.dueIn').replace('{n}', String(days));
  }

  protected readonly severities: Severity[] = ['critical', 'high', 'medium', 'low'];
  protected readonly statuses = Object.keys(STATUS_KEYS) as FindingStatus[];
  protected readonly sorts: Sort[] = ['cvssDesc', 'cvssAsc', 'dateDesc', 'dateAsc'];
  protected readonly packageLabel = packageLabel;
  protected readonly findingIdentifier = findingIdentifier;
  protected readonly findingRoute = findingRoute;
  protected readonly kinds = FINDING_KINDS;

  // Initial filters may come from links (e.g. the dashboard charts): ?kind=&severity=&status=&repository=
  private readonly linked = inject(ActivatedRoute).snapshot.queryParamMap;

  protected readonly query = signal('');
  protected readonly kind = signal<FindingKind | ''>(this.allowed(this.linked.get('kind'), this.kinds));
  protected readonly severity = signal<Severity | ''>(this.allowed(this.linked.get('severity'), this.severities));
  protected readonly status = signal<FindingStatus | ''>(this.allowed(this.linked.get('status'), this.statuses));
  protected readonly repository = signal(this.linked.get('repository') ?? '');
  protected readonly sort = signal<Sort>('cvssDesc');

  // Only sent to the API once typing pauses.
  private readonly searchTerm = signal('');

  private readonly repositoryList = httpResource<ProjectSummary[]>(() => repositoriesUrl());
  protected readonly repositories = computed(() => (this.repositoryList.value() ?? []).map((r) => r.name));

  protected readonly results = httpResource<FindingSummary[]>(() => ({
    url: findingsUrl(),
    params: findingParams({
      q: this.searchTerm(),
      kind: this.kind(),
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

  protected readonly pager = paginate(this.rows, () => [
    this.searchTerm(),
    this.kind(),
    this.severity(),
    this.status(),
    this.repository(),
    this.sort(),
  ]);

  protected readonly hasFilters = computed(
    () => !!(this.query() || this.kind() || this.severity() || this.status() || this.repository()),
  );

  // Selection mode: several findings get the same status change at once.
  protected readonly selecting = signal(false);
  private readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  /** Only rows still on screen count, so changing filters never acts on hidden findings. */
  protected readonly selected = computed(() => this.rows().filter((f) => this.selectedIds().has(f.id)));
  /** The header checkbox acts on the rows of the current page. */
  private readonly pageSelected = computed(() => this.pager.items().filter((f) => this.selectedIds().has(f.id)).length);
  protected readonly allSelected = computed(() => this.pager.items().length > 0 && this.pageSelected() === this.pager.items().length);
  protected readonly someSelected = computed(() => this.pageSelected() > 0 && !this.allSelected());
  protected readonly actions = STATUS_ACTIONS;
  protected readonly accepting = signal(false);
  protected readonly saving = signal(false);
  protected readonly bulkError = signal<string | null>(null);
  protected readonly bulkMessage = signal<string | null>(null);
  protected readonly tomorrow = isoDate(1);
  protected readonly maxExpiry = isoDate(365);

  constructor() {
    effect((onCleanup) => {
      const term = this.query();
      const timer = setTimeout(() => this.searchTerm.set(term.trim()), 300);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected toggleSelecting(): void {
    this.selecting.update((on) => !on);
    this.selectedIds.set(new Set());
    this.accepting.set(false);
    this.bulkError.set(null);
    this.bulkMessage.set(null);
  }

  protected isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  protected toggle(id: string): void {
    this.selectedIds.update((ids) => {
      const next = new Set(ids);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  protected toggleAll(): void {
    const all = this.allSelected();
    this.selectedIds.update((ids) => {
      const next = new Set(ids);
      for (const f of this.pager.items()) {
        if (all) next.delete(f.id);
        else next.add(f.id);
      }
      return next;
    });
  }

  /** How many selected findings can move to the status. */
  protected applicable(action: StatusAction): number {
    return this.selected().filter((f) => STATUS_TRANSITIONS[f.status].includes(action)).length;
  }

  protected actionLabel(action: StatusAction): string {
    return this.i18n.t(`vuln.action.${action}`);
  }

  protected bulkApply(action: StatusAction): void {
    if (action === 'accepted') {
      this.bulkError.set(null);
      this.accepting.set(true);
      return;
    }
    this.submit(action);
  }

  protected confirmAccept(justification: string, expiresAt: string): void {
    if (justification.trim().length < 10 || !expiresAt) {
      this.bulkError.set(this.i18n.t('vuln.accept.invalid'));
      return;
    }
    this.submit('accepted', justification.trim(), expiresAt);
  }

  private submit(status: FindingStatus, note?: string, expiresAt?: string): void {
    const ids = this.selected()
      .filter((f) => STATUS_TRANSITIONS[f.status].includes(status))
      .map((f) => f.id);
    if (!ids.length) return;
    this.saving.set(true);
    this.bulkError.set(null);
    this.bulkMessage.set(null);
    this.api.changeStatuses(ids, status, note, expiresAt).subscribe({
      next: (result) => {
        this.saving.set(false);
        this.accepting.set(false);
        this.selectedIds.set(new Set());
        this.bulkMessage.set(this.i18n.t('vuln.bulk.done').replace('{n}', String(result.updated)));
        this.results.reload();
      },
      error: (err) => {
        this.saving.set(false);
        this.bulkError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }

  private allowed<T extends string>(value: string | null, options: readonly T[]): T | '' {
    return options.includes(value as T) ? (value as T) : '';
  }

  protected severityLabel(severity: Severity): string {
    return this.i18n.t(`sev.${severity}`);
  }

  protected kindLabel(kind: FindingKind | undefined): string {
    return this.i18n.t(`vuln.kind.${kind ?? 'vulnerability'}`);
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
    this.kind.set('');
    this.severity.set('');
    this.status.set('');
    this.repository.set('');
  }
}
