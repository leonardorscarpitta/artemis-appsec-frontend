export type IntegrationCategory = 'scm' | 'ci' | 'notifications' | 'issues' | 'vulnData';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error';

export type IntegrationId =
  | 'github'
  | 'gitlab'
  | 'bitbucket'
  | 'githubActions'
  | 'gitlabCi'
  | 'jenkins'
  | 'slack'
  | 'teams'
  | 'email'
  | 'webhook'
  | 'jira'
  | 'githubIssues'
  | 'nvd';

export interface Integration {
  id: IntegrationId;
  name: string;
  short: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  detail?: string;
}

export interface DeployKey {
  id: string;
  name: string;
  fingerprint: string;
  repository: string;
  added: string;
  lastUsed: string;
}

export type Role = 'owner' | 'admin' | 'analyst' | 'developer' | 'viewer';
export type Permission = 'viewFindings' | 'triage' | 'pipelines' | 'integrations' | 'team' | 'billing';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastActive: string;
  active: boolean;
}

export interface Invitation {
  email: string;
  role: Role;
  sent: string;
}

export interface ApiToken {
  id: string;
  name: string;
  scopes: string[];
  created: string;
  expires: string;
  lastUsed: string;
}

export const ROLES: Role[] = ['owner', 'admin', 'analyst', 'developer', 'viewer'];
export const PERMISSIONS: Permission[] = ['viewFindings', 'triage', 'pipelines', 'integrations', 'team', 'billing'];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: PERMISSIONS,
  admin: ['viewFindings', 'triage', 'pipelines', 'integrations', 'team'],
  analyst: ['viewFindings', 'triage', 'pipelines'],
  developer: ['viewFindings', 'triage'],
  viewer: ['viewFindings'],
};

// Placeholder data until the API is available.
export const INTEGRATIONS: Integration[] = [
  { id: 'github', name: 'GitHub', short: 'GH', category: 'scm', status: 'connected', detail: 'acme' },
  { id: 'gitlab', name: 'GitLab', short: 'GL', category: 'scm', status: 'connected', detail: 'acme' },
  { id: 'bitbucket', name: 'Bitbucket', short: 'BB', category: 'scm', status: 'disconnected' },
  { id: 'githubActions', name: 'GitHub Actions', short: 'GA', category: 'ci', status: 'connected' },
  { id: 'gitlabCi', name: 'GitLab CI', short: 'GC', category: 'ci', status: 'disconnected' },
  { id: 'jenkins', name: 'Jenkins', short: 'JK', category: 'ci', status: 'error', detail: 'HTTP 401' },
  { id: 'slack', name: 'Slack', short: 'SL', category: 'notifications', status: 'connected', detail: '#appsec-alerts' },
  { id: 'teams', name: 'Microsoft Teams', short: 'MT', category: 'notifications', status: 'disconnected' },
  { id: 'email', name: 'E-mail', short: '@', category: 'notifications', status: 'connected', detail: 'security@acme.example' },
  { id: 'webhook', name: 'Webhook', short: 'WH', category: 'notifications', status: 'disconnected' },
  { id: 'jira', name: 'Jira', short: 'JI', category: 'issues', status: 'connected', detail: 'SEC' },
  { id: 'githubIssues', name: 'GitHub Issues', short: 'GI', category: 'issues', status: 'disconnected' },
  { id: 'nvd', name: 'NIST NVD', short: 'NVD', category: 'vulnData', status: 'connected', detail: '2026-10-16 03:00' },
];

export const DEPLOY_KEYS: DeployKey[] = [
  { id: 'k1', name: 'artemis-storefront', fingerprint: 'SHA256:3Kf9qX1vLr8cT0bW2mYp7sDn4eAh6uZjQ5gVtR1oIwE', repository: 'storefront-web', added: '2026-08-02', lastUsed: '2026-10-15' },
  { id: 'k2', name: 'artemis-payments', fingerprint: 'SHA256:p7Zt2LxQ9vB4nM6cR1yK8wJ3dF5hG0sAeU2iO7lTqXk', repository: 'payments-api', added: '2026-08-14', lastUsed: '2026-10-15' },
  { id: 'k3', name: 'artemis-backoffice', fingerprint: 'SHA256:Wm4Rb8Yc1Nq6Tz3Hv9Lk2Pj5Xs0Df7Ga1Ue8Io4Ky6', repository: 'backoffice', added: '2026-09-01', lastUsed: '2026-10-12' },
];

export const MEMBERS: Member[] = [
  { id: 'm1', name: 'Ana Souza', email: 'ana.souza@acme.example', role: 'owner', lastActive: '2026-10-16', active: true },
  { id: 'm2', name: 'Bruno Lima', email: 'bruno.lima@acme.example', role: 'admin', lastActive: '2026-10-15', active: true },
  { id: 'm3', name: 'Carla Mendes', email: 'carla.mendes@acme.example', role: 'analyst', lastActive: '2026-10-16', active: true },
  { id: 'm4', name: 'Daniel Rocha', email: 'daniel.rocha@acme.example', role: 'developer', lastActive: '2026-10-14', active: true },
  { id: 'm5', name: 'Elisa Prado', email: 'elisa.prado@acme.example', role: 'developer', lastActive: '2026-10-09', active: true },
  { id: 'm6', name: 'Felipe Nunes', email: 'felipe.nunes@acme.example', role: 'viewer', lastActive: '2026-09-21', active: false },
];

export const INVITATIONS: Invitation[] = [
  { email: 'gabriel.alves@acme.example', role: 'developer', sent: '2026-10-14' },
  { email: 'helena.costa@acme.example', role: 'analyst', sent: '2026-10-11' },
];

export const API_TOKENS: ApiToken[] = [
  { id: 't1', name: 'CI runner', scopes: ['scans:write', 'findings:read'], created: '2026-07-20', expires: '2027-01-20', lastUsed: '2026-10-16' },
  { id: 't2', name: 'SIEM export', scopes: ['findings:read'], created: '2026-09-03', expires: '2026-12-03', lastUsed: '2026-10-15' },
];

export const ORG = {
  name: 'Acme Corp',
  slug: 'acme',
  issuer: 'https://auth.acme.example',
  clientId: 'artemis-web',
};
