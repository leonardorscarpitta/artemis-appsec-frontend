import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { REPOSITORIES } from '../../core/mock-data';
import { REPORTS, Report, ReportAuthor, ReportStatus, ReportType } from '../../core/mock-reports';

type Period = 'week' | 'month' | 'quarter';

@Component({
  selector: 'app-reports',
  imports: [RouterLink],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  protected readonly i18n = inject(I18n);

  protected readonly reports = signal<Report[]>(REPORTS);
  protected readonly formOpen = signal(false);
  protected readonly queued = signal(false);

  protected readonly types: ReportType[] = ['summary', 'aiTriage', 'compliance'];
  protected readonly periods: Period[] = ['week', 'month', 'quarter'];
  protected readonly repositories = REPOSITORIES.map((r) => r.name);

  protected readonly type = signal<ReportType>('summary');
  protected readonly scope = signal('');
  protected readonly period = signal<Period>('week');

  protected typeLabel(type: ReportType): string {
    return this.i18n.t(`reports.type.${type}`);
  }

  protected authorLabel(author: ReportAuthor): string {
    return this.i18n.t(`reports.by.${author}`);
  }

  protected statusLabel(status: ReportStatus): string {
    return this.i18n.t(`reports.status.${status}`);
  }

  protected periodLabel(period: Period): string {
    return this.i18n.t(`reports.form.period.${period}`);
  }

  protected toggleForm(): void {
    this.formOpen.update((open) => !open);
    this.queued.set(false);
  }

  protected value(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  protected generate(): void {
    const scope = this.scope() || null;
    const report: Report = {
      id: `r-new-${this.reports().length}`,
      title: `${this.typeLabel(this.type())}${scope ? ` – ${scope}` : ''}`,
      type: this.type(),
      scope,
      period: this.periodLabel(this.period()),
      generatedAt: '2026-10-16 08:00',
      generatedBy: 'user',
      status: 'generating',
    };
    this.reports.update((reports) => [report, ...reports]);
    this.formOpen.set(false);
    this.queued.set(true);
  }
}
