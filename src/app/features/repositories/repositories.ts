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
      <a class="btn primary" routerLink="/onboarding">{{ i18n.t('repo.add') }}</a>
    </header>

    <div class="card table-card">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">{{ i18n.t('col.repository') }}</th>
            <th scope="col">{{ i18n.t('col.stack') }}</th>
            <th scope="col">{{ i18n.t('col.schedule') }}</th>
            <th scope="col" class="num">{{ i18n.t('col.findings') }}</th>
            <th scope="col">{{ i18n.t('dash.lastScan') }}</th>
          </tr>
        </thead>
        <tbody>
          @for (repo of repositories; track repo.url) {
            <tr>
              <td>
                <strong>{{ repo.name }}</strong>
                <div class="mono muted url">{{ repo.url }}</div>
              </td>
              <td><span class="tag">{{ repo.stack }}</span></td>
              <td>{{ repo.schedule }}</td>
              <td class="num">{{ repo.findings }}</td>
              <td class="muted mono">{{ repo.lastScan }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .url {
      font-size: 0.8rem;
    }
  `,
})
export class Repositories {
  protected readonly i18n = inject(I18n);
  protected readonly repositories = REPOSITORIES;
}
