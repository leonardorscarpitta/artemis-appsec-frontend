import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth';
import { I18n } from '../../core/i18n';
import { OrgContext, landingUrl } from '../../core/org/org-context';

@Component({
  selector: 'app-auth-callback',
  imports: [RouterLink],
  template: `
    <main class="center">
      @if (failed()) {
        <div class="card" role="alert">
          <h1>{{ i18n.t('auth.failed') }}</h1>
          <p class="muted">{{ i18n.t('auth.failedDesc') }}</p>
          <a class="btn primary" routerLink="/login">{{ i18n.t('api.retry') }}</a>
        </div>
      } @else {
        <p class="muted" role="status">{{ i18n.t('auth.signingIn') }}</p>
      }
    </main>
  `,
  styles: `
    .center {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1rem;
    }

    .card {
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 2rem;
    }

    .btn {
      align-self: flex-start;
    }
  `,
})
export class AuthCallback implements OnInit {
  protected readonly i18n = inject(I18n);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly org = inject(OrgContext);
  protected readonly failed = signal(false);

  async ngOnInit(): Promise<void> {
    try {
      const returnUrl = await this.auth.completeLogin();
      const orgs = await this.org.load(true).catch(() => []);
      await this.router.navigateByUrl(landingUrl(orgs, returnUrl), { replaceUrl: true });
    } catch (error) {
      console.error('Sign-in callback failed', error);
      this.failed.set(true);
    }
  }
}
