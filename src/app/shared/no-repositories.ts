import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../core/i18n';
import { OrgContext } from '../core/org/org-context';
import { OrgLink } from './org-link';

/** Shown on the Security pages while the organization has no repositories. */
@Component({
  selector: 'app-no-repositories',
  imports: [RouterLink, OrgLink],
  template: `
    <section class="card empty-repos" aria-labelledby="no-repos-title">
      <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z" />
      </svg>
      <h2 id="no-repos-title">{{ i18n.t('noRepos.title') }}</h2>
      @if (org.can('pipelines')) {
        <p class="muted">{{ i18n.t('noRepos.canAdd') }}</p>
        <a class="btn primary" [routerLink]="'/onboarding' | orgLink">{{ i18n.t('noRepos.add') }}</a>
      } @else {
        <p class="muted">{{ i18n.t('noRepos.askSomeone') }}</p>
      }
    </section>
  `,
  styles: `
    .empty-repos {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      max-width: 640px;
      margin: 1.5rem auto;
      padding: 2.5rem 1.5rem;
      text-align: center;

      svg {
        color: var(--primary);
      }

      h2 {
        margin: 0;
        font-size: 1.125rem;
      }

      p {
        margin: 0;
        line-height: 1.6;
      }
    }
  `,
})
export class NoRepositories {
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);
}
