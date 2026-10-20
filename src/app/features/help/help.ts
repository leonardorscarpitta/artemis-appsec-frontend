import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { HELP, HelpSection } from './help-content';
import { PlatformLimits } from '../../core/api/limits';

/** Long-form document page (table of contents + sections). Shows the user guide unless given other content. */
@Component({
  selector: 'app-help',
  imports: [RouterLink],
  templateUrl: './help.html',
  styleUrl: './help.scss',
})
export class Help {
  protected readonly i18n = inject(I18n);

  readonly content = input<HelpSection[]>();
  readonly heading = input<string>();
  readonly subheading = input<string>();
  readonly meta = input<string>();

  private readonly limits = inject(PlatformLimits);

  protected readonly sections = computed(() => this.limits.fill(this.content() ?? HELP[this.i18n.lang()]));
  protected readonly title = computed(() => this.heading() ?? this.i18n.t('nav.help'));
  protected readonly subtitle = computed(() => this.subheading() ?? this.i18n.t('help.subtitle'));
}
