import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectSettings, ScanSchedule } from '../core/api/projects';
import { I18n, TranslationKey } from '../core/i18n';
import { OrgContext } from '../core/org/org-context';
import { OrgLink } from './org-link';
import { LOCK_ICON } from './role-notice';
import { FeatureGranted } from './feature-granted';

const TIMED: ScanSchedule[] = ['6h', '24h', '7d'];

@Component({
  selector: 'app-scan-settings',
  imports: [RouterLink, OrgLink, FeatureGranted, DatePipe],
  templateUrl: './scan-settings.html',
  styleUrl: './scan-settings.scss',
})
export class ScanSettings {
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);

  readonly settings = model.required<ProjectSettings>();
  /** The saved repository's schedule and next scheduled scan (absent while onboarding). */
  readonly savedSchedule = input<ScanSchedule | null>(null);
  readonly nextScanAt = input<string | null>(null);

  /** Timed schedules must be enabled by the Artemis administrators; without it saved ones stay inactive. */
  protected readonly scheduledScans = computed(() => this.org.hasFeature('scheduledScans'));
  protected readonly timed = computed(() => TIMED.includes(this.settings().schedule));
  protected readonly nextScan = computed(() =>
    this.scheduledScans() && this.timed() && this.settings().schedule === this.savedSchedule() ? this.nextScanAt() : null,
  );
  protected readonly aiTriage = computed(() => this.org.hasFeature('aiTriage'));
  protected readonly lock = LOCK_ICON;

  protected readonly schedules: { value: ScanSchedule; label: TranslationKey }[] = [
    { value: 'manual', label: 'ob.settings.interval.manual' },
    { value: '6h', label: 'ob.settings.interval.6h' },
    { value: '24h', label: 'ob.settings.interval.24h' },
    { value: '7d', label: 'ob.settings.interval.7d' },
  ];

  protected setSchedule(event: Event): void {
    this.patch({ schedule: (event.target as HTMLSelectElement).value as ScanSchedule });
  }

  protected setContainerImage(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.patch({ containerImage: value || null });
  }

  private patch(change: Partial<ProjectSettings>): void {
    this.settings.update((s) => ({ ...s, ...change }));
  }
}
