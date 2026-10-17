import { Component, inject, input } from '@angular/core';
import { I18n } from '../core/i18n';

/** A repository name, tagged when the repository was removed and only its history is kept. */
@Component({
  selector: 'app-repo-name',
  template: `
    {{ name() }}
    @if (removed()) {
      <span class="tag removed" [title]="i18n.t('repo.removedHint')">{{ i18n.t('repo.removedTag') }}</span>
    }
  `,
  styles: `
    .removed {
      margin-left: 0.35rem;
      vertical-align: middle;
      color: var(--sev-critical);
      background: var(--sev-critical-bg);
    }
  `,
})
export class RepoName {
  protected readonly i18n = inject(I18n);
  readonly name = input.required<string>();
  readonly removed = input(false);
}
