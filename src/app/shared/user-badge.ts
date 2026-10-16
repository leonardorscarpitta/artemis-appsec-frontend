import { Component, inject, input } from '@angular/core';
import { Auth } from '../core/auth/auth';
import { I18n } from '../core/i18n';

/** Signed-in user's avatar and name; opens the account page at the identity provider. */
@Component({
  selector: 'app-user-badge',
  template: `
    @if (auth.profile(); as profile) {
      <a
        class="badge-link"
        [href]="auth.accountUrl"
        target="_blank"
        rel="noopener"
        [title]="i18n.t('nav.account')"
        [attr.aria-label]="i18n.t('nav.account') + ': ' + profile.name"
      >
        <span class="avatar" aria-hidden="true">{{ profile.initials }}</span>
        @if (showName()) {
          <span class="user-name">
            <strong>{{ profile.name }}</strong>
            <span>{{ profile.email ?? profile.username }}</span>
          </span>
        }
      </a>
    }
  `,
  styles: `
    .badge-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.4rem;
      border-radius: var(--radius-sm);
      color: inherit;
      text-decoration: none;

      &:hover {
        background: var(--surface-hover);
      }
    }

    .avatar {
      display: grid;
      place-items: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--primary-soft);
      color: var(--primary);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .user-name {
      display: flex;
      flex-direction: column;
      line-height: 1.25;
      font-size: 0.8rem;
      color: var(--text-muted);

      strong {
        color: var(--text);
        font-weight: 500;
      }
    }

    @media (max-width: 599px) {
      .user-name {
        display: none;
      }
    }
  `,
})
export class UserBadge {
  protected readonly auth = inject(Auth);
  protected readonly i18n = inject(I18n);
  readonly showName = input(true);
}
