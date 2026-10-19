import { Component, inject, input } from '@angular/core';
import { Feature } from '../core/api/usage';
import { I18n } from '../core/i18n';
import { OrgContext } from '../core/org/org-context';

const CHECK_ICON = 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z';

/** Short note shown when the Artemis administrators enabled an optional feature for the current organization. */
@Component({
  selector: 'app-feature-granted',
  template: `
    @if (org.hasFeature(feature())) {
      <span class="granted" role="note">
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" [attr.d]="check" /></svg>
        {{ text() }}
      </span>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .granted {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--sev-low);
      font-size: 0.8rem;
      font-weight: 500;
    }
  `,
})
export class FeatureGranted {
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);
  protected readonly check = CHECK_ICON;
  readonly feature = input.required<Feature>();

  protected text(): string {
    return this.i18n.t(`feature.granted.${this.feature()}`);
  }
}
