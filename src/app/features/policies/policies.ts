import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { problemMessage } from '../../core/api/api';
import { Policies as PolicyModel, PoliciesApi, RiskAcceptance, policiesUrl, riskAcceptancesUrl } from '../../core/api/policies';
import { I18n } from '../../core/i18n';
import { Severity } from '../../core/domain';
import { FAIL_THRESHOLDS, FailThreshold, StageId } from '../../core/pipeline';
import { RequestState } from '../../shared/request-state';

type LicenseList = 'licensesAllowed' | 'licensesDenied';

@Component({
  selector: 'app-policies',
  imports: [RequestState],
  templateUrl: './policies.html',
  styleUrl: './policies.scss',
})
export class Policies {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(PoliciesApi);

  protected readonly server = httpResource<PolicyModel>(() => policiesUrl());
  protected readonly acceptances = httpResource<RiskAcceptance[]>(() => riskAcceptancesUrl());

  /** Local draft; reset whenever the server copy changes. */
  protected readonly policies = linkedSignal(() => this.server.value());
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly thresholds = FAIL_THRESHOLDS;
  protected readonly lists: LicenseList[] = ['licensesAllowed', 'licensesDenied'];
  protected readonly dirty = computed(() => JSON.stringify(this.policies()) !== JSON.stringify(this.server.value()));

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

  protected setFailOn(stage: StageId, event: Event): void {
    const failOn = (event.target as HTMLSelectElement).value as FailThreshold;
    this.patch((p) => ({ ...p, stages: p.stages.map((g) => (g.stage === stage ? { ...g, failOn } : g)) }));
  }

  protected toggleRequired(stage: StageId): void {
    this.patch((p) => ({ ...p, stages: p.stages.map((g) => (g.stage === stage ? { ...g, required: !g.required } : g)) }));
  }

  protected setSla(severity: Severity, event: Event): void {
    const days = Math.min(365, Math.max(1, Math.round(Number((event.target as HTMLInputElement).value)) || 1));
    (event.target as HTMLInputElement).value = String(days);
    this.patch((p) => ({ ...p, slaDays: p.slaDays.map((s) => (s.severity === severity ? { ...s, days } : s)) }));
  }

  protected addLicense(list: LicenseList, input: HTMLInputElement): void {
    const license = input.value.trim();
    input.value = '';
    const current = this.policies();
    if (!license || !current || current.licensesAllowed.includes(license) || current.licensesDenied.includes(license)) return;
    this.patch((p) => ({ ...p, [list]: [...p[list], license] }));
  }

  protected removeLicense(list: LicenseList, license: string): void {
    this.patch((p) => ({ ...p, [list]: p[list].filter((l) => l !== license) }));
  }

  protected revoke(acceptance: RiskAcceptance): void {
    this.error.set(null);
    this.api.revokeRiskAcceptance(acceptance.id).subscribe({
      next: () => this.acceptances.reload(),
      error: (err) => this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
  }

  protected reset(): void {
    this.error.set(null);
    this.server.reload();
  }

  protected save(): void {
    const draft = this.policies();
    if (!draft) return;
    this.saving.set(true);
    this.error.set(null);
    this.api.update(draft).subscribe({
      next: (updated) => {
        this.server.set(updated);
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }

  private patch(change: (p: PolicyModel) => PolicyModel): void {
    this.policies.update((p) => (p ? change(p) : p));
  }
}
