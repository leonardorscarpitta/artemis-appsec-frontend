import { Component, inject, input } from '@angular/core';
import { Permission } from '../core/api/organization';
import { OrgContext } from '../core/org/org-context';

export const LOCK_ICON =
  'M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2m-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4m3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0z';

/** Read-only notice shown when the user's role lacks the permission a page or section needs. */
@Component({
  selector: 'app-role-notice',
  template: `
    @if (org.current() && !org.can(permission())) {
      <p class="info-notice" role="note">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" [attr.d]="lock" /></svg>
        <span>{{ org.reason(permission()) }}</span>
      </p>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .info-notice {
      margin: 0 0 1rem;
    }
  `,
})
export class RoleNotice {
  protected readonly org = inject(OrgContext);
  protected readonly lock = LOCK_ICON;
  readonly permission = input.required<Permission>();
}
