import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../api/api';
import { Auth } from './auth';

export interface CurrentUser {
  username: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  /** Artemis administrator: sees every organization's metadata, never its content. */
  platformAdmin: boolean;
}

/** The signed-in account as the API sees it (`GET /me`); loaded once per session. */
@Service()
export class Account {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private request: Promise<CurrentUser> | null = null;

  readonly me = signal<CurrentUser | null>(null);
  readonly platformAdmin = computed(() => this.auth.isAuthenticated() && (this.me()?.platformAdmin ?? false));

  load(): Promise<CurrentUser | null> {
    if (!this.auth.isAuthenticated()) return Promise.resolve(null);
    this.request ??= firstValueFrom(this.http.get<CurrentUser>(apiUrl('/me'))).then(
      (me) => {
        this.me.set(me);
        return me;
      },
      (error: unknown) => {
        this.request = null;
        throw error;
      },
    );
    return this.request;
  }
}
