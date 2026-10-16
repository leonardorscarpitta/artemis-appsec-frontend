import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { LangSwitch } from '../../shared/lang-switch';
import { Logo } from '../../shared/logo';

@Component({
  selector: 'app-login',
  imports: [RouterLink, Logo, LangSwitch],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected readonly i18n = inject(I18n);
}
