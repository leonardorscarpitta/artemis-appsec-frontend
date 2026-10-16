import { Service, computed, signal } from '@angular/core';
import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { environment } from '../../../environments/environment';

interface LoginState {
  returnUrl: string;
}

export interface Profile {
  username: string;
  name: string;
  email: string | null;
  initials: string;
}

/** OpenID Connect session with Authelia (Authorization Code + PKCE, tokens kept in sessionStorage). */
@Service()
export class Auth {
  private readonly manager = new UserManager({
    authority: environment.auth.authority,
    client_id: environment.auth.clientId,
    redirect_uri: `${location.origin}/auth/callback`,
    response_type: 'code',
    scope: environment.auth.scope,
    loadUserInfo: false,
    automaticSilentRenew: false,
    userStore: new WebStorageStateStore({ store: sessionStorage }),
  });

  private readonly user = signal<User | null>(null);

  readonly isAuthenticated = computed(() => {
    const user = this.user();
    return !!user && !user.expired;
  });

  readonly profile = computed<Profile | null>(() => {
    const claims = this.user()?.profile;
    if (!claims) return null;
    const name = claims.name ?? claims.preferred_username ?? claims.sub;
    return {
      username: claims.preferred_username ?? claims.sub,
      name,
      email: claims.email ?? null,
      initials: name
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
    };
  });

  constructor() {
    this.manager.events.addAccessTokenExpired(() => this.user.set(null));
  }

  /** Restores a session saved in this browser tab. */
  async init(): Promise<void> {
    const user = await this.manager.getUser();
    this.user.set(user && !user.expired ? user : null);
  }

  accessToken(): string | null {
    return this.isAuthenticated() ? (this.user()?.access_token ?? null) : null;
  }

  login(returnUrl = '/dashboard'): Promise<void> {
    return this.manager.signinRedirect({ state: { returnUrl } satisfies LoginState });
  }

  /** Completes the redirect from Authelia and returns where the user was heading. */
  async completeLogin(): Promise<string> {
    const user = await this.manager.signinRedirectCallback();
    this.user.set(user);
    return (user.state as LoginState | undefined)?.returnUrl ?? '/dashboard';
  }

  /** Ends the Artemis session. Authelia does not support RP-initiated logout yet, so its own session remains. */
  async logout(): Promise<void> {
    await this.manager.removeUser();
    this.user.set(null);
  }
}
