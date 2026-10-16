import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Auth } from '../../core/auth/auth';
import { I18n, TranslationKey } from '../../core/i18n';
import { LangSwitch } from '../../shared/lang-switch';
import { Logo } from '../../shared/logo';
import { ThemeToggle } from '../../shared/theme-toggle';

interface Capability {
  title: TranslationKey;
  desc: TranslationKey;
  icon: string;
}

@Component({
  selector: 'app-login',
  imports: [RouterLink, Logo, LangSwitch, ThemeToggle],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected readonly i18n = inject(I18n);
  private readonly auth = inject(Auth);

  /** Where to go after signing in; set by the auth guard. */
  readonly returnUrl = input<string>();
  protected readonly redirecting = signal(false);
  protected readonly failed = signal(false);
  protected readonly authority = environment.auth.authority;
  protected readonly localCertificate = environment.auth.localCertificate;

  protected async signIn(): Promise<void> {
    this.redirecting.set(true);
    this.failed.set(false);
    try {
      await this.auth.login(this.returnUrl() ?? '/dashboard');
    } catch (error) {
      console.error('Could not reach the identity provider', error);
      this.redirecting.set(false);
      this.failed.set(true);
    }
  }

  protected readonly capabilities: Capability[] = [
    {
      title: 'login.cap1.title',
      desc: 'login.cap1.desc',
      icon: 'M8 6 2 12l6 6 1.4-1.4L4.8 12l4.6-4.6zm8 0-1.4 1.4 4.6 4.6-4.6 4.6L16 18l6-6z',
    },
    {
      title: 'login.cap2.title',
      desc: 'login.cap2.desc',
      icon: 'M12 2 3 6v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V6zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4z',
    },
    {
      title: 'login.cap3.title',
      desc: 'login.cap3.desc',
      icon: 'M13 2 4 14h6l-1 8 9-12h-6z',
    },
  ];
}
