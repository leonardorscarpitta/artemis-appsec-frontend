import { Component, inject, signal } from '@angular/core';
import { I18n } from '../../core/i18n';
import { Severity } from '../../core/mock-data';
import { defaultPolicies } from '../../core/mock-policies';
import { FAIL_THRESHOLDS, FailThreshold, StageId, defaultPipeline } from '../../core/pipeline';

type LicenseList = 'licensesAllowed' | 'licensesDenied';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.html',
  styleUrl: './policies.scss',
})
export class Policies {
  protected readonly i18n = inject(I18n);

  protected readonly policies = signal(defaultPolicies());
  protected readonly saved = signal(false);

  protected readonly stages = defaultPipeline().map((s) => s.id);
  protected readonly thresholds = FAIL_THRESHOLDS;
  protected readonly severities: Severity[] = ['critical', 'high', 'medium', 'low'];
  protected readonly lists: LicenseList[] = ['licensesAllowed', 'licensesDenied'];

  protected stageName(id: StageId): string {
    return this.i18n.t(`stage.${id}.name`);
  }

  protected failLabel(threshold: FailThreshold): string {
    return this.i18n.t(`pipe.fail.${threshold}`);
  }

  protected severityLabel(severity: Severity): string {
    return this.i18n.t(`sev.${severity}`);
  }

  protected listLabel(list: LicenseList): string {
    return this.i18n.t(list === 'licensesAllowed' ? 'policies.license.allowed' : 'policies.license.denied');
  }

  protected setFailOn(id: StageId, event: Event): void {
    const value = (event.target as HTMLSelectElement).value as FailThreshold;
    this.policies.update((p) => ({ ...p, failOn: { ...p.failOn, [id]: value } }));
  }

  protected toggleRequired(id: StageId): void {
    this.policies.update((p) => ({
      ...p,
      required: p.required.includes(id) ? p.required.filter((r) => r !== id) : [...p.required, id],
    }));
  }

  protected setSla(severity: Severity, event: Event): void {
    const days = Math.max(1, Number((event.target as HTMLInputElement).value) || 1);
    this.policies.update((p) => ({ ...p, slaDays: { ...p.slaDays, [severity]: days } }));
  }

  protected addLicense(list: LicenseList, input: HTMLInputElement): void {
    const license = input.value.trim();
    input.value = '';
    if (!license || this.policies()[list].includes(license)) return;
    this.policies.update((p) => ({ ...p, [list]: [...p[list], license] }));
  }

  protected removeLicense(list: LicenseList, license: string): void {
    this.policies.update((p) => ({ ...p, [list]: p[list].filter((l) => l !== license) }));
  }

  protected revoke(cve: string): void {
    this.policies.update((p) => ({ ...p, exceptions: p.exceptions.filter((e) => e.cve !== cve) }));
  }

  protected reset(): void {
    this.policies.set(defaultPolicies());
  }

  protected save(): void {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}
