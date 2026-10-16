import { Severity } from './mock-data';
import { FailThreshold, Phase, StageId, defaultPipeline } from './pipeline';

export type RunStatus = 'success' | 'failed' | 'running' | 'queued' | 'cancelled';
export type RunTrigger = 'push' | 'schedule' | 'manual' | 'mergeRequest';
export type StageStatus = 'passed' | 'failed' | 'warning' | 'running' | 'pending' | 'skipped';

export interface StageRun {
  id: StageId;
  phase: Phase;
  tool: string;
  status: StageStatus;
  seconds: number;
  findings: number;
  failedBy?: Exclude<FailThreshold, 'never'>;
  log: string[];
}

export interface PipelineRun {
  id: number;
  repository: string;
  branch: string;
  commit: string;
  message: string;
  trigger: RunTrigger;
  actor: string;
  status: RunStatus;
  started: string;
  seconds: number;
  newFindings: number;
  totalFindings: number;
  stages: StageRun[];
}

type RawRun = Omit<PipelineRun, 'totalFindings'>;

type StageSpec = StageStatus | [StageStatus, number, Severity?];

const DEFAULTS = new Map(defaultPipeline().map((s) => [s.id, s]));

function log(id: StageId, tool: string, status: StageStatus, findings: number, failedBy?: Severity): string[] {
  const cmd = `$ artemis scan ${id} --tool ${tool.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  if (status === 'pending') return [];
  if (status === 'skipped') return [cmd, 'Skipped: a previous stage failed and the pipeline was stopped.'];
  if (status === 'running') return [cmd, `[${tool}] Fetching rules and databases...`, `[${tool}] Analyzing project files...`];

  const lines = [cmd, `[${tool}] Loaded configuration for this repository`, `[${tool}] Scan completed`];
  if (findings === 0) return [...lines, 'Result: no findings'];

  lines.push(`Result: ${findings} finding(s)`);
  if (failedBy) {
    lines.push(`Policy: fail on "${failedBy}" or above`, `ERROR: ${findings} finding(s) at or above "${failedBy}". Stage failed.`);
  } else {
    lines.push('WARNING: findings below the fail threshold were reported. Stage passed.');
  }
  return lines;
}

function stages(spec: Partial<Record<StageId, StageSpec>>, seconds: Partial<Record<StageId, number>> = {}): StageRun[] {
  return (Object.keys(spec) as StageId[]).map((id) => {
    const value = spec[id]!;
    const [status, findings = 0, failedBy] = Array.isArray(value) ? value : [value];
    const base = DEFAULTS.get(id)!;
    const duration = status === 'pending' || status === 'skipped' ? 0 : (seconds[id] ?? base.minutes * 55);
    return {
      id,
      phase: base.phase,
      tool: base.tool,
      status,
      seconds: duration,
      findings,
      failedBy: status === 'failed' ? failedBy : undefined,
      log: log(id, base.tool, status, findings, status === 'failed' ? failedBy : undefined),
    };
  });
}

// Placeholder data until the API is available.
const RAW: RawRun[] = [
  {
    id: 1284, repository: 'storefront-web', branch: 'feature/checkout-v2', commit: '9f2c41a', message: 'Add express checkout button',
    trigger: 'push', actor: 'ana.souza', status: 'running', started: '2026-10-16 11:42', seconds: 214, newFindings: 0,
    stages: stages({ secrets: 'passed', sast: ['warning', 1], sca: 'running', dockerfile: 'pending', image: 'pending', sbom: 'pending' }, { sast: 151 }),
  },
  {
    id: 1283, repository: 'payments-api', branch: 'main', commit: 'c81d7e0', message: 'Bump tomcat-embed-core to 10.1.30',
    trigger: 'mergeRequest', actor: 'rafael.lima', status: 'queued', started: '2026-10-16 11:40', seconds: 0, newFindings: 0,
    stages: stages({ secrets: 'pending', sast: 'pending', sca: 'pending', license: 'pending', dockerfile: 'pending', image: 'pending', sbom: 'pending', iac: 'pending', dast: 'pending' }),
  },
  {
    id: 1282, repository: 'payments-api', branch: 'main', commit: '4a0b9f3', message: 'Merge branch release/2.14',
    trigger: 'push', actor: 'rafael.lima', status: 'failed', started: '2026-10-16 09:15', seconds: 1302, newFindings: 2,
    stages: stages(
      { secrets: 'passed', sast: ['warning', 1], sca: ['failed', 1, 'critical'], license: 'skipped', dockerfile: 'skipped', image: 'skipped', sbom: 'skipped', iac: 'skipped', dast: 'skipped' },
      { sast: 248, sca: 121 },
    ),
  },
  {
    id: 1281, repository: 'storefront-web', branch: 'main', commit: 'e77a210', message: 'Update product grid styles',
    trigger: 'schedule', actor: 'Artemis scheduler', status: 'success', started: '2026-10-16 06:00', seconds: 586, newFindings: 0,
    stages: stages({ secrets: 'passed', sast: ['warning', 2], sca: ['warning', 1], dockerfile: 'passed', image: 'passed', sbom: 'passed' }),
  },
  {
    id: 1280, repository: 'backoffice', branch: 'develop', commit: '1bd03c5', message: 'Refactor user table filters',
    trigger: 'push', actor: 'julia.mendes', status: 'success', started: '2026-10-15 17:31', seconds: 498, newFindings: 1,
    stages: stages({ secrets: 'passed', sast: 'passed', sca: ['warning', 3], dockerfile: 'passed', image: 'passed', sbom: 'passed' }),
  },
  {
    id: 1279, repository: 'storefront-web', branch: 'feature/search-api', commit: '58ce9d4', message: 'Add search API client with token',
    trigger: 'mergeRequest', actor: 'bruno.alves', status: 'failed', started: '2026-10-15 15:08', seconds: 96, newFindings: 1,
    stages: stages({ secrets: ['failed', 1, 'low'], sast: 'skipped', sca: 'skipped', dockerfile: 'skipped', image: 'skipped', sbom: 'skipped' }, { secrets: 41 }),
  },
  {
    id: 1278, repository: 'payments-api', branch: 'feature/pix-refunds', commit: 'aa91f6e', message: 'Implement PIX refund endpoint',
    trigger: 'manual', actor: 'camila.rocha', status: 'cancelled', started: '2026-10-15 13:52', seconds: 187, newFindings: 0,
    stages: stages({ secrets: 'passed', sast: 'passed', sca: 'skipped', license: 'skipped', dockerfile: 'skipped', image: 'skipped', sbom: 'skipped', iac: 'skipped', dast: 'skipped' }),
  },
  {
    id: 1277, repository: 'payments-api', branch: 'main', commit: '0e5f8b2', message: 'Harden Dockerfile base image',
    trigger: 'push', actor: 'rafael.lima', status: 'success', started: '2026-10-15 10:20', seconds: 1544, newFindings: 0,
    stages: stages({ secrets: 'passed', sast: ['warning', 1], sca: 'passed', license: 'passed', dockerfile: 'passed', image: ['warning', 1], sbom: 'passed', iac: 'passed', dast: 'passed' }),
  },
  {
    id: 1276, repository: 'storefront-web', branch: 'main', commit: 'd2a6f87', message: 'Upgrade next to 14.2.10',
    trigger: 'push', actor: 'ana.souza', status: 'success', started: '2026-10-14 14:47', seconds: 602, newFindings: 0,
    stages: stages({ secrets: 'passed', sast: ['warning', 1], sca: ['warning', 1], dockerfile: 'passed', image: 'passed', sbom: 'passed' }),
  },
  {
    id: 1275, repository: 'backoffice', branch: 'main', commit: '7c4e119', message: 'Release 3.8.0',
    trigger: 'schedule', actor: 'Artemis scheduler', status: 'failed', started: '2026-10-14 06:00', seconds: 455, newFindings: 1,
    stages: stages({ secrets: 'passed', sast: ['warning', 1], sca: ['warning', 2], dockerfile: ['failed', 1, 'high'], image: 'skipped', sbom: 'skipped' }),
  },
  {
    id: 1274, repository: 'backoffice', branch: 'feature/audit-log', commit: '3f8b0d6', message: 'Add audit log export',
    trigger: 'mergeRequest', actor: 'julia.mendes', status: 'success', started: '2026-10-13 16:05', seconds: 471, newFindings: 0,
    stages: stages({ secrets: 'passed', sast: 'passed', sca: ['warning', 2], dockerfile: 'passed', image: 'passed', sbom: 'passed' }),
  },
  {
    id: 1273, repository: 'payments-api', branch: 'main', commit: 'b90c3a4', message: 'Add rate limiting to public API',
    trigger: 'schedule', actor: 'Artemis scheduler', status: 'failed', started: '2026-10-13 06:00', seconds: 1610, newFindings: 1,
    stages: stages({ secrets: 'passed', sast: ['warning', 1], sca: 'passed', license: 'passed', dockerfile: 'passed', image: ['failed', 1, 'critical'], sbom: 'skipped', iac: 'skipped', dast: 'skipped' }),
  },
];

export const RUNS: PipelineRun[] = RAW.map((r) => ({
  ...r,
  totalFindings: r.stages.reduce((sum, s) => sum + s.findings, 0),
}));

export function formatDuration(seconds: number): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`;
}
