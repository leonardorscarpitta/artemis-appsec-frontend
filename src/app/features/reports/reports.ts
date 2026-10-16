import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { problemMessage } from '../../core/api/api';
import { ProjectSummary, repositoriesUrl } from '../../core/api/projects';
import { ReportAuthor, ReportPeriod, ReportStatus, ReportSummary, ReportType, ReportsApi, reportsUrl } from '../../core/api/reports';
import { I18n } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';

@Component({
  selector: 'app-reports',
  imports: [RouterLink, DatePipe, RequestState],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(ReportsApi);

  // Titles are localized by the API, so the list is fetched again when the language changes.
  protected readonly reports = httpResource<ReportSummary[]>(() => ({
    url: reportsUrl(),
    headers: { 'Accept-Language': this.i18n.lang() },
  }));
  protected readonly repositories = httpResource<ProjectSummary[]>(() => repositoriesUrl());

  protected readonly formOpen = signal(false);
  protected readonly queued = signal(false);
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly types: ReportType[] = ['summary', 'compliance'];
  protected readonly periods: ReportPeriod[] = ['week', 'month', 'quarter'];

  protected readonly type = signal<ReportType>('summary');
  protected readonly scope = signal('');
  protected readonly period = signal<ReportPeriod>('week');

  protected typeLabel(type: ReportType): string {
    return this.i18n.t(`reports.type.${type}`);
  }

  protected authorLabel(author: ReportAuthor): string {
    return this.i18n.t(`reports.by.${author}`);
  }

  protected statusLabel(status: ReportStatus): string {
    return this.i18n.t(`reports.status.${status}`);
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
}
