import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { problemMessage } from '../../core/api/api';
import { ProjectSummary, repositoriesUrl } from '../../core/api/projects';
import { ReportAuthor, ReportError, ReportPeriod, ReportStatus, ReportSummary, ReportType, ReportsApi, reportsUrl } from '../../core/api/reports';
import { OrgContext } from '../../core/org/org-context';
import { I18n } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';
import { OrgSummary } from '../../core/org/org-summary';
import { NoRepositories } from '../../shared/no-repositories';
import { LOCK_ICON, RoleNotice } from '../../shared/role-notice';
import { SPARKLE_ICON } from '../../shared/stack-source';
import { OrgLink } from '../../shared/org-link';
import { Paginator, paginate } from '../../shared/paginator';

@Component({
  selector: 'app-reports',
  imports: [RouterLink, DatePipe, RequestState, OrgLink, NoRepositories, RoleNotice, Paginator],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  protected readonly orgSummary = inject(OrgSummary);
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);
  private readonly api = inject(ReportsApi);

  // Titles are localized by the API, so the list is fetched again when the language changes.
  protected readonly reports = httpResource<ReportSummary[]>(() => ({
    url: reportsUrl(),
    headers: { 'Accept-Language': this.i18n.lang() },
  }));
  protected readonly pager = paginate(() => this.reports.value() ?? []);
  protected readonly repositories = httpResource<ProjectSummary[]>(() => repositoriesUrl());

  protected readonly sparkle = SPARKLE_ICON;
  protected readonly lock = LOCK_ICON;
  protected readonly canGenerate = computed(() => this.org.can('triage'));
  protected readonly aiEnabled = computed(() => this.org.hasFeature('aiTriage'));
  private readonly generating = computed(() => (this.reports.value() ?? []).some((r) => r.status === 'generating'));
  protected readonly retrying = signal<string | null>(null);
  protected readonly retryError = signal<string | null>(null);

  protected readonly formOpen = signal(false);
  protected readonly queued = signal(false);
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly types: ReportType[] = ['summary', 'compliance', 'dependencies'];
  protected readonly periods: ReportPeriod[] = ['week', 'month', 'quarter'];

  protected readonly type = signal<ReportType>('summary');
  protected readonly scope = signal('');
  protected readonly period = signal<ReportPeriod>('week');

  constructor() {
    // Keeps statuses current while any report is still being generated.
    effect((onCleanup) => {
      if (!this.generating()) return;
      const timer = setInterval(() => this.reports.reload(), 4000);
      onCleanup(() => clearInterval(timer));
    });
  }

  protected typeLabel(type: ReportType): string {
    return this.i18n.t(`reports.type.${type}`);
  }

  protected authorLabel(author: ReportAuthor): string {
    return this.i18n.t(`reports.by.${author}`);
  }

  protected statusLabel(status: ReportStatus): string {
    return this.i18n.t(`reports.status.${status}`);
  }

  protected errorLabel(error: ReportError): string {
    return this.i18n.t(`reports.error.${error}`);
  }

  protected periodLabel(period: ReportPeriod): string {
    return this.i18n.t(`reports.form.period.${period}`);
  }

  protected toggleForm(): void {
    this.formOpen.update((open) => !open);
    this.queued.set(false);
    this.submitError.set(null);
  }

  protected value(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  protected generate(): void {
    this.submitting.set(true);
    this.submitError.set(null);
    this.api.generate({ type: this.type(), scope: this.scope() || null, period: this.period() }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.formOpen.set(false);
        this.queued.set(true);
        this.reports.reload();
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }

  protected retry(id: string): void {
    this.retrying.set(id);
    this.retryError.set(null);
    this.api.retry(id).subscribe({
      next: () => {
        this.retrying.set(null);
        this.reports.reload();
      },
      error: (err) => {
        this.retrying.set(null);
        this.retryError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }
}
