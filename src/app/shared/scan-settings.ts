import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AutomaticAction, DockerfileMode, ProjectSettings, ScanSchedule } from '../core/api/projects';
import { I18n, TranslationKey } from '../core/i18n';
import { OrgContext } from '../core/org/org-context';
import { OrgLink } from './org-link';
import { LOCK_ICON } from './role-notice';
import { Unavailable } from './unavailable';

const TIMED: ScanSchedule[] = ['6h', '24h', '7d'];

@Component({
  selector: 'app-scan-settings',
  imports: [RouterLink, OrgLink, Unavailable, DatePipe],
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
  protected readonly lock = LOCK_ICON;

  protected readonly schedules: { value: ScanSchedule; label: TranslationKey }[] = [
    { value: 'manual', label: 'ob.settings.interval.manual' },
    { value: 'push', label: 'ob.settings.interval.push' },
    { value: '6h', label: 'ob.settings.interval.6h' },
    { value: '24h', label: 'ob.settings.interval.24h' },
    { value: '7d', label: 'ob.settings.interval.7d' },
  ];
  protected readonly actions: { value: AutomaticAction; label: TranslationKey }[] = [
    { value: 'issue', label: 'ob.settings.action.issue' },
    { value: 'email', label: 'ob.settings.action.email' },
    { value: 'block', label: 'ob.settings.action.block' },
  ];

  protected setSchedule(event: Event): void {
    this.patch({ schedule: (event.target as HTMLSelectElement).value as ScanSchedule });
  }

  protected toggleAction(action: AutomaticAction, checked: boolean): void {
    const current = this.settings().automaticActions.filter((a) => a !== action);
    this.patch({ automaticActions: checked ? [...current, action] : current });
  }

  protected setDockerfileMode(mode: DockerfileMode): void {
    this.patch({ dockerfileMode: mode });
  }

  protected setCustomDockerfile(event: Event): void {
    this.patch({ customDockerfile: (event.target as HTMLTextAreaElement).value });
  }

  protected setContainerImage(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.patch({ containerImage: value || null });
  }

  private patch(change: Partial<ProjectSettings>): void {
    this.settings.update((s) => ({ ...s, ...change }));
  }
}
