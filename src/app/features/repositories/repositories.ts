import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectFolder, ProjectSummary, ScanSchedule, repositoriesUrl } from '../../core/api/projects';
import { I18n, TranslationKey } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';
import { OrgLink } from '../../shared/org-link';
import { RunScanButton } from '../../shared/run-scan-button';
import { OrgContext } from '../../core/org/org-context';
import { OrgSummary } from '../../core/org/org-summary';
import { NoRepositories } from '../../shared/no-repositories';
import { RoleNotice } from '../../shared/role-notice';

const SCHEDULE_LABELS: Record<ScanSchedule, TranslationKey> = {
  manual: 'ob.settings.interval.manual',
  push: 'ob.settings.interval.push',
  '6h': 'ob.settings.interval.6h',
  '24h': 'ob.settings.interval.24h',
  '7d': 'ob.settings.interval.7d',
};

@Component({
  selector: 'app-repositories',
  imports: [RouterLink, DatePipe, RequestState, OrgLink, RunScanButton, RoleNotice, NoRepositories],
  template: `
    <header class="page-header">
      <div>
        <h1>{{ i18n.t('repo.title') }}</h1>
        <p>{{ i18n.t('repo.subtitle') }}</p>
      </div>
      <div class="page-actions">
        @if (org.can('pipelines')) {
          <a class="btn primary" [routerLink]="'/onboarding' | orgLink">{{ i18n.t('repo.add') }}</a>
        } @else {
          <button type="button" class="btn primary" disabled [title]="org.reason('pipelines')">{{ i18n.t('repo.add') }}</button>
        }
      </div>
    </header>

    @if (orgSummary.noRepositories()) {
      <app-no-repositories />
    } @else {
    <app-role-notice permission="pipelines" />
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
                <a class="repo-link" [routerLink]="['/repositories', repo.name] | orgLink" [queryParams]="{ tab: 'general' }"><strong>{{ repo.name }}</strong></a>
                @if (repo.access === 'ssh') {
                  <a
                    class="tag"
                    [class.ok]="repo.accessStatus === 'verified'"
                    [class.bad]="repo.accessStatus === 'failed'"
                    [class.warn]="repo.accessStatus !== 'verified' && repo.accessStatus !== 'failed'"
                    [routerLink]="['/repositories', repo.name] | orgLink"
                    [queryParams]="{ tab: 'access' }"
                  >{{ i18n.t(repo.accessStatus === 'verified' ? 'access.status.verified' : repo.accessStatus === 'failed' ? 'access.status.failed' : 'access.status.pending') }}</a>
                }
                <div class="mono muted url" [title]="repo.url">{{ repo.url }}</div>
              </td>
              <td [attr.data-label]="i18n.t('col.stack')">
                @if (repo.folders.length) {
                  <span class="tag" [title]="folderSummary(repo.folders)">{{ i18n.t('mono.tag') }} · {{ repo.folders.length }}</span>
                } @else {
                  @if (repo.stackSource === 'pending') {
                    <span class="tag pending">{{ i18n.t('repo.stackPending') }}</span>
                  } @else {
                    <span class="tag">{{ repo.stack }}</span>
                    @if (repo.stackSource === 'detected') {
                      <span class="tag auto" [title]="i18n.t('rs.stackDetectedHint')">{{ i18n.t('repo.stackDetected') }}</span>
                    }
                  }
                }
              </td>
              <td [attr.data-label]="i18n.t('col.schedule')">{{ i18n.t(scheduleLabels[repo.schedule]) }}</td>
              <td class="num" [attr.data-label]="i18n.t('col.findings')">{{ repo.openFindings ?? '—' }}</td>
              <td class="muted mono" [attr.data-label]="i18n.t('dash.lastScan')">{{ (repo.lastScanAt | date: 'yyyy-MM-dd HH:mm') ?? '—' }}</td>
              <td class="num actions" data-label="">
                <app-run-scan-button [repository]="repo.name" [compact]="true" [folders]="folderPaths(repo.folders)" [stacks]="folderStacks(repo.folders)" [ready]="repo.accessStatus === 'verified'" />
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
    }
  `,
  styles: `
    .primary-cell .tag {
      margin-left: 0.4rem;
      vertical-align: middle;
    }

    a.tag {
      text-decoration: none;
    }

    .repo-link {
      color: var(--text);
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: var(--primary);
        text-decoration: underline;
      }
    }

    .tag.warn {
      color: var(--sev-medium);
      background: var(--sev-medium-bg);
    }

    .tag.bad {
      color: var(--sev-critical);
      background: var(--sev-critical-bg);
    }

    .tag.pending,
    .tag.auto {
      color: var(--primary);
      background: var(--primary-soft);
    }

    .tag.ok {
      color: var(--sev-low);
      background: var(--sev-low-bg);
    }

    .url {
      max-width: 16rem;
      overflow: hidden;
      font-size: 0.8rem;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  protected readonly orgSummary = inject(OrgSummary);
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);
  protected readonly repositories = httpResource<ProjectSummary[]>(() => repositoriesUrl());
  protected readonly scheduleLabels = SCHEDULE_LABELS;

  protected folderPaths(folders: ProjectFolder[]): string[] {
    return folders.map((f) => f.path);
  }

  protected folderStacks(folders: ProjectFolder[]): Record<string, string> {
    return Object.fromEntries(folders.map((f) => [f.path, f.stack ?? '']));
  }

  protected folderSummary(folders: ProjectFolder[]): string {
    return folders.map((f) => `${f.path} · ${f.stack}`).join(', ');
  }
}
