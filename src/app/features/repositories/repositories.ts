import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectSummary, ScanSchedule, repositoriesUrl } from '../../core/api/projects';
import { I18n, TranslationKey } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';
import { OrgLink } from '../../shared/org-link';
import { RunScanButton } from '../../shared/run-scan-button';

const SCHEDULE_LABELS: Record<ScanSchedule, TranslationKey> = {
  push: 'ob.settings.interval.push',
  '6h': 'ob.settings.interval.6h',
  '24h': 'ob.settings.interval.24h',
  '7d': 'ob.settings.interval.7d',
};

@Component({
  selector: 'app-repositories',
  imports: [RouterLink, DatePipe, RequestState, OrgLink, RunScanButton],
  template: `
    <header class="page-header">
      <div>
        <h1>{{ i18n.t('repo.title') }}</h1>
        <p>{{ i18n.t('repo.subtitle') }}</p>
      </div>
      <div class="page-actions">
        <a class="btn primary" [routerLink]="'/onboarding' | orgLink">{{ i18n.t('repo.add') }}</a>
      </div>
    </header>

    <app-request-state [resource]="repositories" />
    @if (repositories.hasValue()) {
    <div class="card table-card">
      <table class="table stack">
        <thead>
          <tr>
            <th scope="col">{{ i18n.t('col.repository') }}</th>
            <th scope="col">{{ i18n.t('col.stack') }}</th>
            <th scope="col">{{ i18n.t('col.schedule') }}</th>
            <th scope="col" class="num">{{ i18n.t('col.findings') }}</th>
            <th scope="col">{{ i18n.t('dash.lastScan') }}</th>
            <th scope="col"><span class="sr-only">{{ i18n.t('repo.configure') }}</span></th>
          </tr>
        </thead>
        <tbody>
          @for (repo of repositories.value(); track repo.id) {
            <tr>
              <td class="primary-cell">
                <strong>{{ repo.name }}</strong>
                <div class="mono muted url">{{ repo.url }}</div>
              </td>
              <td [attr.data-label]="i18n.t('col.stack')"><span class="tag">{{ repo.stack }}</span></td>
              <td [attr.data-label]="i18n.t('col.schedule')">{{ i18n.t(scheduleLabels[repo.schedule]) }}</td>
              <td class="num" [attr.data-label]="i18n.t('col.findings')">{{ repo.openFindings ?? '—' }}</td>
              <td class="muted mono" [attr.data-label]="i18n.t('dash.lastScan')">{{ (repo.lastScanAt | date: 'yyyy-MM-dd HH:mm') ?? '—' }}</td>
              <td class="num actions" data-label="">
                <app-run-scan-button [repository]="repo.name" [compact]="true" />
                <a class="btn" [routerLink]="['/repositories', repo.name] | orgLink" [attr.aria-label]="i18n.t('repo.configure') + ': ' + repo.name">
                  {{ i18n.t('repo.configure') }}
                </a>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    }
  `,
  styles: `
    .url {
      font-size: 0.8rem;
      overflow-wrap: anywhere;
    }

    .btn {
      padding: 0.3rem 0.7rem;
      font-size: 0.85rem;
    }

    td.actions {
      white-space: nowrap;

      app-run-scan-button {
        margin-right: 0.4rem;
        vertical-align: top;
      }
    }

    @media (max-width: 599px) {
      .actions {
        padding-top: 0.6rem;

        .btn {
          flex: 1;
        }

        app-run-scan-button {
          flex: 1;
        }
      }
    }
  `,
})
export class Repositories {
  protected readonly i18n = inject(I18n);
  protected readonly repositories = httpResource<ProjectSummary[]>(() => repositoriesUrl());
  protected readonly scheduleLabels = SCHEDULE_LABELS;
}
