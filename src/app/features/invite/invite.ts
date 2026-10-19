import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { problemCode } from '../../core/api/api';
import { InvitationPreview, OrganizationApi } from '../../core/api/organization';
import { I18n, TranslationKey } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';

/** Shows a one-time invitation link (/invite/<token>) and joins only after the signed-in user confirms. */
@Component({
  selector: 'app-invite',
  imports: [RouterLink],
  template: `
    <main class="center">
      @if (error(); as message) {
        <div class="card" role="alert">
          <h1>{{ i18n.t('invite.failed') }}</h1>
          <p class="muted">{{ i18n.t(message) }}</p>
          <a class="btn primary" routerLink="/organizations">{{ i18n.t('invite.toOrganizations') }}</a>
        </div>
      } @else if (joining()) {
        <p class="muted" role="status">{{ i18n.t('invite.joining') }}</p>
      } @else if (preview(); as invitation) {
        <div class="card">
          <h1>{{ question(invitation) }}</h1>
          <p class="muted">{{ i18n.t('invite.explain') }}</p>
          <div class="actions">
            <button type="button" class="btn primary" (click)="join()">{{ i18n.t('invite.join') }}</button>
            <a class="btn" routerLink="/organizations">{{ i18n.t('invite.notNow') }}</a>
          </div>
        </div>
      } @else {
        <p class="muted" role="status">{{ i18n.t('invite.reading') }}</p>
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
      max-width: 440px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 2rem;

      h1 {
        margin: 0;
        font-size: 1.25rem;
      }

      p {
        margin: 0;
      }
    }

    .btn {
      align-self: flex-start;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  `,
})
export class Invite implements OnInit {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(OrganizationApi);
  private readonly org = inject(OrgContext);
  private readonly router = inject(Router);

  readonly token = input.required<string>();
  protected readonly error = signal<TranslationKey | null>(null);
  protected readonly preview = signal<InvitationPreview | null>(null);
  protected readonly joining = signal(false);

  ngOnInit(): void {
    this.api.previewInvitationLink(this.token()).subscribe({
      next: (invitation) => this.preview.set(invitation),
      error: () => this.error.set('invite.invalid'),
    });
  }

  protected question(invitation: InvitationPreview): string {
    return this.i18n
      .t('invite.question')
      .replace('{org}', invitation.organizationName)
      .replace('{role}', this.i18n.t(`team.role.${invitation.role}` as TranslationKey));
  }

  protected join(): void {
    this.joining.set(true);
    this.api.acceptInvitationLink(this.token()).subscribe({
      next: (joined) => {
        this.org.upsert(joined);
        void this.router.navigateByUrl(`/${joined.slug}/dashboard`, { replaceUrl: true });
      },
      error: (err) =>
        this.error.set(problemCode(err) === 'already-member' ? 'invite.alreadyMember' : 'invite.invalid'),
    });
  }
}
