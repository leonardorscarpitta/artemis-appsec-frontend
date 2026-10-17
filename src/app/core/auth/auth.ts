import { Service, computed, signal } from '@angular/core';
import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { environment } from '../../../environments/environment';

interface LoginState {
  returnUrl: string | null;
}

export interface Profile {
  username: string;
  name: string;
  email: string | null;
  initials: string;
}

/** OpenID Connect session with Keycloak (Authorization Code + PKCE; tokens in localStorage so every tab shares the session). */
@Service()
export class Auth {
  private readonly manager = new UserManager({
    authority: environment.auth.authority,
    client_id: environment.auth.clientId,
    redirect_uri: `${location.origin}/auth/callback`,
    post_logout_redirect_uri: `${location.origin}/`,
    response_type: 'code',
    scope: environment.auth.scope,
    loadUserInfo: false,
    automaticSilentRenew: false,
    userStore: new WebStorageStateStore({ store: localStorage }),
  });

  private readonly user = signal<User | null>(null);

  /** The user's own account page at the identity provider (profile, password, two-factor, deletion). */
  readonly accountUrl = `${environment.auth.authority}/account`;

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
    // Expired sessions are removed from storage too, so no stale access or refresh token is left behind.
    this.manager.events.addAccessTokenExpired(() => void this.clearSession());
  }

  /** Restores a session saved in this browser tab. */
  async init(): Promise<void> {
    const user = await this.manager.getUser();
    if (user?.expired) {
      await this.clearSession();
      return;
    }
    this.user.set(user);
  }

  accessToken(): string | null {
    return this.isAuthenticated() ? (this.user()?.access_token ?? null) : null;
  }

  login(returnUrl: string | null = null): Promise<void> {
    return this.manager.signinRedirect({ state: { returnUrl } satisfies LoginState });
  }

  /** Opens the identity provider's sign-up form; the new user returns signed in. */
  register(returnUrl: string | null = null): Promise<void> {
    return this.manager.signinRedirect({ prompt: 'create', state: { returnUrl } satisfies LoginState });
  }

  /** Completes the redirect from the identity provider and returns where the user was heading, if anywhere. */
  async completeLogin(): Promise<string | null> {
    const user = await this.manager.signinRedirectCallback();
    this.user.set(user);
    return (user.state as LoginState | undefined)?.returnUrl ?? null;
  }

  /** Signs out of Artemis and of the identity provider, which then returns to the home page. */
  async logout(): Promise<void> {
    const idToken = this.user()?.id_token;
    // Local tokens go first: the redirect leaves the app and must not leave a usable session behind.
    await this.clearSession();
    try {
      await this.manager.signoutRedirect({ id_token_hint: idToken });
    } catch (error) {
      console.error('Could not reach the identity provider to sign out', error);
    }
  }

  /** Forgets the tokens in this browser only (e.g. when the API rejects them). */
  async clearSession(): Promise<void> {
    await this.manager.removeUser();
    this.user.set(null);
  }
}
