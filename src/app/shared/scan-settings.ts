import { Component, inject, signal } from '@angular/core';
import { I18n, TranslationKey } from '../core/i18n';

@Component({
  selector: 'app-scan-settings',
  templateUrl: './scan-settings.html',
  styleUrl: './scan-settings.scss',
})
export class ScanSettings {
  protected readonly i18n = inject(I18n);

  protected readonly dockerfile = signal<'recommended' | 'custom'>('recommended');
  protected readonly aiEnabled = signal(true);

  protected readonly intervals: TranslationKey[] = [
    'ob.settings.interval.push',
    'ob.settings.interval.6h',
    'ob.settings.interval.24h',
    'ob.settings.interval.7d',
  ];
  protected readonly actions: TranslationKey[] = [
    'ob.settings.action.issue',
    'ob.settings.action.email',
    'ob.settings.action.block',
  ];
}
