import { Component, inject, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AutomaticAction, DockerfileMode, ProjectSettings, ScanSchedule } from '../core/api/projects';
import { I18n, TranslationKey } from '../core/i18n';
import { OrgLink } from './org-link';

@Component({
  selector: 'app-scan-settings',
  imports: [RouterLink, OrgLink],
  templateUrl: './scan-settings.html',
  styleUrl: './scan-settings.scss',
})
export class ScanSettings {
  protected readonly i18n = inject(I18n);

  readonly settings = model.required<ProjectSettings>();

  protected readonly schedules: { value: ScanSchedule; label: TranslationKey }[] = [
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

  private patch(change: Partial<ProjectSettings>): void {
    this.settings.update((s) => ({ ...s, ...change }));
  }
}
