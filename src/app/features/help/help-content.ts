import { Lang } from '../../core/i18n';

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'ul' | 'ol'; items: string[] }
  | { kind: 'note'; text: string }
  | { kind: 'table'; head: string[]; rows: string[][] };

export interface HelpSection {
  id: string;
  title: string;
  blocks: Block[];
}

export const HELP: Record<Lang, HelpSection[]> = {
  'en-US': [
    {
      id: 'getting-started',
      title: 'Getting started',
      blocks: [
        { kind: 'p', text: 'Artemis is an application security testing platform. It connects to your Git repositories, runs a configurable DevSecOps pipeline on them and reports vulnerabilities scored with CVSS, using the NIST National Vulnerability Database as the source.' },
        { kind: 'p', text: 'The home page presents the product, how it works and answers to common questions. Select "Get started" to create an account or "Sign in" if you already have one. This guide is also available without signing in, from "Documentation" on the home page. The Privacy Policy and Terms of Use are linked in the footer of the home and sign-in pages: Artemis never sells or shares information about you or your organization.' },
        { kind: 'p', text: 'To create an account, select "Get started" on the home page or "Create an account" on the sign-in screen. The sign-up form (provided by Keycloak, the Artemis identity service) asks for your name, e-mail and a password of at least 12 characters, and asks you to accept the Terms of Use and Privacy Policy. Afterwards you create an organization or join one you were invited to (see "Organizations and invitations").' },
        { kind: 'p', text: 'To sign in, select "Sign in" and enter your username or e-mail and password; you return to the page you were trying to open. If you forgot your password, use "Forgot password?" on the sign-in page. Authentication uses OpenID Connect; Artemis itself never sees or stores your password. Several failed attempts temporarily lock the account to protect it.' },
        { kind: 'p', text: 'Your name appears in the top bar while you are signed in, next to your role in the current organization; select your name to open your account page at the identity service (profile, password, two-factor authentication, signed-in devices and account deletion). The session is shared by all tabs of the browser, and the home page shows you as signed in with a "Go to dashboard" button, plus a "Your workspace" section listing your organizations and pending invitations. If the session expires you are asked to sign in again. "Sign out" ends both your Artemis session and your session at the identity service.' },
        { kind: 'p', text: 'The interface is organized as follows:' },
        {
          kind: 'ul',
          items: [
            'Sidebar: navigation grouped into Overview, Security and Configuration. Badges show the number of open vulnerabilities and connected repositories.',
            'New project button: starts the flow to connect a new repository.',
            'Bottom of the sidebar: scans used this month against your plan limit, this help page and the current organization. Select the organization to switch to another one or to open "All organizations".',
            'Top bar: language selector (English or Portuguese), light/dark theme toggle and sign out. Language and theme are remembered in your browser.',
            'Addresses: every page lives under your organization, for example /acme/vulnerabilities. Links you share point to the same page for your colleagues.',
          ],
        },
        { kind: 'p', text: 'Artemis adapts to your screen. On smaller laptop screens the sidebar shows icons only; point at it (or move the keyboard focus into it) and it expands to show every name. On tablets and phones the sidebar is hidden: open it with the menu button at the top left and close it with the X button, the Escape key or by tapping outside it.' },
      ],
    },
    {
      id: 'organizations',
      title: 'Organizations and invitations',
      blocks: [
        { kind: 'p', text: 'Everything in Artemis — repositories, findings, pipelines, reports, policies, integrations, team, settings and plan — belongs to an organization. You can be a member of several organizations, with a different role in each, and their data is kept completely separate.' },
        { kind: 'p', text: 'After signing in you go straight to your organization if you have only one; otherwise the Organizations page (/organizations) opens. It shows:' },
        {
          kind: 'ul',
          items: [
            'Your organizations: name, address, your role and plan. Select one to open its dashboard.',
            'Pending invitations: invitations sent to your account’s e-mail address, with the role offered and the expiry date. Select "Accept" to join (you go to its dashboard) or "Decline" to discard it.',
            'Create organization: enter a name and, if you like, edit the URL name (3–40 lowercase letters, numbers and hyphens, used in every link, such as /acme/dashboard). You become the owner and the organization starts on the Free plan. Each person can own up to 5 organizations; some URL names are reserved.',
          ],
        },
        { kind: 'p', text: 'To switch organization at any time, select the organization at the bottom of the sidebar and pick another one, or "All organizations · create one".' },
        { kind: 'note', text: 'Artemis does not send invitation e-mails yet. Ask the person who invited you to let you know, then sign in (or register) with the invited address — the invitation appears right away. Invitations expire after 7 days.' },
        { kind: 'p', text: 'To leave an organization, open Settings → Danger zone and select "Leave this organization". The owner cannot leave; they must transfer ownership first (Team page) or delete the organization.' },
      ],
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      blocks: [
        { kind: 'p', text: 'The dashboard summarizes the security posture of every monitored repository.' },
        { kind: 'p', text: '"Export CSV" downloads every finding of the organization (all statuses) as a spreadsheet-ready CSV file with reference, type, severity, CVSS, status, repository, package or file, stage, tool and dates. Values that start with =, +, -, @ get a leading apostrophe so spreadsheet apps never run them as formulas.' },
        {
          kind: 'ul',
          items: [
            'Open findings: vulnerabilities with status Open or Triaged.',
            'Critical: open findings with a CVSS score of 9.0 or higher.',
            'Average CVSS: mean score of the open findings.',
            'Last scan: when the most recent pipeline finished.',
          ],
        },
        { kind: 'p', text: '"Findings by severity" breaks the open findings down by severity. "Recent vulnerabilities" lists the latest findings; select a CVE identifier to open its details, or "View all" to open the Vulnerabilities page.' },
        { kind: 'p', text: 'Severity is derived from the CVSS v3 base score:' },
        {
          kind: 'table',
          head: ['Severity', 'CVSS score'],
          rows: [
            ['Critical', '9.0 – 10.0'],
            ['High', '7.0 – 8.9'],
            ['Medium', '4.0 – 6.9'],
            ['Low', '0.1 – 3.9'],
          ],
        },
        { kind: 'p', text: 'Each finding has one of the following statuses:' },
        {
          kind: 'table',
          head: ['Status', 'Meaning'],
          rows: [
            ['Open', 'New finding that has not been reviewed yet.'],
            ['Triaged', 'Confirmed and waiting for a fix.'],
            ['False positive', 'Reviewed by your team and dismissed.'],
            ['Risk accepted', 'Confirmed, but the team decided not to fix it for now.'],
            ['Fixed', 'No longer detected in the latest scan.'],
          ],
        },
      ],
    },
    {
      id: 'new-project',
      title: 'Connecting a new project',
      blocks: [
        { kind: 'p', text: 'Select "New project" in the sidebar and complete the four steps:' },
        {
          kind: 'ol',
          items: [
            'Repository: enter the repository’s SSH URL (for example git@github.com:acme/project.git) and the branch to analyze. Artemis scans every repository — public or private — through a read-only deploy key it generates for it, which also proves you control the repository (see "Private repositories"). If it is a monorepo, turn on "This repository is a monorepo" and list the folders to scan (for example frontend and backend), choosing the stack of each one; the stack step then uses those choices.',
            'Settings: choose the scan schedule, automatic actions, build environment and AI triage (see "Scan settings").',
            'Pipeline: choose which security stages run (see "DevSecOps pipeline").',
            'Stack: select the technology used by the repository — React, Angular, Java + Spring, Python + Flask, Python + FastAPI or Python + Django. Automatic detection will be available soon.',
          ],
        },
        { kind: 'p', text: 'Select "Start monitoring" to finish. Every option chosen here can be changed later in the repository settings.' },
      ],
    },
    {
      id: 'scan-settings',
      title: 'Scan settings',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Re-run scans every: on every push, or every 6 hours, 24 hours or 7 days.',
            'Automatic actions on new CVE: open an issue in the repository, notify maintainers by e-mail and/or block merge requests that introduce new critical findings.',
            'Build environment: use the Dockerfile recommended by Artemis for the detected stack, or provide your own. A custom Dockerfile is audited before it is used.',
            'AI triage: automatic review of findings to flag likely false positives and generate reports. It will be part of the PRO plan and is not available yet — the option is shown locked and links to Billing.',
          ],
        },
      ],
    },
    {
      id: 'pipeline',
      title: 'DevSecOps pipeline',
      blocks: [
        { kind: 'p', text: 'The pipeline is the set of security checks that run on each execution. Stages are grouped into three phases that run in order:' },
        {
          kind: 'table',
          head: ['Phase', 'Stage', 'What it does', 'Tools'],
          rows: [
            ['Source', 'Secret scanning', 'Finds leaked credentials, tokens and keys in the code.', 'Gitleaks'],
            ['Source', 'Static analysis (SAST)', 'Finds insecure code patterns such as injection or XSS.', 'Semgrep CE (Artemis rules)'],
            ['Source', 'Dependency scanning (SCA)', 'Matches third-party libraries against known CVEs.', 'Trivy or Grype'],
            ['Source', 'License compliance', 'Flags dependencies with licenses not allowed by your policy.', 'Trivy'],
            ['Build', 'Dockerfile audit', 'Checks the Dockerfile for insecure instructions.', 'Hadolint or Trivy'],
            ['Build', 'Container image scan', 'Scans a published image (set under General settings, e.g. ghcr.io/acme/app:1.4) for vulnerable OS packages and libraries. Artemis pulls it from a public registry and never builds or runs it.', 'Trivy'],
            ['Build', 'SBOM generation', 'Produces a software bill of materials for each scan.', 'Syft'],
            ['Pre-deploy', 'Infrastructure as code', 'Checks Terraform, Kubernetes and Compose files for misconfigurations.', 'Trivy'],
            ['Pre-deploy', 'Dynamic analysis (DAST)', 'Tests a running instance of the application. Not available yet.', 'OWASP ZAP'],
          ],
        },
        { kind: 'p', text: 'For each stage you can:' },
        {
          kind: 'ul',
          items: [
            'Turn it on or off with the switch.',
            'Choose the tool that performs it when there is more than one (for example Trivy or Grype for dependency scanning).',
            'Choose when it fails the pipeline: never (report only), critical, high or above, medium or above, or any finding. SBOM generation only produces an artifact and never fails the pipeline.',
          ],
        },
        { kind: 'p', text: 'Presets enable a group of stages at once:' },
        {
          kind: 'table',
          head: ['Preset', 'Stages'],
          rows: [
            ['Essential', 'Secret scanning, SAST, SCA'],
            ['Recommended', 'Essential + Dockerfile audit, SBOM'],
            ['Complete', 'Every available stage, including the container image scan'],
          ],
        },
        { kind: 'p', text: 'Any manual change shows the preset as "Custom". The summary shows how many stages are enabled and an estimated duration. Under "Pipeline as code" you can view and copy the equivalent configuration for GitHub Actions or GitLab CI.' },
        { kind: 'note', text: 'Tip: start with "Recommended". Add DAST only when you have a staging environment the pipeline can reach.' },
      ],
    },
    {
      id: 'scanning',
      title: 'How scanning works',
      blocks: [
        { kind: 'p', text: 'Select "Run scan" on the Repositories page or in a repository’s settings to queue a scan. Run scan is available once the repository shows “Authenticated”, that is, after its deploy key was added and “Test access” succeeded in the Deploy Key tab. The new pipeline run opens so you can follow each stage.' },
        {
          kind: 'ol',
          items: [
            'The scanner clones the latest commit of the chosen branch over SSH with the repository’s deploy key (the key is deleted from the scanner right after cloning) into an isolated, temporary workspace. For a monorepo, "Run scan" first asks which folders to scan (all are selected by default); each stage scans the chosen folders one after the other and combines the results, and the run page lists the folders it scanned. Re-running a run scans the same folders; file paths in findings stay relative to the repository root.',
            'Each enabled stage runs its tool. DAST is not available yet and is skipped; the container image scan is skipped when no image is set.',
            'Each stage passes, warns (findings below the fail threshold) or fails (findings at or above it). A failed stage stops the pipeline: the remaining stages are skipped and the run fails.',
            'The code copy is deleted. Findings, short tool logs and the SBOM summary are kept.',
          ],
        },
        {
          kind: 'table',
          head: ['Finding type', 'Reported by', 'What you see'],
          rows: [
            ['Dependency', 'Trivy / Grype', 'CVE, CVSS score, installed and fixed versions.'],
            ['Secret', 'Gitleaks', 'Rule, file and line — never the secret value.'],
            ['Code', 'Semgrep CE', 'Rule, file, line and an explanation.'],
            ['Configuration', 'Hadolint / Trivy', 'Rule, file and line of the Dockerfile or infrastructure file.'],
            ['License', 'Trivy', 'Package and the license that conflicts with your policy.'],
          ],
        },
        { kind: 'p', text: 'Findings that are no longer reported by a later scan are marked as fixed automatically. Each run counts as one scan against your plan’s monthly limit.' },
        { kind: 'note', text: 'Scans run entirely on Artemis’s own infrastructure with open-source tools (see Third-party notices). Your code is never sent to third-party scanning services.' },
      ],
    },
    {
      id: 'repositories',
      title: 'Managing repositories',
      blocks: [
        { kind: 'p', text: 'The Repositories page lists every connected project with its stack, schedule, number of findings and last scan. "Run scan" starts a scan of a repository right away.' },
        { kind: 'note', text: 'While an organization has no repositories, Vulnerabilities, Repositories, Pipeline runs and Reports show a short explanation instead of empty tables: with a role that can manage pipelines you get a "Connect a repository" button; otherwise ask an owner, admin or security analyst of the organization to connect one.' },
        { kind: 'p', text: 'Select "Settings" on a repository to change its configuration at any time:' },
        {
          kind: 'ul',
          items: [
            'General tab: monorepo folders and their stacks, container image, scan schedule, automatic actions, build environment and AI triage.',
            'Pipeline tab: stages, tools, fail thresholds and presets.',
            'Deploy Key tab: for private repositories, the deploy key, setup steps, server identity and access test (see "Private repositories").',
          ],
        },
        { kind: 'p', text: 'Select "Save changes" to apply. Changes take effect from the next pipeline run; "Cancel" discards them.' },
        { kind: 'p', text: 'To stop monitoring a repository, open its General tab and use "Remove repository": type the repository name to confirm. Its findings, pipeline runs, reports, deploy keys and risk acceptances are deleted permanently; the repository itself is not touched. Removing requires a role that can manage pipelines.' },
      ],
    },
    {
      id: 'private-repositories',
      title: 'Private repositories',
      blocks: [
        { kind: 'p', text: 'To scan a private repository, add it with its SSH URL (for example git@github.com:acme/app.git). Artemis generates a read-only SSH deploy key just for that repository and opens its Deploy Key tab. The first scan waits until access works.' },
        {
          kind: 'ol',
          items: [
            'Copy the public key shown in the Deploy Key tab.',
            'Add it to the repository as a deploy key — GitHub: Settings → Deploy keys; GitLab: Settings → Repository → Deploy keys; Bitbucket: Repository settings → Access keys. Leave write access off.',
            'Select "Test access". Artemis checks that it can read the branch; the result appears in a few seconds.',
            'When access is OK, select "Run scan" to start the first scan.',
          ],
        },
        { kind: 'p', text: 'Server identity: Artemis only connects to a Git server whose host key it trusts. GitHub, GitLab and Bitbucket are verified against the keys they publish. For other servers the key is recorded the first time you test access and shown with its fingerprint — check that it matches your server; later connections must present the same key.' },
        { kind: 'p', text: '"Rotate key" generates a new key and deletes the old one immediately: add the new public key to the repository and remove the old one. Removing the repository deletes its key too.' },
        {
          kind: 'table',
          head: ['Test result', 'What to do'],
          rows: [
            ['Permission denied', 'The public key is not on the repository yet, or was added to another repository. Add it as a deploy key and test again.'],
            ['Repository or branch not found', 'Check the SSH URL and the branch name in the repository settings.'],
            ['Host key mismatch', 'The server presented a different key than the one recorded. If you changed servers on purpose, contact support; otherwise do not continue.'],
            ['Timeout or unreachable', 'The server must be reachable from the internet on its SSH port.'],
          ],
        },
        { kind: 'note', text: 'The private key never leaves Artemis: it is encrypted on our servers, is never shown or sent to you, and is only handed to the isolated scanner while it clones. Your code is deleted after every scan.' },
      ],
    },
    // --- vulnerabilities ---
    {
      id: 'vulnerabilities',
      title: 'Vulnerabilities',
      blocks: [
        { kind: 'p', text: 'The Vulnerabilities page lists every finding detected across your repositories, including fixed and dismissed ones.' },
        {
          kind: 'ul',
          items: [
            'Search by CVE identifier, package name or title.',
            'Filter by type (dependency, secret, code, configuration, license), severity, status and repository, and sort by CVSS score or detection date. "Clear filters" resets the list.',
            'Select a finding to open its details. Dependency findings show the CVE; the other types show the rule and the file and line where it was found. Secret values are never shown.',
          ],
        },
        { kind: 'p', text: 'The details page shows:' },
        {
          kind: 'ul',
          items: [
            'Description from the NIST NVD and the weakness type (CWE).',
            'CVSS v3.1 vector and a readable breakdown of each metric. Metrics highlighted in red make the vulnerability easier to exploit or more damaging.',
            'Remediation: the installed version, the first fixed version and a suggested upgrade command you can copy. When no fix exists, consider replacing or isolating the package.',
            'Affected repositories, with the pipeline stage and tool that detected the issue in each one.',
            'AI triage: shown locked — automatic review of findings is not available yet.',
            'References (NVD, package registry, CWE) and a timeline of what happened to the finding.',
          ],
        },
        { kind: 'p', text: 'Use "Change status" to mark the finding as triaged, as a false positive, to accept the risk or to reopen it. The change applies to every affected repository, is saved immediately and is recorded in the timeline. A finding that is a false positive, accepted or fixed can only be reopened. "Fixed" is set automatically when a scan no longer detects the issue.' },
        { kind: 'note', text: 'Accept a risk only when the vulnerable code is not reachable or a compensating control is in place, and record the reason with your team.' },
      ],
    },

    // --- pipeline runs ---
    {
      id: 'pipeline-runs',
      title: 'Pipeline runs',
      blocks: [
        { kind: 'p', text: 'Pipeline runs lists every execution of your DevSecOps pipelines, newest first. The summary at the top shows how many runs happened in the last 7 days, the success rate of finished runs, the average duration and how many runs were stopped by a policy.' },
        { kind: 'p', text: 'Filter the list by repository, status or branch name. Select a run number to open its details.' },
        {
          kind: 'table',
          head: ['Run status', 'Meaning'],
          rows: [
            ['Success', 'All stages finished without breaking a policy. Findings below the fail threshold may still be reported.'],
            ['Failed', 'A stage found issues at or above its fail threshold, or the stage itself could not complete. Later stages are skipped.'],
            ['Running', 'The pipeline is executing right now.'],
            ['Queued', 'The run is waiting for a free runner.'],
            ['Cancelled', 'Someone stopped the run before it finished.'],
          ],
        },
        { kind: 'p', text: 'The run details page shows the repository, branch, commit, what triggered the run (push, schedule, manual or merge request) and who triggered it. Below, stages are grouped by phase, each with its tool, status, duration and number of findings:' },
        {
          kind: 'table',
          head: ['Stage status', 'Meaning'],
          rows: [
            ['Passed', 'No findings.'],
            ['Passed with warnings', 'Findings were reported, but none reached the fail threshold.'],
            ['Failed', 'Findings reached the fail threshold; the policy that failed it is shown under the stage.'],
            ['Running / Pending', 'The stage is executing or waiting for earlier stages.'],
            ['Skipped', 'The stage did not run because an earlier stage failed or the run was cancelled.'],
          ],
        },
        { kind: 'p', text: 'While a run is queued or running, its page updates by itself: a progress panel shows which step is running (for example "Step 3 of 7 — Dependency scanning"), the current stage is highlighted with a spinner and finished stages fill in as they complete. The Pipeline runs list also refreshes while any run is in progress.' },
        { kind: 'p', text: 'Select "View log" on a stage to read the tool output; logs of failed stages open automatically. Select the number of findings to go to Vulnerabilities. Use "Re-run" to start the pipeline again or "Cancel run" to stop a queued or running pipeline.' },
        { kind: 'p', text: '"Re-run" creates a new run of the same commit, triggered manually by you, using the repository\'s current pipeline settings — so it includes any stage you enabled or disabled since the original run — and opens it. Cancelling marks the stages that had not finished as skipped. Only queued or running pipelines can be cancelled.' },
      ],
    },

    // --- reports + policies ---
    {
      id: 'reports',
      title: 'Reports',
      blocks: [
        { kind: 'p', text: 'The Reports page lists every report generated for your organization or for a single repository. There are two types:' },
        {
          kind: 'table',
          head: ['Type', 'Contents'],
          rows: [
            ['Security summary', 'Weekly or monthly overview of new, fixed and open findings. Generated automatically by schedule.'],
            ['Compliance', 'Findings mapped to the OWASP Top 10 categories, useful for audits.'],
          ],
        },
        { kind: 'p', text: 'To request a report on demand, select "Generate report", choose the type, the scope (the whole organization or one repository) and the period (the last complete week, month or quarter), then select "Generate". The report appears in the list with status "Generating" and can be opened once it is "Ready". AI triage reports are not available yet.' },
        { kind: 'p', text: 'A report contains:' },
        {
          kind: 'ul',
          items: [
            'Executive summary: a short, non-technical overview for managers.',
            'Key indicators: new, fixed and still open findings, mean time to remediate and the percentage of findings fixed within the SLA.',
            'Findings trend: new and fixed findings per week. Hover over (or focus and use the arrow keys on) the chart to see each week; "Show data table" lists the same values.',
            'Open findings by severity, top risks, OWASP Top 10 mapping and recommendations. The AI triage section is shown locked until AI triage becomes available.',
          ],
        },
        { kind: 'p', text: 'Report texts follow the language selected in the top bar. Select "Export PDF" to print or save the report as PDF, or "Copy link" to share it with someone who has access to Artemis.' },
      ],
    },

    {
      id: 'policies',
      title: 'Policies',
      blocks: [
        { kind: 'p', text: 'Policies are organization-wide rules applied to every repository. Only administrators should change them.' },
        {
          kind: 'ul',
          items: [
            'Pipeline gates: the default fail threshold of each pipeline stage. Mark a stage as "Required" to prevent repositories from disabling it.',
            'Remediation SLA: the maximum number of days (1 to 365) to fix a finding of each severity. Reports measure SLA compliance against these values.',
            'License policy: licenses that are allowed or denied. Type an SPDX license identifier (for example MPL-2.0) and select "Add"; use the X on a license to remove it. A license cannot be both allowed and denied. Licenses not listed are reported for review.',
            'Risk acceptances: findings accepted as known risks, with a justification and an expiry date. They do not fail pipelines until they expire (at most one year). Select "Revoke" to remove one immediately.',
          ],
        },
        { kind: 'p', text: 'Select "Save changes" to apply. Changes take effect from the next pipeline run; "Cancel" discards your edits and reloads the saved policies.' },
      ],
    },

    // --- integrations + team + settings ---
    {
      id: 'integrations',
      title: 'Integrations',
      blocks: [
        { kind: 'p', text: 'The Integrations page connects Artemis to the tools your team already uses. Integrations are grouped by category: source control, CI/CD, notifications, issue tracking and vulnerability data.' },
        {
          kind: 'ul',
          items: [
            'Connected (green): the integration is active. Use "Configure" to set the account, channel or project it uses, or "Disconnect" to remove it.',
            'Not connected: select "Connect" to authorize Artemis in the external tool.',
            'Connection error (red): the credentials expired or were revoked. Select "Reconnect" to authorize again.',
          ],
        },
        { kind: 'p', text: 'The NIST NVD integration is always active and cannot be disconnected: it provides CVE records and CVSS scores. Its card shows the last synchronization.' },
        { kind: 'p', text: 'Under "SSH deploy keys" you can see every key Artemis generated to clone private repositories, with its fingerprint, repository and last use. Keys are created and rotated in each repository’s Deploy Key tab; select the repository to open it. "Revoke" deletes a key (scans of that repository fail until a new key is generated) — also remove it from the repository on your Git provider.' },
        { kind: 'note', text: 'Keys marked "Public key only" were added before Artemis generated keys. Artemis has no private key for them, so they are never used to clone; generate a key in the repository’s Deploy Key tab instead.' },
      ],
    },
    {
      id: 'team',
      title: 'Team and roles',
      blocks: [
        { kind: 'p', text: 'The Team page lists every member of the organization with their role, last activity and status. Owners and admins change a member\'s role by picking a new one in the Role column. Nobody can change their own role, and the owner role is never assigned there: the owner selects "Make owner" next to an active member to transfer ownership, becoming an admin.' },
        { kind: 'p', text: 'Owners and admins can change a member’s role at any time with the role picker in the member list, or remove the member with “Remove”. Only the owner manages admins: admins can change and remove analysts, developers and viewers, but cannot promote anyone to admin, change another admin’s role or remove an admin. There is always exactly one owner; to hand the organization over, the owner uses “Make owner” and becomes an admin. Nobody can change their own role or remove themselves (use “Leave organization” in Settings).' },
        { kind: 'p', text: 'To add someone, select "Invite member", enter their e-mail and choose a role. An address that already belongs to a member or has a pending invitation is rejected. The invited person sees the invitation on the Organizations page after signing in or registering with that e-mail address (Artemis does not send invitation e-mails yet). Invitations expire after 7 days; "Resend" renews them and "Revoke" cancels them.' },
        {
          kind: 'table',
          head: ['Role', 'Intended for'],
          rows: [
            ['Owner', 'Full access, including billing. One per organization.'],
            ['Admin', 'Manages repositories, pipelines, integrations and the team.'],
            ['Security analyst', 'Triages findings and configures pipelines.'],
            ['Developer', 'Views and triages findings in their repositories.'],
            ['Viewer', 'Read-only access to findings and reports.'],
          ],
        },
        { kind: 'p', text: 'The "Roles and permissions" table at the bottom of the page shows exactly what each role can do. Artemis enforces it on every request:' },
        {
          kind: 'table',
          head: ['Permission', 'What it allows', 'Roles'],
          rows: [
            ['View findings and reports', 'See every page of the organization', 'All roles'],
            ['Triage findings', 'Change finding status, manage risk acceptances, generate reports', 'Owner, Admin, Security analyst, Developer'],
            ['Configure pipelines', 'Add repositories, run and cancel scans, test repository access, edit repository settings, pipelines and policies', 'Owner, Admin, Security analyst'],
            ['Manage integrations', 'Integrations, generating, rotating and revoking deploy keys, API tokens', 'Owner, Admin'],
            ['Manage team', 'Invitations, roles and organization settings', 'Owner, Admin'],
            ['Manage billing', 'Change the plan, transfer ownership, delete the organization', 'Owner'],
          ],
        },
        { kind: 'p', text: 'When your role does not allow something, the controls are shown disabled with a lock and a short explanation instead of being hidden. Ask an owner or admin if you need more access.' },
      ],
    },
    {
      id: 'settings',
      title: 'Organization settings',
      blocks: [
        { kind: 'p', text: 'Settings in the sidebar holds options that apply to the whole organization, organized in tabs:' },
        {
          kind: 'ul',
          items: [
            'General: organization name, URL slug, default language and time zone. Each member can still choose their own language in the top bar.',
            'Authentication: the OpenID Connect identity provider (Keycloak), issuer URL (must use https), client ID and session timeout. The client secret is never stored or displayed in Artemis: it is managed by your administrators in the deployment secrets, and the page only shows whether it is configured. Turn on "Enforce single sign-on" so members can only sign in through the identity provider.',
            'Notifications: choose which events (new critical CVE, pipeline failed, weekly report, SLA breached) are sent to each channel (e-mail, Slack, Microsoft Teams).',
            'API tokens: tokens let scripts and CI jobs call the Artemis API. Select "Create token", give it a name, an expiration and scopes. The token is shown only once: copy it before selecting "Done". Afterwards the list only shows its prefix and last four characters. Revoke tokens you no longer use.',
            'Data retention: how long findings history, pipeline logs and reports are kept. Older data is deleted permanently.',
            'Danger zone: members other than the owner can leave the organization. The owner can delete it by typing its name exactly — this permanently deletes all its repositories, findings, pipeline runs, reports, policies, integrations, tokens and memberships, and cannot be undone.',
          ],
        },
        { kind: 'p', text: 'On the General, Authentication, Notifications and Data retention tabs, select "Save changes" to apply. API tokens and the danger zone take effect immediately. Only owners and admins can change settings (API tokens: the "Manage integrations" permission); other roles see them read-only.' },
        { kind: 'note', text: 'Tip: give API tokens only the scopes they need and the shortest practical expiration.' },
      ],
    },

    {
      id: 'billing',
      title: 'Billing and plans',
      blocks: [
        { kind: 'p', text: 'Configuration → Billing shows your organization’s current plan and compares the available plans.' },
        {
          kind: 'table',
          head: ['Plan', 'Price', 'Includes'],
          rows: [
            ['Free', 'R$ 0', '90 scans per month. Scanning (secrets, SAST, dependencies, containers), DevSecOps pipeline and policies, dashboard, findings, reports, team, integrations and API tokens.'],
            ['PRO', 'R$ 24,99 per month', '300 scans per month. Everything in Free plus AI triage of findings and AI-generated triage reports.'],
          ],
        },
        { kind: 'p', text: 'Each pipeline run counts as one scan. The usage for the current month (UTC) appears at the bottom of the sidebar and on the Billing page; when the limit is reached, new runs (such as re-runs) are refused until the next month. Plans are also shown in the Pricing section of the home page.' },
        { kind: 'note', text: 'Billing is not enabled yet: every organization is on the Free plan and the upgrade button is locked. Nothing is ever charged without your explicit agreement.' },
      ],
    },
    {
      id: 'glossary',
      title: 'Glossary',
      blocks: [
        {
          kind: 'table',
          head: ['Term', 'Definition'],
          rows: [
            ['CVE', 'Common Vulnerabilities and Exposures: a public identifier for a known vulnerability.'],
            ['CVSS', 'Common Vulnerability Scoring System: a 0–10 score for how severe a vulnerability is.'],
            ['NVD', 'National Vulnerability Database, maintained by NIST; the source of CVE and CVSS data.'],
            ['SAST', 'Static Application Security Testing: analysis of source code without running it.'],
            ['SCA', 'Software Composition Analysis: analysis of third-party dependencies.'],
            ['DAST', 'Dynamic Application Security Testing: testing a running application.'],
            ['SBOM', 'Software Bill of Materials: the inventory of components in a build.'],
            ['IaC', 'Infrastructure as Code: infrastructure defined in files such as Terraform.'],
            ['OIDC', 'OpenID Connect: the single sign-on protocol used to authenticate.'],
          ],
        },
      ],
    },
  ],
  'pt-BR': [
    {
      id: 'getting-started',
      title: 'Primeiros passos',
      blocks: [
        { kind: 'p', text: 'O Artemis é uma plataforma de testes de segurança de aplicações. Ele se conecta aos seus repositórios Git, executa neles um pipeline DevSecOps configurável e reporta vulnerabilidades pontuadas com CVSS, usando a National Vulnerability Database do NIST como fonte.' },
        { kind: 'p', text: 'A página inicial apresenta o produto, como ele funciona e respostas a dúvidas comuns. Selecione "Começar" para criar uma conta ou "Entrar" se você já tiver uma. Este guia também está disponível sem login, em "Documentação" na página inicial. A Política de Privacidade e os Termos de Uso estão no rodapé da página inicial e da tela de login: o Artemis nunca vende nem compartilha informações sobre você ou sua organização.' },
        { kind: 'p', text: 'Para criar uma conta, selecione "Começar" na página inicial ou "Criar uma conta" na tela de login. O formulário de cadastro (fornecido pelo Keycloak, o serviço de identidade do Artemis) pede nome, e-mail e uma senha de pelo menos 12 caracteres, e pede que você aceite os Termos de Uso e a Política de Privacidade. Depois você cria uma organização ou entra em uma para a qual foi convidado (veja "Organizações e convites").' },
        { kind: 'p', text: 'Para entrar, selecione "Entrar" e informe seu usuário ou e-mail e a senha; você voltará para a página que tentava abrir. Se esqueceu a senha, use "Esqueceu sua senha?" na página de login. A autenticação usa OpenID Connect; o próprio Artemis nunca vê nem armazena sua senha. Várias tentativas erradas bloqueiam a conta temporariamente para protegê-la.' },
        { kind: 'p', text: 'Seu nome aparece na barra superior enquanto você estiver conectado, ao lado do seu papel na organização atual; selecione o nome para abrir sua conta no serviço de identidade (perfil, senha, verificação em duas etapas, dispositivos conectados e exclusão da conta). A sessão é compartilhada por todas as abas do navegador, e a página inicial mostra você conectado com o botão "Ir para o painel", além da seção "Seu espaço de trabalho" com as suas organizações e convites pendentes. Se a sessão expirar, será pedido um novo login. "Sair" encerra a sua sessão no Artemis e no serviço de identidade.' },
        { kind: 'p', text: 'A interface está organizada assim:' },
        {
          kind: 'ul',
          items: [
            'Barra lateral: navegação agrupada em Visão geral, Segurança e Configuração. Os indicadores mostram a quantidade de vulnerabilidades abertas e de repositórios conectados.',
            'Botão Novo projeto: inicia o fluxo para conectar um novo repositório.',
            'Rodapé da barra lateral: análises usadas no mês em relação ao limite do plano, esta página de ajuda e a organização atual. Selecione a organização para trocar por outra ou abrir "Todas as organizações".',
            'Barra superior: seletor de idioma (inglês ou português), alternância entre tema claro e escuro e sair. Idioma e tema ficam salvos no seu navegador.',
            'Endereços: todas as páginas ficam sob a sua organização, por exemplo /acme/vulnerabilities. Links compartilhados levam seus colegas à mesma página.',
          ],
        },
        { kind: 'p', text: 'O Artemis se adapta à sua tela. Em notebooks com telas menores a barra lateral mostra apenas ícones; aponte o mouse para ela (ou mova o foco do teclado até ela) e ela se expande mostrando todos os nomes. Em tablets e celulares a barra lateral fica oculta: abra-a pelo botão de menu no canto superior esquerdo e feche pelo botão X, pela tecla Esc ou tocando fora dela.' },
      ],
    },
    {
      id: 'organizations',
      title: 'Organizações e convites',
      blocks: [
        { kind: 'p', text: 'Tudo no Artemis — repositórios, achados, pipelines, relatórios, políticas, integrações, equipe, configurações e plano — pertence a uma organização. Você pode ser membro de várias organizações, com um papel diferente em cada uma, e os dados delas ficam totalmente separados.' },
        { kind: 'p', text: 'Depois do login você vai direto para a sua organização se tiver apenas uma; caso contrário abre a página Organizações (/organizations). Ela mostra:' },
        {
          kind: 'ul',
          items: [
            'Suas organizações: nome, endereço, seu papel e o plano. Selecione uma para abrir o painel dela.',
            'Convites pendentes: convites enviados ao e-mail da sua conta, com o papel oferecido e a data de expiração. Selecione "Aceitar" para entrar (você vai para o painel dela) ou "Recusar" para descartá-lo.',
            'Criar organização: informe um nome e, se quiser, edite o nome na URL (3 a 40 letras minúsculas, números e hifens, usado em todos os links, como /acme/dashboard). Você será o proprietário e a organização começa no plano Free. Cada pessoa pode ser proprietária de até 5 organizações; alguns nomes de URL são reservados.',
          ],
        },
        { kind: 'p', text: 'Para trocar de organização a qualquer momento, selecione a organização no rodapé da barra lateral e escolha outra, ou "Todas as organizações · criar uma".' },
        { kind: 'note', text: 'O Artemis ainda não envia e-mails de convite. Peça a quem convidou que avise você e então entre (ou cadastre-se) com o e-mail convidado — o convite aparece na hora. Convites expiram em 7 dias.' },
        { kind: 'p', text: 'Para sair de uma organização, abra Configurações → Zona de perigo e selecione "Sair desta organização". O proprietário não pode sair; antes ele precisa transferir a propriedade (página Equipe) ou excluir a organização.' },
      ],
    },
    {
      id: 'dashboard',
      title: 'Painel',
      blocks: [
        { kind: 'p', text: 'O painel resume a postura de segurança de todos os repositórios monitorados.' },
        { kind: 'p', text: '"Exportar CSV" baixa todos os achados da organização (todos os status) em um arquivo CSV pronto para planilhas, com referência, tipo, severidade, CVSS, status, repositório, pacote ou arquivo, etapa, ferramenta e datas. Valores que começam com =, +, -, @ recebem um apóstrofo no início para que as planilhas nunca os executem como fórmulas.' },
        {
          kind: 'ul',
          items: [
            'Achados abertos: vulnerabilidades com status Aberto ou Triado.',
            'Críticos: achados abertos com pontuação CVSS 9.0 ou superior.',
            'CVSS médio: média das pontuações dos achados abertos.',
            'Última análise: quando o pipeline mais recente terminou.',
          ],
        },
        { kind: 'p', text: '"Achados por severidade" divide os achados abertos por severidade. "Vulnerabilidades recentes" lista os achados mais novos; selecione o identificador de uma CVE para abrir seus detalhes, ou "Ver todas" para abrir a página Vulnerabilidades.' },
        { kind: 'p', text: 'A severidade é derivada da pontuação base do CVSS v3:' },
        {
          kind: 'table',
          head: ['Severidade', 'Pontuação CVSS'],
          rows: [
            ['Crítica', '9.0 – 10.0'],
            ['Alta', '7.0 – 8.9'],
            ['Média', '4.0 – 6.9'],
            ['Baixa', '0.1 – 3.9'],
          ],
        },
        { kind: 'p', text: 'Cada achado tem um dos seguintes status:' },
        {
          kind: 'table',
          head: ['Status', 'Significado'],
          rows: [
            ['Aberto', 'Achado novo que ainda não foi revisado.'],
            ['Triado', 'Confirmado e aguardando correção.'],
            ['Falso positivo', 'Revisado pela sua equipe e descartado.'],
            ['Risco aceito', 'Confirmado, mas a equipe decidiu não corrigir por enquanto.'],
            ['Corrigido', 'Não foi mais detectado na última análise.'],
          ],
        },
      ],
    },
    {
      id: 'new-project',
      title: 'Conectando um novo projeto',
      blocks: [
        { kind: 'p', text: 'Selecione "Novo projeto" na barra lateral e conclua os quatro passos:' },
        {
          kind: 'ol',
          items: [
            'Repositório: informe a URL SSH do repositório (por exemplo git@github.com:acme/projeto.git) e a branch a ser analisada. O Artemis analisa todo repositório — público ou privado — por meio de uma deploy key somente leitura que ele gera, o que também comprova que você controla o repositório (veja "Repositórios privados"). Se for um monorepo, ative "Este repositório é um monorepo" e liste as pastas a analisar (por exemplo frontend e backend), escolhendo a stack de cada uma; a etapa de stack passa a usar essas escolhas.',
            'Configurações: escolha o agendamento, as ações automáticas, o ambiente de build e a triagem com IA (veja "Configurações da análise").',
            'Pipeline: escolha quais etapas de segurança serão executadas (veja "Pipeline DevSecOps").',
            'Stack: selecione a tecnologia usada pelo repositório — React, Angular, Java + Spring, Python + Flask, Python + FastAPI ou Python + Django. A detecção automática estará disponível em breve.',
          ],
        },
        { kind: 'p', text: 'Selecione "Iniciar monitoramento" para concluir. Todas as opções escolhidas aqui podem ser alteradas depois nas configurações do repositório.' },
      ],
    },
    {
      id: 'scan-settings',
      title: 'Configurações da análise',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Reexecutar análises a cada: a cada push, ou a cada 6 horas, 24 horas ou 7 dias.',
            'Ações automáticas para novas CVEs: abrir uma issue no repositório, notificar mantenedores por e-mail e/ou bloquear merge requests que introduzam novos achados críticos.',
            'Ambiente de build: use o Dockerfile recomendado pelo Artemis para a stack detectada ou forneça o seu. Um Dockerfile próprio é auditado antes do uso.',
            'Triagem com IA: revisão automática dos achados para sinalizar prováveis falsos positivos e gerar relatórios. Fará parte do plano PRO e ainda não está disponível — a opção aparece bloqueada e leva à página de Assinatura.',
          ],
        },
      ],
    },
    {
      id: 'pipeline',
      title: 'Pipeline DevSecOps',
      blocks: [
        { kind: 'p', text: 'O pipeline é o conjunto de verificações de segurança executadas a cada execução. As etapas são agrupadas em três fases, executadas em ordem:' },
        {
          kind: 'table',
          head: ['Fase', 'Etapa', 'O que faz', 'Ferramentas'],
          rows: [
            ['Código-fonte', 'Varredura de segredos', 'Encontra credenciais, tokens e chaves vazados no código.', 'Gitleaks'],
            ['Código-fonte', 'Análise estática (SAST)', 'Encontra padrões de código inseguros, como injeção ou XSS.', 'Semgrep CE (regras do Artemis)'],
            ['Código-fonte', 'Análise de dependências (SCA)', 'Compara bibliotecas de terceiros com CVEs conhecidas.', 'Trivy ou Grype'],
            ['Código-fonte', 'Conformidade de licenças', 'Sinaliza dependências com licenças não permitidas pela sua política.', 'Trivy'],
            ['Build', 'Auditoria do Dockerfile', 'Verifica o Dockerfile em busca de instruções inseguras.', 'Hadolint ou Trivy'],
            ['Build', 'Varredura da imagem de contêiner', 'Analisa uma imagem publicada (definida nas configurações gerais, por exemplo ghcr.io/acme/app:1.4) em busca de pacotes do SO e bibliotecas vulneráveis. O Artemis a baixa de um registry público e nunca a constrói nem a executa.', 'Trivy'],
            ['Build', 'Geração de SBOM', 'Gera uma lista de materiais de software a cada análise.', 'Syft'],
            ['Pré-deploy', 'Infraestrutura como código', 'Verifica arquivos Terraform, Kubernetes e Compose em busca de erros de configuração.', 'Trivy'],
            ['Pré-deploy', 'Análise dinâmica (DAST)', 'Testa uma instância da aplicação em execução. Ainda não disponível.', 'OWASP ZAP'],
          ],
        },
        { kind: 'p', text: 'Para cada etapa você pode:' },
        {
          kind: 'ul',
          items: [
            'Ativá-la ou desativá-la pelo botão.',
            'Escolher a ferramenta que a executa quando houver mais de uma (por exemplo Trivy ou Grype para análise de dependências).',
            'Escolher quando ela falha o pipeline: nunca (apenas relatório), crítica, alta ou superior, média ou superior, ou qualquer achado. A geração de SBOM apenas produz um artefato e nunca falha o pipeline.',
          ],
        },
        { kind: 'p', text: 'Os modelos ativam um grupo de etapas de uma vez:' },
        {
          kind: 'table',
          head: ['Modelo', 'Etapas'],
          rows: [
            ['Essencial', 'Varredura de segredos, SAST, SCA'],
            ['Recomendado', 'Essencial + auditoria do Dockerfile, SBOM'],
            ['Completo', 'Todas as etapas disponíveis, incluindo a varredura de imagem de contêiner'],
          ],
        },
        { kind: 'p', text: 'Qualquer alteração manual mostra o modelo como "Personalizado". O resumo mostra quantas etapas estão ativas e uma duração estimada. Em "Pipeline como código" você pode ver e copiar a configuração equivalente para GitHub Actions ou GitLab CI.' },
        { kind: 'note', text: 'Dica: comece pelo modelo "Recomendado". Ative o DAST apenas quando houver um ambiente de homologação acessível pelo pipeline.' },
      ],
    },
    {
      id: 'scanning',
      title: 'Como funcionam as análises',
      blocks: [
        { kind: 'p', text: 'Selecione "Executar análise" na página Repositórios ou nas configurações de um repositório para enfileirar uma análise. “Executar análise” fica disponível quando o repositório aparece como “Autenticado”, ou seja, depois que a deploy key foi adicionada e o “Testar acesso” deu certo na aba Deploy Key. A nova execução de pipeline é aberta para você acompanhar cada etapa.' },
        {
          kind: 'ol',
          items: [
            'O scanner clona o último commit da branch escolhida via SSH com a deploy key do repositório (a chave é apagada do scanner logo após o clone) em um espaço de trabalho isolado e temporário. Em um monorepo, "Executar análise" primeiro pergunta quais pastas analisar (todas vêm selecionadas); cada etapa analisa as pastas escolhidas uma após a outra e junta os resultados, e a página da execução lista as pastas analisadas. Executar novamente analisa as mesmas pastas; os caminhos de arquivo nos achados continuam relativos à raiz do repositório.',
            'Cada etapa ativa executa sua ferramenta. O DAST ainda não está disponível e é pulado; a varredura de imagem é pulada quando nenhuma imagem está definida.',
            'Cada etapa passa, gera alerta (achados abaixo do critério de falha) ou falha (achados no critério ou acima). Uma etapa com falha interrompe o pipeline: as etapas seguintes são ignoradas e a execução falha.',
            'A cópia do código é apagada. Ficam os achados, logs curtos das ferramentas e o resumo do SBOM.',
          ],
        },
        {
          kind: 'table',
          head: ['Tipo de achado', 'Reportado por', 'O que você vê'],
          rows: [
            ['Dependência', 'Trivy / Grype', 'CVE, pontuação CVSS, versão instalada e corrigida.'],
            ['Segredo', 'Gitleaks', 'Regra, arquivo e linha — nunca o valor do segredo.'],
            ['Código', 'Semgrep CE', 'Regra, arquivo, linha e uma explicação.'],
            ['Configuração', 'Hadolint / Trivy', 'Regra, arquivo e linha do Dockerfile ou do arquivo de infraestrutura.'],
            ['Licença', 'Trivy', 'Pacote e a licença que conflita com a sua política.'],
          ],
        },
        { kind: 'p', text: 'Achados que não aparecem mais em uma análise posterior são marcados como corrigidos automaticamente. Cada execução conta como uma análise no limite mensal do seu plano.' },
        { kind: 'note', text: 'As análises rodam inteiramente na infraestrutura do Artemis com ferramentas de código aberto (veja Avisos de terceiros). Seu código nunca é enviado a serviços de análise de terceiros.' },
      ],
    },
    {
      id: 'repositories',
      title: 'Gerenciando repositórios',
      blocks: [
        { kind: 'p', text: 'A página Repositórios lista todos os projetos conectados com stack, agendamento, quantidade de achados e última análise. "Executar análise" inicia uma análise do repositório na hora.' },
        { kind: 'note', text: 'Enquanto uma organização não tiver repositórios, Vulnerabilidades, Repositórios, Execuções de pipeline e Relatórios mostram uma breve explicação em vez de tabelas vazias: com um papel que pode gerenciar pipelines, aparece o botão "Conectar um repositório"; caso contrário, peça a um proprietário, administrador ou analista de segurança da organização para conectar um.' },
        { kind: 'p', text: 'Selecione "Configurações" em um repositório para alterar sua configuração a qualquer momento:' },
        {
          kind: 'ul',
          items: [
            'Aba Geral: pastas do monorepo e suas stacks, imagem de contêiner, agendamento, ações automáticas, ambiente de build e triagem com IA.',
            'Aba Pipeline: etapas, ferramentas, critérios de falha e modelos.',
            'Aba Acesso: para repositórios privados, a deploy key, os passos de configuração, a identidade do servidor e o teste de acesso (veja "Repositórios privados").',
          ],
        },
        { kind: 'p', text: 'Selecione "Salvar alterações" para aplicar. As alterações valem a partir da próxima execução do pipeline; "Cancelar" as descarta.' },
        { kind: 'p', text: 'Para parar de monitorar um repositório, abra a aba Geral e use "Remover repositório": digite o nome do repositório para confirmar. Os achados, execuções de pipeline, relatórios, deploy keys e aceites de risco dele são apagados definitivamente; o repositório em si não é alterado. Remover exige um papel que possa gerenciar pipelines.' },
      ],
    },
    {
      id: 'private-repositories',
      title: 'Repositórios privados',
      blocks: [
        { kind: 'p', text: 'Para analisar um repositório privado, adicione-o com a URL SSH (por exemplo git@github.com:acme/app.git). O Artemis gera uma deploy key SSH somente leitura só para esse repositório e abre a aba Deploy Key. A primeira análise espera até o acesso funcionar.' },
        {
          kind: 'ol',
          items: [
            'Copie a chave pública exibida na aba Deploy Key.',
            'Adicione-a ao repositório como deploy key — GitHub: Settings → Deploy keys; GitLab: Settings → Repository → Deploy keys; Bitbucket: Repository settings → Access keys. Deixe o acesso de escrita desativado.',
            'Selecione "Testar acesso". O Artemis confere se consegue ler a branch; o resultado aparece em alguns segundos.',
            'Com o acesso OK, selecione "Executar análise" para iniciar a primeira análise.',
          ],
        },
        { kind: 'p', text: 'Identidade do servidor: o Artemis só se conecta a um servidor Git cuja chave de host ele confia. GitHub, GitLab e Bitbucket são verificados com as chaves que eles publicam. Para outros servidores, a chave é registrada na primeira vez que você testa o acesso e exibida com a impressão digital — confira se ela corresponde ao seu servidor; as conexões seguintes precisam apresentar a mesma chave.' },
        { kind: 'p', text: '"Trocar chave" gera uma nova chave e apaga a antiga na hora: adicione a nova chave pública ao repositório e remova a antiga. Remover o repositório também apaga a chave dele.' },
        {
          kind: 'table',
          head: ['Resultado do teste', 'O que fazer'],
          rows: [
            ['Permissão negada', 'A chave pública ainda não está no repositório ou foi adicionada a outro repositório. Adicione-a como deploy key e teste de novo.'],
            ['Repositório ou branch não encontrado', 'Confira a URL SSH e o nome da branch nas configurações do repositório.'],
            ['Chave de host diferente', 'O servidor apresentou uma chave diferente da registrada. Se você trocou de servidor de propósito, fale com o suporte; caso contrário, não continue.'],
            ['Tempo esgotado ou inacessível', 'O servidor precisa estar acessível pela internet na porta SSH.'],
          ],
        },
        { kind: 'note', text: 'A chave privada nunca sai do Artemis: ela fica criptografada nos nossos servidores, nunca é exibida nem enviada a você e só é entregue ao scanner isolado durante o clone. Seu código é apagado após cada análise.' },
      ],
    },
    // --- vulnerabilities ---
    {
      id: 'vulnerabilities',
      title: 'Vulnerabilidades',
      blocks: [
        { kind: 'p', text: 'A página Vulnerabilidades lista todos os achados detectados nos seus repositórios, incluindo os corrigidos e descartados.' },
        {
          kind: 'ul',
          items: [
            'Busque pelo identificador da CVE, nome do pacote ou título.',
            'Filtre por tipo (dependência, segredo, código, configuração, licença), severidade, status e repositório, e ordene pela pontuação CVSS ou pela data de detecção. "Limpar filtros" restaura a lista.',
            'Selecione um achado para abrir seus detalhes. Achados de dependências mostram a CVE; os demais tipos mostram a regra e o arquivo e linha onde foram encontrados. Valores de segredos nunca são exibidos.',
          ],
        },
        { kind: 'p', text: 'A página de detalhes mostra:' },
        {
          kind: 'ul',
          items: [
            'Descrição do NIST NVD e o tipo de fraqueza (CWE).',
            'Vetor CVSS v3.1 e uma explicação de cada métrica. Métricas destacadas em vermelho tornam a vulnerabilidade mais fácil de explorar ou mais danosa.',
            'Correção: a versão instalada, a primeira versão corrigida e um comando de atualização sugerido que pode ser copiado. Quando não há correção, considere substituir ou isolar o pacote.',
            'Repositórios afetados, com a etapa do pipeline e a ferramenta que detectou o problema em cada um.',
            'Triagem com IA: aparece bloqueada — a revisão automática dos achados ainda não está disponível.',
            'Referências (NVD, registro do pacote, CWE) e uma linha do tempo do que aconteceu com o achado.',
          ],
        },
        { kind: 'p', text: 'Use "Alterar status" para marcar o achado como triado, como falso positivo, aceitar o risco ou reabri-lo. A alteração vale para todos os repositórios afetados, é salva imediatamente e registrada na linha do tempo. Um achado marcado como falso positivo, com risco aceito ou corrigido só pode ser reaberto. "Corrigido" é definido automaticamente quando uma análise não detecta mais o problema.' },
        { kind: 'note', text: 'Aceite um risco apenas quando o código vulnerável não for alcançável ou houver um controle compensatório, e registre o motivo com a sua equipe.' },
      ],
    },

    // --- pipeline runs ---
    {
      id: 'pipeline-runs',
      title: 'Execuções de pipeline',
      blocks: [
        { kind: 'p', text: 'Execuções de pipeline lista todas as execuções dos seus pipelines DevSecOps, das mais recentes para as mais antigas. O resumo no topo mostra quantas execuções ocorreram nos últimos 7 dias, a taxa de sucesso das execuções concluídas, a duração média e quantas execuções foram interrompidas por uma política.' },
        { kind: 'p', text: 'Filtre a lista por repositório, status ou nome da branch. Selecione o número de uma execução para abrir os detalhes.' },
        {
          kind: 'table',
          head: ['Status da execução', 'Significado'],
          rows: [
            ['Sucesso', 'Todas as etapas terminaram sem violar uma política. Achados abaixo do critério de falha ainda podem ser reportados.'],
            ['Falhou', 'Uma etapa encontrou problemas no critério de falha ou acima dele, ou a própria etapa não pôde ser concluída. As etapas seguintes são ignoradas.'],
            ['Em execução', 'O pipeline está sendo executado neste momento.'],
            ['Na fila', 'A execução está aguardando um executor disponível.'],
            ['Cancelada', 'Alguém interrompeu a execução antes do fim.'],
          ],
        },
        { kind: 'p', text: 'A página de detalhes mostra o repositório, a branch, o commit, o que disparou a execução (push, agendamento, manual ou merge request) e quem a disparou. Abaixo, as etapas são agrupadas por fase, cada uma com ferramenta, status, duração e quantidade de achados:' },
        {
          kind: 'table',
          head: ['Status da etapa', 'Significado'],
          rows: [
            ['Aprovada', 'Nenhum achado.'],
            ['Aprovada com alertas', 'Foram reportados achados, mas nenhum atingiu o critério de falha.'],
            ['Falhou', 'Achados atingiram o critério de falha; a política que causou a falha aparece abaixo da etapa.'],
            ['Em execução / Pendente', 'A etapa está em execução ou aguardando as etapas anteriores.'],
            ['Ignorada', 'A etapa não foi executada porque uma etapa anterior falhou ou a execução foi cancelada.'],
          ],
        },
        { kind: 'p', text: 'Enquanto uma execução está na fila ou em andamento, a página dela se atualiza sozinha: um painel de progresso mostra qual etapa está rodando (por exemplo "Etapa 3 de 7 — Análise de dependências"), a etapa atual fica destacada com um indicador animado e as etapas concluídas são preenchidas conforme terminam. A lista de execuções de pipeline também se atualiza enquanto houver alguma em andamento.' },
        { kind: 'p', text: 'Selecione "Ver log" em uma etapa para ler a saída da ferramenta; os logs de etapas com falha abrem automaticamente. Selecione a quantidade de achados para ir até Vulnerabilidades. Use "Executar novamente" para iniciar o pipeline de novo ou "Cancelar execução" para interromper um pipeline na fila ou em execução.' },
        { kind: 'p', text: '"Executar novamente" cria uma nova execução do mesmo commit, disparada manualmente por você, usando as configurações atuais de pipeline do repositório — ou seja, inclui as etapas que você ativou ou desativou desde a execução original — e a abre. Cancelar marca como ignoradas as etapas que ainda não tinham terminado. Apenas pipelines na fila ou em execução podem ser cancelados.' },
      ],
    },

    // --- reports + policies ---
    {
      id: 'reports',
      title: 'Relatórios',
      blocks: [
        { kind: 'p', text: 'A página Relatórios lista todos os relatórios gerados para a organização ou para um único repositório. Há dois tipos:' },
        {
          kind: 'table',
          head: ['Tipo', 'Conteúdo'],
          rows: [
            ['Resumo de segurança', 'Visão semanal ou mensal dos achados novos, corrigidos e abertos. Gerado automaticamente por agendamento.'],
            ['Conformidade', 'Achados mapeados para as categorias do OWASP Top 10, útil para auditorias.'],
          ],
        },
        { kind: 'p', text: 'Para solicitar um relatório sob demanda, selecione "Gerar relatório", escolha o tipo, o escopo (a organização inteira ou um repositório) e o período (a última semana, mês ou trimestre completo), e selecione "Gerar". O relatório aparece na lista com status "Gerando" e pode ser aberto quando estiver "Pronto". Relatórios de triagem com IA ainda não estão disponíveis.' },
        { kind: 'p', text: 'Um relatório contém:' },
        {
          kind: 'ul',
          items: [
            'Resumo executivo: uma visão curta e não técnica para gestores.',
            'Indicadores: achados novos, corrigidos e ainda abertos, tempo médio de correção e o percentual de achados corrigidos dentro do SLA.',
            'Tendência de achados: achados novos e corrigidos por semana. Passe o mouse sobre o gráfico (ou foque nele e use as setas) para ver cada semana; "Mostrar tabela de dados" lista os mesmos valores.',
            'Achados abertos por severidade, principais riscos, mapeamento OWASP Top 10 e recomendações. A seção de triagem com IA aparece bloqueada até que a triagem com IA esteja disponível.',
          ],
        },
        { kind: 'p', text: 'Os textos do relatório seguem o idioma selecionado na barra superior. Selecione "Exportar PDF" para imprimir ou salvar o relatório em PDF, ou "Copiar link" para compartilhá-lo com alguém que tenha acesso ao Artemis.' },
      ],
    },

    {
      id: 'policies',
      title: 'Políticas',
      blocks: [
        { kind: 'p', text: 'Políticas são regras da organização aplicadas a todos os repositórios. Apenas administradores devem alterá-las.' },
        {
          kind: 'ul',
          items: [
            'Critérios do pipeline: o critério de falha padrão de cada etapa. Marque uma etapa como "Obrigatória" para impedir que os repositórios a desativem.',
            'SLA de correção: o número máximo de dias (de 1 a 365) para corrigir um achado de cada severidade. Os relatórios medem o cumprimento do SLA com base nesses valores.',
            'Política de licenças: licenças permitidas ou proibidas. Digite o identificador SPDX da licença (por exemplo MPL-2.0) e selecione "Adicionar"; use o X de uma licença para removê-la. Uma licença não pode ser permitida e proibida ao mesmo tempo. Licenças não listadas são reportadas para revisão.',
            'Aceitações de risco: achados aceitos como riscos conhecidos, com justificativa e data de expiração. Eles não falham pipelines até expirarem (no máximo um ano). Selecione "Revogar" para remover uma aceitação imediatamente.',
          ],
        },
        { kind: 'p', text: 'Selecione "Salvar alterações" para aplicar. As alterações valem a partir da próxima execução do pipeline; "Cancelar" descarta suas edições e recarrega as políticas salvas.' },
      ],
    },

    // --- integrations + team + settings ---
    {
      id: 'integrations',
      title: 'Integrações',
      blocks: [
        { kind: 'p', text: 'A página Integrações conecta o Artemis às ferramentas que sua equipe já usa. As integrações são agrupadas por categoria: controle de versão, CI/CD, notificações, gestão de issues e dados de vulnerabilidades.' },
        {
          kind: 'ul',
          items: [
            'Conectado (verde): a integração está ativa. Use "Configurar" para definir a conta, o canal ou o projeto usado, ou "Desconectar" para removê-la.',
            'Não conectado: selecione "Conectar" para autorizar o Artemis na ferramenta externa.',
            'Erro de conexão (vermelho): as credenciais expiraram ou foram revogadas. Selecione "Reconectar" para autorizar novamente.',
          ],
        },
        { kind: 'p', text: 'A integração com o NIST NVD está sempre ativa e não pode ser desconectada: ela fornece os registros de CVE e as pontuações CVSS. O card mostra a última sincronização.' },
        { kind: 'p', text: 'Em "Deploy keys SSH" você vê todas as chaves que o Artemis gerou para clonar repositórios privados, com impressão digital, repositório e último uso. As chaves são criadas e trocadas na aba Deploy Key de cada repositório; selecione o repositório para abri-la. "Revogar" apaga uma chave (as análises desse repositório falham até uma nova chave ser gerada) — remova-a também do repositório no seu provedor Git.' },
        { kind: 'note', text: 'Chaves marcadas como "Só chave pública" foram adicionadas antes de o Artemis gerar chaves. O Artemis não tem a chave privada delas, então nunca são usadas para clonar; gere uma chave na aba Deploy Key do repositório.' },
      ],
    },
    {
      id: 'team',
      title: 'Equipe e papéis',
      blocks: [
        { kind: 'p', text: 'A página Equipe lista todos os membros da organização com papel, última atividade e status. Proprietários e administradores mudam o papel de um membro escolhendo um novo na coluna Papel. Ninguém pode mudar o próprio papel, e o papel de proprietário nunca é atribuído ali: o proprietário seleciona "Tornar proprietário" ao lado de um membro ativo para transferir a propriedade, passando a ser administrador.' },
        { kind: 'p', text: 'Proprietários e administradores podem mudar o papel de um membro a qualquer momento pelo seletor de papel na lista de membros, ou remover o membro com “Remover”. Só o proprietário gerencia administradores: administradores podem mudar e remover analistas, desenvolvedores e leitores, mas não podem promover ninguém a administrador, mudar o papel de outro administrador nem remover um administrador. Sempre há exatamente um proprietário; para passar a organização adiante, o proprietário usa “Tornar proprietário” e passa a ser administrador. Ninguém pode mudar o próprio papel nem se remover (use “Sair da organização” em Configurações).' },
        { kind: 'p', text: 'Para adicionar alguém, selecione "Convidar membro", informe o e-mail e escolha um papel. Um endereço que já pertence a um membro ou já tem convite pendente é recusado. A pessoa convidada vê o convite na página Organizações depois de entrar ou se cadastrar com esse e-mail (o Artemis ainda não envia e-mails de convite). Convites expiram em 7 dias; "Reenviar" renova o prazo e "Revogar" cancela o convite.' },
        {
          kind: 'table',
          head: ['Papel', 'Indicado para'],
          rows: [
            ['Proprietário', 'Acesso total, incluindo cobrança. Um por organização.'],
            ['Administrador', 'Gerencia repositórios, pipelines, integrações e a equipe.'],
            ['Analista de segurança', 'Faz a triagem de achados e configura pipelines.'],
            ['Desenvolvedor', 'Vê e faz a triagem de achados nos seus repositórios.'],
            ['Leitor', 'Acesso somente leitura a achados e relatórios.'],
          ],
        },
        { kind: 'p', text: 'A tabela "Papéis e permissões", no fim da página, mostra exatamente o que cada papel pode fazer. O Artemis aplica essas regras em todas as requisições:' },
        {
          kind: 'table',
          head: ['Permissão', 'O que permite', 'Papéis'],
          rows: [
            ['Ver achados e relatórios', 'Ver todas as páginas da organização', 'Todos os papéis'],
            ['Triar achados', 'Mudar o status de achados, gerenciar aceites de risco, gerar relatórios', 'Proprietário, Administrador, Analista de segurança, Desenvolvedor'],
            ['Configurar pipelines', 'Adicionar repositórios, executar e cancelar análises, testar o acesso a repositórios, editar configurações de repositórios, pipelines e políticas', 'Proprietário, Administrador, Analista de segurança'],
            ['Gerenciar integrações', 'Integrações, gerar, trocar e revogar deploy keys, tokens de API', 'Proprietário, Administrador'],
            ['Gerenciar equipe', 'Convites, papéis e configurações da organização', 'Proprietário, Administrador'],
            ['Gerenciar cobrança', 'Mudar o plano, transferir a propriedade, excluir a organização', 'Proprietário'],
          ],
        },
        { kind: 'p', text: 'Quando o seu papel não permite algo, os controles aparecem desativados com um cadeado e uma breve explicação, em vez de ficarem ocultos. Peça a um proprietário ou administrador se precisar de mais acesso.' },
      ],
    },
    {
      id: 'settings',
      title: 'Configurações da organização',
      blocks: [
        { kind: 'p', text: 'Configurações, na barra lateral, reúne opções que valem para toda a organização, organizadas em abas:' },
        {
          kind: 'ul',
          items: [
            'Geral: nome da organização, identificador na URL, idioma padrão e fuso horário. Cada membro ainda pode escolher o próprio idioma na barra superior.',
            'Autenticação: provedor de identidade OpenID Connect (Keycloak), URL do emissor (deve usar https), client ID e tempo limite da sessão. O client secret nunca é armazenado nem exibido no Artemis: ele é gerenciado pelos administradores nos segredos da implantação, e a página mostra apenas se está configurado. Ative "Exigir login único (SSO)" para que os membros só entrem pelo provedor de identidade.',
            'Notificações: escolha quais eventos (nova CVE crítica, pipeline falhou, relatório semanal, SLA excedido) são enviados para cada canal (e-mail, Slack, Microsoft Teams).',
            'Tokens de API: tokens permitem que scripts e jobs de CI chamem a API do Artemis. Selecione "Criar token" e informe nome, validade e escopos. O token é exibido uma única vez: copie-o antes de selecionar "Concluir". Depois disso a lista mostra apenas o prefixo e os quatro últimos caracteres. Revogue tokens que não usa mais.',
            'Retenção de dados: por quanto tempo o histórico de achados, os logs de pipeline e os relatórios são mantidos. Dados mais antigos são excluídos permanentemente.',
            'Zona de perigo: membros que não são o proprietário podem sair da organização. O proprietário pode excluí-la digitando o nome exato — isso apaga permanentemente todos os repositórios, achados, execuções de pipeline, relatórios, políticas, integrações, tokens e vínculos de membros, sem possibilidade de desfazer.',
          ],
        },
        { kind: 'p', text: 'Nas abas Geral, Autenticação, Notificações e Retenção de dados, selecione "Salvar alterações" para aplicar. Tokens de API e a zona de perigo têm efeito imediato. Somente proprietários e administradores podem alterar as configurações (tokens de API: permissão "Gerenciar integrações"); os demais papéis as veem somente para leitura.' },
        { kind: 'note', text: 'Dica: dê aos tokens de API apenas os escopos necessários e a menor validade possível.' },
      ],
    },

    {
      id: 'billing',
      title: 'Assinatura e planos',
      blocks: [
        { kind: 'p', text: 'Configuração → Assinatura mostra o plano atual da sua organização e compara os planos disponíveis.' },
        {
          kind: 'table',
          head: ['Plano', 'Preço', 'Inclui'],
          rows: [
            ['Free', 'R$ 0', '90 análises por mês. Varreduras (segredos, SAST, dependências, contêineres), pipeline DevSecOps e políticas, painel, achados, relatórios, equipe, integrações e tokens de API.'],
            ['PRO', 'R$ 24,99 por mês', '300 análises por mês. Tudo do Free mais triagem de achados com IA e relatórios de triagem gerados por IA.'],
          ],
        },
        { kind: 'p', text: 'Cada execução de pipeline conta como uma análise. O uso do mês atual (UTC) aparece no rodapé da barra lateral e na página de Assinatura; ao atingir o limite, novas execuções (como reexecuções) são recusadas até o mês seguinte. Os planos também aparecem na seção Preços da página inicial.' },
        { kind: 'note', text: 'A cobrança ainda não está habilitada: todas as organizações estão no plano Free e o botão de assinatura está bloqueado. Nada é cobrado sem a sua concordância expressa.' },
      ],
    },
    {
      id: 'glossary',
      title: 'Glossário',
      blocks: [
        {
          kind: 'table',
          head: ['Termo', 'Definição'],
          rows: [
            ['CVE', 'Common Vulnerabilities and Exposures: identificador público de uma vulnerabilidade conhecida.'],
            ['CVSS', 'Common Vulnerability Scoring System: pontuação de 0 a 10 que indica a gravidade de uma vulnerabilidade.'],
            ['NVD', 'National Vulnerability Database, mantida pelo NIST; fonte dos dados de CVE e CVSS.'],
            ['SAST', 'Static Application Security Testing: análise do código-fonte sem executá-lo.'],
            ['SCA', 'Software Composition Analysis: análise de dependências de terceiros.'],
            ['DAST', 'Dynamic Application Security Testing: teste de uma aplicação em execução.'],
            ['SBOM', 'Software Bill of Materials: inventário dos componentes de um build.'],
            ['IaC', 'Infrastructure as Code: infraestrutura definida em arquivos como Terraform.'],
            ['OIDC', 'OpenID Connect: protocolo de login único usado na autenticação.'],
          ],
        },
      ],
    },
  ],
};
