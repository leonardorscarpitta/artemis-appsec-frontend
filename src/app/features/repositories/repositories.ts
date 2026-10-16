import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { REPOSITORIES } from '../../core/mock-data';

@Component({
  selector: 'app-repositories',
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <div>
        <h1>{{ i18n.t('repo.title') }}</h1>
        <p>{{ i18n.t('repo.subtitle') }}</p>
      </div>
      <div class="page-actions">
        <a class="btn primary" routerLink="/onboarding">{{ i18n.t('repo.add') }}</a>
      </div>
    </header>

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
          @for (repo of repositories; track repo.url) {
            <tr>
              <td class="primary-cell">
                <strong>{{ repo.name }}</strong>
                <div class="mono muted url">{{ repo.url }}</div>
              </td>
              <td [attr.data-label]="i18n.t('col.stack')"><span class="tag">{{ repo.stack }}</span></td>
              <td [attr.data-label]="i18n.t('col.schedule')">{{ repo.schedule }}</td>
              <td class="num" [attr.data-label]="i18n.t('col.findings')">{{ repo.findings }}</td>
              <td class="muted mono" [attr.data-label]="i18n.t('dash.lastScan')">{{ repo.lastScan }}</td>
              <td class="num actions" data-label="">
                <a class="btn" [routerLink]="['/repositories', repo.name]" [attr.aria-label]="i18n.t('repo.configure') + ': ' + repo.name">
                  {{ i18n.t('repo.configure') }}
                </a>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
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

    @media (max-width: 599px) {
      .actions {
        padding-top: 0.6rem;

        .btn {
          flex: 1;
        }
      }
    }
  `,
})
export class Repositories {
  protected readonly i18n = inject(I18n);
  protected readonly repositories = REPOSITORIES;
}
