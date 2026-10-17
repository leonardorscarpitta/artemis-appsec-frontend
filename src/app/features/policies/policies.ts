import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { problemMessage } from '../../core/api/api';
import { Policies as PolicyModel, PoliciesApi, RiskAcceptance, policiesUrl, riskAcceptancesUrl } from '../../core/api/policies';
import { ProjectSummary, repositoriesUrl } from '../../core/api/projects';
import { I18n } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';
import { Severity } from '../../core/domain';
import { FAIL_THRESHOLDS, FailThreshold, StageId, defaultPipeline } from '../../core/pipeline';
import { RouterLink } from '@angular/router';
import { RequestState } from '../../shared/request-state';
import { OrgLink } from '../../shared/org-link';
import { RoleNotice } from '../../shared/role-notice';

type LicenseList = 'licensesAllowed' | 'licensesDenied';

@Component({
  selector: 'app-policies',
  imports: [RequestState, RoleNotice, RouterLink, OrgLink],
  templateUrl: './policies.html',
  styleUrl: './policies.scss',
})
export class Policies {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(PoliciesApi);
  protected readonly org = inject(OrgContext);
  protected readonly canEdit = computed(() => this.org.can('pipelines'));
  protected readonly canTriage = computed(() => this.org.can('triage'));

  protected readonly server = httpResource<PolicyModel>(() => policiesUrl());
  protected readonly acceptances = httpResource<RiskAcceptance[]>(() => riskAcceptancesUrl());
  protected readonly repositories = httpResource<ProjectSummary[]>(() => repositoriesUrl(), { defaultValue: [] });
  private readonly unavailable = new Set(defaultPipeline().filter((s) => !s.available).map((s) => s.id));

  protected readonly accepting = signal(false);
  protected readonly acceptError = signal<string | null>(null);
  protected readonly listError = signal<string | null>(null);
  protected readonly tomorrow = isoDate(1);
  protected readonly maxExpiry = isoDate(365);

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

  protected available(stage: StageId): boolean {
    return !this.unavailable.has(stage);
  }

  protected acceptRisk(form: HTMLFormElement): void {
    const data = new FormData(form);
    const body = {
      finding: String(data.get('finding') ?? '').trim(),
      repository: String(data.get('repository') ?? ''),
      justification: String(data.get('justification') ?? '').trim(),
      expiresAt: String(data.get('expiresAt') ?? ''),
    };
    if (!body.finding || !body.repository || body.justification.length < 10 || !body.expiresAt) {
      this.acceptError.set(this.i18n.t('policies.exceptions.invalid'));
      return;
    }
    this.acceptError.set(null);
    this.api.acceptRisk(body).subscribe({
      next: () => {
        form.reset();
        this.accepting.set(false);
        this.acceptances.reload();
      },
      error: (err) => this.acceptError.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
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
    if (!confirm(this.i18n.t('policies.exceptions.revokeConfirm'))) return;
    this.listError.set(null);
    this.api.revokeRiskAcceptance(acceptance.id).subscribe({
      next: () => this.acceptances.reload(),
      error: (err) => this.listError.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
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

/** Local date {@code days} from today as yyyy-MM-dd. */
function isoDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
