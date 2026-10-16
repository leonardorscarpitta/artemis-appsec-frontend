import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth';
import { I18n } from '../../core/i18n';
import { LangSwitch } from '../../shared/lang-switch';
import { Logo } from '../../shared/logo';
import { ThemeToggle } from '../../shared/theme-toggle';
import { Help } from '../help/help';

/** The user guide for visitors who are not signed in. */
@Component({
  selector: 'app-public-docs',
  imports: [RouterLink, Logo, LangSwitch, ThemeToggle, Help],
  template: `
    <a class="skip-link" href="#main">{{ i18n.t('nav.skip') }}</a>
    <header class="bar">
      <a routerLink="/" class="brand"><app-logo /></a>
      <span class="spacer"></span>
      <app-lang-switch />
      <app-theme-toggle />
      @if (auth.isAuthenticated()) {
        <a class="btn primary" routerLink="/dashboard">{{ i18n.t('nav.dashboard') }}</a>
      } @else {
        <a class="btn primary" routerLink="/login" [queryParams]="{ returnUrl: '/help' }">{{ i18n.t('login.sso') }}</a>
      }
    </header>
    <main id="main" tabindex="-1">
      <app-help />
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg);
    }

    .skip-link {
      position: absolute;
      left: 1rem;
      top: -3rem;
      padding: 0.5rem 1rem;
      background: var(--primary);
      color: var(--primary-contrast);
      border-radius: var(--radius-sm);
      z-index: 30;

      &:focus {
        top: 1rem;
      }
    }

    .bar {
      position: sticky;
      top: 0;
      z-index: 20;
      height: 56px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1.75rem;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }

    .brand {
      display: flex;
      align-items: center;
      color: var(--text);
      text-decoration: none;
    }

    .spacer {
      flex: 1;
    }

    main {
      max-width: 1280px;
      margin-inline: auto;
      padding: 1.75rem;

      &:focus {
        outline: none;
      }
    }

    @media (max-width: 599px) {
      .bar {
        padding: 0 1rem;
        gap: 0.35rem;
      }

      .brand app-logo {
        --logo-name-display: none;
      }

      main {
        padding: 1.25rem 1rem;
      }
    }
  `,
})
export class PublicDocs {
  protected readonly i18n = inject(I18n);
  protected readonly auth = inject(Auth);

  constructor() {
    inject(ViewportScroller).setOffset([0, 72]);
  }
}
