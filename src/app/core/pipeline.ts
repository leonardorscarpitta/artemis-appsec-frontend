import { Severity } from './domain';

export type Phase = 'source' | 'build' | 'deploy';
export type StageId = 'secrets' | 'sast' | 'sca' | 'license' | 'dockerfile' | 'image' | 'sbom' | 'iac' | 'dast';
export type FailThreshold = 'never' | Severity;
export type Preset = 'minimal' | 'recommended' | 'full';
export type CiProvider = 'github' | 'gitlab';

export interface PipelineStage {
  id: StageId;
  phase: Phase;
  tools: string[];
  tool: string;
  enabled: boolean;
  // Absent for stages that only produce artifacts and never fail the build.
  failOn?: FailThreshold | null;
  minutes: number;
  /** False for stages the scanner runner cannot execute yet; they stay disabled. */
  available: boolean;
}

export const PHASES: Phase[] = ['source', 'build', 'deploy'];
export const FAIL_THRESHOLDS: FailThreshold[] = ['never', 'critical', 'high', 'medium', 'low'];

const PRESETS: Record<Preset, StageId[]> = {
  minimal: ['secrets', 'sast', 'sca'],
  recommended: ['secrets', 'sast', 'sca', 'dockerfile', 'sbom'],
  full: ['secrets', 'sast', 'sca', 'license', 'dockerfile', 'sbom', 'iac'],
};

export function defaultPipeline(): PipelineStage[] {
  return [
    { id: 'secrets', phase: 'source', tools: ['Gitleaks'], tool: 'Gitleaks', enabled: true, failOn: 'low', minutes: 1, available: true },
    { id: 'sast', phase: 'source', tools: ['Semgrep'], tool: 'Semgrep', enabled: true, failOn: 'high', minutes: 4, available: true },
    { id: 'sca', phase: 'source', tools: ['Trivy', 'Grype'], tool: 'Trivy', enabled: true, failOn: 'critical', minutes: 2, available: true },
    { id: 'license', phase: 'source', tools: ['Trivy'], tool: 'Trivy', enabled: false, failOn: 'never', minutes: 1, available: true },
    { id: 'dockerfile', phase: 'build', tools: ['Hadolint', 'Trivy'], tool: 'Hadolint', enabled: true, failOn: 'high', minutes: 1, available: true },
    { id: 'image', phase: 'build', tools: ['Trivy'], tool: 'Trivy', enabled: false, failOn: 'critical', minutes: 3, available: true },
    { id: 'sbom', phase: 'build', tools: ['Syft'], tool: 'Syft', enabled: true, minutes: 1, available: true },
    { id: 'iac', phase: 'deploy', tools: ['Trivy'], tool: 'Trivy', enabled: false, failOn: 'high', minutes: 2, available: true },
    { id: 'dast', phase: 'deploy', tools: ['OWASP ZAP'], tool: 'OWASP ZAP', enabled: false, failOn: 'high', minutes: 12, available: false },
  ];
}

export function applyPreset(stages: PipelineStage[], preset: Preset): PipelineStage[] {
  return stages.map((s) => ({ ...s, enabled: s.available && PRESETS[preset].includes(s.id) }));
}

export function matchingPreset(stages: PipelineStage[]): Preset | null {
  const enabled = stages.filter((s) => s.enabled).map((s) => s.id);
  const match = (Object.keys(PRESETS) as Preset[]).find(
    (p) => PRESETS[p].length === enabled.length && PRESETS[p].every((id) => enabled.includes(id)),
  );
  return match ?? null;
}

const slug = (tool: string) => tool.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function command(stage: PipelineStage): string {
  const fail = stage.failOn ? ` --fail-on ${stage.failOn}` : '';
  return `artemisappsec scan ${stage.id} --tool ${slug(stage.tool)}${fail}`;
}

export function toYaml(stages: PipelineStage[], provider: CiProvider): string {
  const enabled = stages.filter((s) => s.enabled);

  if (provider === 'gitlab') {
    const phases = PHASES.filter((p) => enabled.some((s) => s.phase === p));
    const jobs = enabled.map(
      (s) => `${s.id}:\n  stage: ${s.phase}\n  image: artemisappsec/runner:latest\n  script:\n    - ${command(s)}`,
    );
    return [`stages: [${phases.join(', ')}]`, ...jobs].join('\n\n') + '\n';
  }

  const jobs = enabled.map((s) => {
    const previous = enabled.filter((o) => PHASES.indexOf(o.phase) === PHASES.indexOf(s.phase) - 1);
    const needs = previous.length ? `\n    needs: [${previous.map((o) => o.id).join(', ')}]` : '';
    return (
      `  ${s.id}:\n    runs-on: ubuntu-latest${needs}\n    container: artemisappsec/runner:latest\n` +
      `    steps:\n      - uses: actions/checkout@v4\n      - run: ${command(s)}`
    );
  });
  return `name: artemisappsec-devsecops\non: [push, pull_request]\n\njobs:\n${jobs.join('\n\n')}\n`;
}
