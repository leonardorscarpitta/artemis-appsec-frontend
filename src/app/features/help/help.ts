import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { HELP } from './help-content';

@Component({
  selector: 'app-help',
  imports: [RouterLink],
  templateUrl: './help.html',
  styleUrl: './help.scss',
})
export class Help {
  protected readonly i18n = inject(I18n);
  protected readonly sections = computed(() => HELP[this.i18n.lang()]);
}
