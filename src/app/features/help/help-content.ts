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
        { kind: 'p', text: 'The sign-in, sign-up and password-reset pages are run by Artemis’s identity service (Keycloak) with the Artemis look; they open in the language selected in the app. To sign in, select "Sign in" and enter your username or e-mail and password; you return to the page you were trying to open. If you forgot your password, use "Forgot password?" on the sign-in page. Authentication uses OpenID Connect; Artemis itself never sees or stores your password. Several failed attempts temporarily lock the account to protect it.' },
        { kind: 'p', text: 'Your name appears in the top bar while you are signed in, next to your role in the current organization; select your name to open your account page at the identity service (profile, password, two-factor authentication, signed-in devices and account deletion). The session is shared by all tabs of the browser, and the home page shows you as signed in with a "Go to dashboard" button, plus a "Your workspace" section listing your organizations and pending invitations. If the session expires you are asked to sign in again. "Sign out" ends both your Artemis session and your session at the identity service.' },
        { kind: 'p', text: 'While you are signed in, the home page opens on your workspace: one card per organization with its open and critical findings, repositories, scans used this month and last scan, plus shortcuts to its pages. If you already own an organization, the create card explains that each account can own one. Artemis administrators also see a “Platform administration” button there.' },
        { kind: 'p', text: 'The interface is organized as follows:' },
        {
          kind: 'ul',
          items: [
            'Sidebar: navigation grouped into Overview, Security and Configuration. Badges show the number of open vulnerabilities and connected repositories.',
            'New project button: starts the flow to connect a new repository.',
            'Bottom of the sidebar: scans used this month against the monthly limit (25 per organization), this help page and the current organization. Select the organization to switch to another one or to open "All organizations".',
            'Top bar: language selector (English or Portuguese), light/dark theme toggle and sign out. Language and theme are remembered in your browser.',
            'Addresses: every page lives under your organization, for example /acme/vulnerabilities. Links you share point to the same page for your colleagues.',
            'Lists: tables with more than 15 items show 15 per page, with the range shown (for example “Showing 16–30 of 42”) and buttons to move between pages. Changing a filter, the search or the sort order goes back to the first page.',
          ],
        },
        { kind: 'p', text: 'Artemis adapts to your screen. On smaller laptop screens the sidebar shows icons only; point at it (or move the keyboard focus into it) and it expands to show every name. On tablets and phones the sidebar is hidden: open it with the menu button at the top left and close it with the X button, the Escape key or by tapping outside it.' },
      ],
    },
    {
      id: 'organizations',
      title: 'Organizations and invitations',
      blocks: [
        { kind: 'p', text: 'Everything in Artemis — repositories, findings, pipelines, reports, policies, integrations, team and settings — belongs to an organization. You can be a member of several organizations, with a different role in each, and their data is kept completely separate.' },
        { kind: 'p', text: 'After signing in you go straight to your organization if you have only one; otherwise the Organizations page (/organizations) opens. It shows:' },
        {
          kind: 'ul',
          items: [
            'Your organizations: name, address and your role. Select one to open its dashboard.',
            'Invitation links: to join an organization, open the invitation link the person who invited you shared with you (sign in or create an account first if asked). The link first shows the organization and the role it offers (“Join Acme as Developer?”): select “Join” to become a member and go to that organization’s dashboard, or “Not now” to leave without using it; it works once and expires after 7 days.',
            'Create organization: enter a name; the URL name is generated from it (lowercase, accents removed, spaces and symbols become hyphens — “Acme Corp” becomes /acme-corp — used in every link, such as /acme-corp/dashboard) and cannot be edited. The name needs at least 3 letters or numbers, and some URL names are reserved or already taken. You become the owner. The name cannot be changed later unless the Artemis administrators enable renaming for the organization. Each account can own one organization (organizations created before this rule stay available); ownership can only be transferred to someone who doesn’t own an organization yet. You can join any number of organizations by invitation.',
          ],
        },
        { kind: 'p', text: 'To switch organization at any time, select the organization at the bottom of the sidebar and pick another one, or "All organizations · create one".' },
        { kind: 'note', text: 'Artemis does not send invitation e-mails yet, so invitations travel as one-time links. Only someone with the link can use it — that is what keeps someone else from joining just by registering with the invited e-mail address. If a link was lost, used or expired, ask for a new one.' },
        { kind: 'p', text: 'To leave an organization, open Settings → Danger zone and select "Leave this organization". The owner cannot leave; they must transfer ownership first (Settings → Danger zone → “Transfer ownership”) or delete the organization.' },
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
            'Open findings: findings with status Open or Triaged, with how many are past their remediation SLA.',
            'Critical: open findings with a CVSS score of 9.0 or higher (select the number to list them), and their share of all open findings.',
            'Average CVSS: mean score of the open findings, with its risk level (Critical, High, Medium or Low, same ranges as the table below).',
            'Last scan: how long ago the most recent pipeline finished, the exact date and time in your time zone, and how many repositories are monitored.',
            'Open findings and Critical also show a small line of the chosen trend period and the change since its first day (▲ more, ▼ fewer). These follow the "Trends" period.',
          ],
        },
        { kind: 'p', text: '"Findings by severity" breaks the open findings down by severity in one bar, with the count and percentage of each; select a severity to see those findings. "Recent vulnerabilities" lists the latest findings; select a CVE identifier to open its details, "View all" to open the Vulnerabilities page, or the sources link to see the vulnerability databases on the Integrations page.' },
        { kind: 'p', text: '"Trends" shows the last 30 or 90 days (choose the period at the top right of the section). Days follow your browser’s time zone. Hover over a chart, or select it and use the arrow keys, to read the values of each day or week; "Show data table" lists every value.' },
        {
          kind: 'ul',
          items: [
            'Open findings over time: findings that were open or triaged at the end of each day, stacked by severity. Each finding is counted under its current severity.',
            'New vs fixed per week: first detections and fixes (automatic, when a scan no longer reports the issue, or manual) in 7-day blocks ending today. A finding that is reopened is not counted as new again.',
            'Mean time to remediate: average time from a finding’s first detection to its fix, over the fixes in the period. "Fixed in the period" counts those fixes.',
            'Pipeline runs per day: finished runs by result (succeeded, failed, cancelled), on the day they started, with the success rate and the number of runs in the period.',
            'Open findings by kind (every kind is listed, those without open findings dimmed) and Repositories with the most open findings (top 5, by severity): select a bar to open Vulnerabilities filtered by that kind or repository.',
          ],
        },
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
            'Repository: enter the repository’s SSH URL (for example git@git.example.com:acme/project.git) and the branch to analyze. Artemis scans every repository — public or private — through a read-only deploy key it generates for it, which also proves you control the repository (see "Repository access (deploy keys)"). If it is a monorepo, turn on "This repository is a monorepo" and list the folders to scan (for example frontend and backend), choosing the stack of each one; the stack step then uses those choices.',
            'Settings: choose the scan schedule and an optional container image (see "Scan settings").',
            'Pipeline: choose which security stages run (see "DevSecOps pipeline").',
            'Stack: “Detect automatically” (recommended) lets Artemis read the repository’s manifest files (package.json, pom.xml, build.gradle, requirements.txt, pyproject.toml…) after the first successful “Test access” — nothing is executed — and set the stack, or the folders of a monorepo. Or select it yourself: React, Angular, Java + Spring, Python + Flask, Python + FastAPI or Python + Django. While detection is pending the repository shows “Detecting stack…”; once set, a sparkles symbol next to the stack means it was detected automatically and a person symbol means someone selected it.',
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
            'Scan schedule (optional feature, enabled by the Artemis administrators): every 6 hours, 24 hours or 7 days Artemis queues a scan of the default branch by itself — shown as “Scheduled” on the Pipelines page, by “Artemis scheduler”. The settings show the next scheduled scan in your time zone. Scheduled scans count toward the monthly scan limit and run like manual ones (access check, policies); a scan is skipped until the next interval when the limit is reached, access is not verified or a run of the repository is still queued or running. Until the feature is enabled for the organization the control is locked (“Available on request”) and scans run only when someone selects Run scan; a schedule saved earlier is kept but inactive. Once it is enabled, the settings say “Your organization is allowed to use scheduled scans.”',
            'Container image: optionally, a published image (for example ghcr.io/acme/app:1.4) for the container image scan stage.',
            'AI triage: an optional feature the Artemis administrators enable per organization on request. Once enabled, the settings say “Your organization is allowed to use AI triage.”: reports get an AI-written summary and recommendations (see Reports) and findings can be explained with AI (see Vulnerabilities). Until then it is shown locked (“Available on request”) and links to the Usage page.',
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
        { kind: 'note', text: 'Tip: start with "Recommended".' },
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
            'The scanner clones the latest commit of the chosen branch over SSH with the repository’s deploy key, after first checking that the key still has access — if it was removed, the run stops right away, the repository shows “Authentication error” and scans stay locked until “Test access” succeeds again (the key is deleted from the scanner right after cloning) into an isolated, temporary workspace. For a monorepo, "Run scan" first asks which folders to scan (all are selected by default); each stage scans the chosen folders one after the other and combines the results, and the run page lists the folders it scanned. Re-running a run scans the same folders; file paths in findings stay relative to the repository root.',
            'Each enabled stage runs its tool. The container image scan is skipped when no image is set.',
            'Each stage passes, warns (findings below the fail threshold) or fails (findings at or above it). A failed stage stops the pipeline: the remaining stages are skipped and the run fails.',
            'The code copy is deleted. Findings, short tool logs and the SBOM (the list of dependencies, CycloneDX JSON) are kept with the run.',
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
        { kind: 'p', text: 'Findings that are no longer reported by a later scan are marked as fixed automatically. Each run counts as one scan against the organization’s monthly limit (25 scans), unless it ends before any stage runs (for example the access check or the clone fails, or it is cancelled while queued): then the run page says it did not count and the scan is given back.' },
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
            'General tab: the stack (change it if the automatic detection got it wrong — your choice is never overwritten afterwards), monorepo folders and their stacks, container image, scan schedule and AI triage.',
            'Pipeline tab: stages, tools, fail thresholds and presets.',
            'Deploy Key tab: the repository’s deploy key, setup steps, server identity and access test (see "Repository access (deploy keys)").',
          ],
        },
        { kind: 'p', text: 'Select "Save changes" to apply. Changes take effect from the next pipeline run; "Cancel" discards them.' },
        { kind: 'p', text: 'To stop monitoring a repository, open its General tab, select "Remove repository…" and type the repository name to confirm. The repository leaves the list, can no longer be scanned, its queued scans are cancelled and its deploy key is destroyed (also remove it from your Git provider); the repository itself is not touched. By default its history is kept: findings, pipeline runs and logs, reports and risk acceptances stay visible in Vulnerabilities, Pipeline runs, reports and the CSV export, tagged “Removed repository” (those runs cannot be re-run, and its open findings no longer count on the dashboard). Check “Also delete everything linked to this repository” to delete all of it permanently instead. Kept history is listed under Repositories → Removed repositories, where “Delete history” deletes it later. You can connect a repository with the same name again; it starts with a fresh history. Removing requires a role that can manage pipelines.' },
      ],
    },
    {
      id: 'private-repositories',
      title: 'Repository access (deploy keys)',
      blocks: [
        { kind: 'p', text: 'Every repository — public or private — needs a deploy key: Artemis only scans repositories you have granted read access to, which also proves the repository is yours. Add the repository with its SSH URL (for example git@git.example.com:acme/app.git); Artemis generates a read-only SSH deploy key just for it and opens its Deploy Key tab. The first scan waits until access works.' },
        {
          kind: 'ol',
          items: [
            'Copy the public key shown in the Deploy Key tab.',
            'Add it to the repository as a deploy key — GitHub: Settings → Deploy keys; GitLab: Settings → Repository → Deploy keys; Bitbucket: Repository settings → Access keys; any other Git server with deploy keys (Gitea, Forgejo, self-hosted GitLab…): the repository’s deploy key settings. Leave write access off.',
            'Select "Test access". Artemis checks that it can read the branch; the result appears in a few seconds. Each organization can run up to 30 access checks per hour.',
            'When access is OK, select "Run scan" to start the first scan.',
          ],
        },
        { kind: 'p', text: 'Server identity: Artemis only connects to a Git server whose host key it trusts. GitHub, GitLab and Bitbucket are verified against the keys they publish. For other servers the key is recorded the first time you test access and shown with its fingerprint — check that it matches your server; later connections must present the same key.' },
        { kind: 'p', text: '"Rotate key" generates a new key and deletes the old one immediately: add the new public key to the repository and remove the old one. Removing the repository deletes its key too (whether or not its history is kept).' },
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
            'AI triage: when the Artemis administrators enabled AI for your organization, "Explain with AI" writes a short explanation of the finding — impact, when it can be exploited, priority and fix — marked "AI-generated" (review it before acting: AI can make mistakes). It is never automatic and needs the “Triage findings” permission; viewers see explanations already made. The result is saved for the organization and reused for the same CVE in the same package version (or the same rule) in any repository, so asking again costs nothing. It is written in the organization’s default language. Only public identifiers and scanner data are sent to the AI provider (CVE or rule id, title and description — neither for secrets —, severity, CVSS, CWE, package and versions) plus the repository’s stack; never code, file paths, secret values or repository names. Up to 50 new explanations per organization per day; every attempt counts, including ones that fail. If the AI is busy, try again in a minute. When AI is enabled the card says “Your organization is allowed to use AI triage.”; without it the card is shown locked.',
            'References (NVD, package registry, CWE) and a timeline of what happened to the finding.',
          ],
        },
        { kind: 'p', text: 'Use "Change status" to mark the finding as triaged, as a false positive, to accept the risk or to reopen it. The change applies to every affected repository, is saved immediately and is recorded in the timeline. A finding that is a false positive, accepted or fixed can only be reopened. "Fixed" is set automatically when a scan no longer detects the issue. Accepting a risk asks for a justification and an expiry date and creates a risk acceptance (see Policies); the status card also shows the remediation due date from the SLA.' },
        { kind: 'p', text: 'To change several findings at once, select Select on the Vulnerabilities list, tick the findings (or the box in the header for every finding on the current page; the selection is kept when you change pages) and choose the new status. Each button shows how many of the selected findings can take that status; the others are left as they are. Accepting the risk asks for one justification and expiry date for all of them. You need the “Triage findings” permission.' },
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
        { kind: 'p', text: 'When the SBOM generation stage ran, select "Download SBOM (CycloneDX JSON)" under it to save the software bill of materials of that scan (for a monorepo, one per scanned folder, labelled with the folder and its number of components). SBOMs larger than 20 MB are not stored (the stage log says so). The SBOM is kept until the run, the repository’s history or the organization is deleted; older runs have none.' },
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
            ['Security summary', 'Overview of new, fixed and open findings in the period, with the top risks and what to fix first.'],
            ['Compliance', 'The same figures framed by OWASP Top 10 (2021) category, useful for audits.'],
          ],
        },
        { kind: 'p', text: 'To request a report, select "Generate report", choose the type, the scope (the whole organization or one repository) and the period (the last complete week, month or quarter), then select "Generate". Generating a report requires a role that can triage findings. The report appears in the list as "Generating" and is usually "Ready" within a few seconds; the list refreshes by itself. If it shows "Failed", select "Retry". An organization can have up to 3 reports being generated at a time; wait for one to finish before requesting another.' },
        { kind: 'p', text: 'Figures come from your findings: new findings are those first detected in the period and fixed ones those fixed in it; open counts, severities, top risks and the OWASP mapping describe the findings open now, leaving out removed repositories. Dependency vulnerabilities count under A06 (Vulnerable and Outdated Components), leaked secrets under A07, code and configuration findings by their CWE; anything else is listed as "Other".' },
        { kind: 'p', text: 'AI-written summaries: when the Artemis administrators enable AI for your organization (on request), the executive summary and the recommendations of new reports are written by AI (Anthropic Claude) and marked "AI-generated". They are written only in the organization’s default language (Settings → General); readers using the other language see them in that language, with a note. Only aggregated, de-identified data is sent: counts, indicators, OWASP categories and the top risks described by CVE or rule id, title (not for secrets), severity, CVSS, CWE, package name and installed and fixed versions, and age. Source code, file paths, secret values, repository and organization names, people and logs are never sent. AI can make mistakes: review the text before sharing it. If the AI service is unavailable, or after 10 AI attempts in a day (every attempt counts, including ones that fail), the standard summary is used and the report says so. Without AI, Artemis writes the summary and recommendations from templates.' },
        { kind: 'p', text: 'A report contains:' },
        {
          kind: 'ul',
          items: [
            'Executive summary: a short, non-technical overview for managers.',
            'Key indicators: new, fixed and still open findings, mean time to remediate and the percentage of findings fixed within the SLA.',
            'Findings trend: new and fixed findings per week. Hover over (or focus and use the arrow keys on) the chart to see each week; "Show data table" lists the same values.',
            'Open findings by severity, top risks (open critical and high findings, with the package and the version that fixes them), OWASP Top 10 mapping and prioritized recommendations.',
          ],
        },
        { kind: 'p', text: 'Report texts follow the language selected in the top bar. Select "Export PDF" to print or save the report as PDF, or "Copy link" to share it with someone who has access to Artemis.' },
      ],
    },

    {
      id: 'policies',
      title: 'Policies',
      blocks: [
        { kind: 'p', text: 'Policies are organization-wide rules that Artemis enforces on every repository. Roles that manage pipelines (owner, admin, security analyst) edit them; roles that triage findings manage risk acceptances.' },
        {
          kind: 'ul',
          items: [
            'Pipeline gates: the minimum fail threshold of each stage. A repository may choose a stricter threshold but not a looser one — looser options are disabled in the pipeline editor, and runs always use the stricter of the two. Mark a stage as “Required” to run it in every repository: it shows “Required by the organization policy” and cannot be turned off.',
            'Remediation SLA: the maximum number of days (1 to 365) to fix a finding of each severity, counted from its first detection. Open and triaged findings show “Due in N days” or “Overdue” in Vulnerabilities, the finding page shows the date, and the dashboard counts the findings past their SLA.',
            'License policy: licenses that are allowed or denied (SPDX identifiers such as MPL-2.0, case-insensitive). The License compliance stage drops allowed licenses, reports denied ones as high severity and any other restrictive license as medium, for review; the stage fails according to its gate. A license cannot be both allowed and denied.',
            'Risk acceptances: findings accepted as known risks, with a justification (at least 10 characters) and an expiry date (at most one year). Accept a risk from a finding (“Accept risk”) or here with “Accept a risk”, using the finding reference (F-1101) or a CVE, which accepts every open finding of that CVE in the repository. Accepted findings never fail pipelines. When the date passes the finding is reopened automatically; “Revoke” reopens it right away, and reopening an accepted finding removes its acceptance.',
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
        { kind: 'p', text: 'The Integrations page lists the vulnerability data Artemis uses and the SSH deploy keys of your repositories.' },
        { kind: 'p', text: 'The NIST NVD integration is always active and cannot be disconnected: it provides CVE records and CVSS scores. Its card shows the last synchronization.' },
        { kind: 'p', text: 'Under Vulnerability data, a card for each source lists every database and rule set the scanners use (NVD, GitHub Advisory Database, Linux distribution trackers, the Trivy and Grype databases, misconfiguration and license rules, Gitleaks and Artemis’s own code rules), what each one provides and which stage uses it. The databases are downloaded and searched locally; your code is never sent to them.' },
        { kind: 'p', text: 'Under "SSH deploy keys" you can see every key Artemis generated to clone your repositories (each repository has its own), with its fingerprint, repository and last use. Keys are created and rotated in each repository’s Deploy Key tab; select the repository to open it. "Revoke" deletes a key (scans of that repository fail until a new key is generated) — also remove it from the repository on your Git provider.' },
        { kind: 'note', text: 'Keys marked "Public key only" were added before Artemis generated keys. Artemis has no private key for them, so they are never used to clone; generate a key in the repository’s Deploy Key tab instead.' },
      ],
    },
    {
      id: 'team',
      title: 'Team and roles',
      blocks: [
        { kind: 'p', text: 'The Team page lists every member of the organization with their role, last activity and status. Owners and admins change a member\'s role by picking a new one in the Role column. Nobody can change their own role, and the owner role is never assigned there: the owner selects "Make owner" next to an active member to transfer ownership, becoming an admin.' },
        { kind: 'p', text: 'Owners and admins can change a member’s role at any time with the role picker in the member list, or remove the member with “Remove”. Only the owner manages admins: admins can change and remove analysts, developers and viewers, but cannot promote anyone to admin, change another admin’s role or remove an admin. There is always exactly one owner; to hand the organization over, the owner uses Settings → Danger zone → “Transfer ownership” and becomes an admin. Nobody can change their own role or remove themselves (use “Leave organization” in Settings).' },
        { kind: 'p', text: 'To add someone, select "Invite member", enter their e-mail and choose a role. An address that already belongs to a member or has a pending invitation is rejected. Artemis then shows a one-time invitation link — copy it and send it to the person yourself (Artemis does not e-mail invitations yet). The link is shown only once, works once and expires after 7 days; the person sees the organization and role and confirms before joining. "New link" creates a fresh link (the old one stops working) and "Revoke" cancels the invitation.' },
        {
          kind: 'table',
          head: ['Role', 'Intended for'],
          rows: [
            ['Owner', 'Full access, including transferring ownership and deleting the organization. One per organization.'],
            ['Admin', 'Manages repositories, pipelines, integrations and the team.'],
            ['Security analyst', 'Triages findings and configures pipelines.'],
            ['Developer', 'Views and triages findings in their repositories.'],
            ['Viewer', 'Read-only access to findings and reports.'],
          ],
        },
        { kind: 'p', text: 'The "Roles and permissions" table at the bottom of the page shows exactly what each role can do in this organization, and Artemis enforces it on every request. Owners and admins can change it: click a cell to switch between ✓ (allowed) and – (not allowed), then select "Save permissions"; the change applies to everyone with that role on their next action. Admins can change analysts, developers and viewers, but only the owner changes admin permissions. Some cells are locked: the owner always has every permission, every role can view findings, and “Ownership and deletion” (transferring ownership, deleting the organization) stays with the owner. New organizations start with these defaults:' },
        {
          kind: 'table',
          head: ['Permission', 'What it allows', 'Roles'],
          rows: [
            ['View findings and reports', 'See every page of the organization', 'All roles'],
            ['Triage findings', 'Change finding status, manage risk acceptances, generate reports', 'Owner, Admin, Security analyst, Developer'],
            ['Configure pipelines', 'Add repositories, run and cancel scans, test repository access, edit repository settings, pipelines and policies', 'Owner, Admin, Security analyst'],
            ['Manage integrations', 'Integrations, generating, rotating and revoking deploy keys', 'Owner, Admin'],
            ['Manage team', 'Invitations, roles and organization settings', 'Owner, Admin'],
            ['Ownership and deletion', 'Transfer ownership, delete the organization', 'Owner'],
          ],
        },
        { kind: 'p', text: 'When your role does not allow something, the controls are shown disabled with a lock and a short explanation instead of being hidden. Ask an owner or admin if you need more access.' },
      ],
    },
    {
      id: 'settings',
      title: 'Organization settings',
      blocks: [
        { kind: 'p', text: 'Settings in the sidebar holds options that apply to the whole organization, in two tabs:' },
        {
          kind: 'ul',
          items: [
            'General: organization name, default language and time zone. The URL is always generated from the name and shown read-only. Renaming the organization is an optional feature the Artemis administrators enable per organization (until then the name is locked); once it is enabled, the field says “Your organization is allowed to rename itself.” Renaming also changes the URL, so the page moves to the new address and old links stop working. Each member can still choose their own language in the top bar.',
            'Danger zone: members other than the owner can leave the organization. The owner can delete it by typing its name exactly — this permanently deletes all its repositories, findings, pipeline runs, reports, policies, integrations and memberships, and cannot be undone.',
          ],
        },
        { kind: 'p', text: 'On the General tab, select "Save changes" to apply. The danger zone takes effect immediately. Only owners and admins can change settings; other roles see them read-only.' },
      ],
    },

    {
      id: 'usage',
      title: 'Usage and optional features',
      blocks: [
        { kind: 'p', text: 'Artemis is free: there are no plans, prices or payments. Configuration → Usage shows how many scans your organization ran this month, the limit and when the counter starts again, and which optional features are enabled for it.' },
        { kind: 'p', text: 'Every organization can run 25 scans per calendar month (UTC). Each pipeline run counts as one scan — manual, scheduled, first scans and re-runs; runs that end before any stage runs (access check or clone failed, cancelled while queued, runner stopped) do not count. The usage also appears at the bottom of the sidebar and on the home page; when the limit is reached, new runs are refused until the next month.' },
        {
          kind: 'table',
          head: ['Optional feature', 'What it does'],
          rows: [
            ['Scheduled scans', 'Scan repositories automatically every 6 hours, 24 hours or 7 days.'],
            ['Organization rename', 'Rename the organization; its URL changes too.'],
            ['AI triage', 'AI explanations of findings (on request, on the finding page) and AI-written report summaries.'],
          ],
        },
        { kind: 'note', text: 'Optional features are enabled per organization by the Artemis administrators — the people who run this Artemis instance, not your organization’s owner or admins. Locked controls say “Available on request”: ask the Artemis administrators to enable the feature. Enabled features show a short note such as “Your organization is allowed to use scheduled scans.”' },
      ],
    },
    {
      id: 'platform-admin',
      title: 'Platform administration',
      blocks: [
        { kind: 'p', text: 'Artemis administrators (a role given in the identity provider, unrelated to the Admin role of an organization) open Platform administration from the top bar or the home page. It lists every organization — name, URL, owner, number of members and repositories, creation date — with a search box, and a switch per optional feature; each change is saved immediately.' },
        { kind: 'p', text: 'Open (next to each organization) shows the organization’s pages — dashboard, vulnerabilities, repositories, pipeline runs, reports, policies, team, settings — read-only, with the permissions of a viewer. A banner says you are viewing it as an Artemis administrator, the role tag shows “Viewer · Administrator” and the organization appears in the sidebar switcher, marked “Read-only”, while it is open. Every control that changes something is locked, and members’ e-mail addresses stay hidden. If you are also a member of the organization, your own role applies instead.' },
        { kind: 'p', text: 'Delete removes the organization permanently with everything in it: repositories, deploy keys, findings, pipeline runs, reports, policies, members, invitations and settings. To confirm, type the organization’s URL name in the dialog. It cannot be undone.' },
        { kind: 'p', text: 'The Users tab lists every account of this Artemis instance — name, username, e-mail address, creation date, an “Administrator” tag for Artemis administrators — with the organizations each one belongs to as “acme · Owner” chips (select a chip to open that organization read-only). Search by name, username or e-mail. Delete removes the account permanently: the person is signed out everywhere and removed from every organization, and can register again later as a new account; invitations they sent stay. To confirm, type the username. Delete is disabled, with the reason, for your own account, for other Artemis administrators (remove their role in the identity provider first) and for owners of organizations (delete those organizations or have the ownership transferred first). If the page says “User management isn’t configured”, the API has no access to the identity provider’s user directory yet; organizations keep working.' },
        { kind: 'note', text: 'Artemis administrators can view organizations, enable optional features and delete organizations and accounts, but cannot change anything inside an organization, and the role does not make them members of any organization.' },
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
        { kind: 'p', text: 'As páginas de login, cadastro e redefinição de senha são executadas pelo serviço de identidade do Artemis (Keycloak) com o visual do Artemis; elas abrem no idioma selecionado no app. Para entrar, selecione "Entrar" e informe seu usuário ou e-mail e a senha; você voltará para a página que tentava abrir. Se esqueceu a senha, use "Esqueceu sua senha?" na página de login. A autenticação usa OpenID Connect; o próprio Artemis nunca vê nem armazena sua senha. Várias tentativas erradas bloqueiam a conta temporariamente para protegê-la.' },
        { kind: 'p', text: 'Seu nome aparece na barra superior enquanto você estiver conectado, ao lado do seu papel na organização atual; selecione o nome para abrir sua conta no serviço de identidade (perfil, senha, verificação em duas etapas, dispositivos conectados e exclusão da conta). A sessão é compartilhada por todas as abas do navegador, e a página inicial mostra você conectado com o botão "Ir para o painel", além da seção "Seu espaço de trabalho" com as suas organizações e convites pendentes. Se a sessão expirar, será pedido um novo login. "Sair" encerra a sua sessão no Artemis e no serviço de identidade.' },
        { kind: 'p', text: 'Enquanto você estiver conectado, a página inicial abre no seu espaço de trabalho: um cartão por organização com achados abertos e críticos, repositórios, análises usadas no mês e a última análise, além de atalhos para as páginas dela. Se você já é proprietário de uma organização, o cartão de criação explica que cada conta pode ser proprietária de uma. Os administradores do Artemis também veem ali o botão “Administração da plataforma”.' },
        { kind: 'p', text: 'A interface está organizada assim:' },
        {
          kind: 'ul',
          items: [
            'Barra lateral: navegação agrupada em Visão geral, Segurança e Configuração. Os indicadores mostram a quantidade de vulnerabilidades abertas e de repositórios conectados.',
            'Botão Novo projeto: inicia o fluxo para conectar um novo repositório.',
            'Rodapé da barra lateral: análises usadas no mês em relação ao limite mensal (25 por organização), esta página de ajuda e a organização atual. Selecione a organização para trocar por outra ou abrir "Todas as organizações".',
            'Barra superior: seletor de idioma (inglês ou português), alternância entre tema claro e escuro e sair. Idioma e tema ficam salvos no seu navegador.',
            'Endereços: todas as páginas ficam sob a sua organização, por exemplo /acme/vulnerabilities. Links compartilhados levam seus colegas à mesma página.',
            'Listas: tabelas com mais de 15 itens mostram 15 por página, com o intervalo exibido (por exemplo “Exibindo 16–30 de 42”) e botões para navegar entre as páginas. Alterar um filtro, a busca ou a ordenação volta para a primeira página.',
          ],
        },
        { kind: 'p', text: 'O Artemis se adapta à sua tela. Em notebooks com telas menores a barra lateral mostra apenas ícones; aponte o mouse para ela (ou mova o foco do teclado até ela) e ela se expande mostrando todos os nomes. Em tablets e celulares a barra lateral fica oculta: abra-a pelo botão de menu no canto superior esquerdo e feche pelo botão X, pela tecla Esc ou tocando fora dela.' },
      ],
    },
    {
      id: 'organizations',
      title: 'Organizações e convites',
      blocks: [
        { kind: 'p', text: 'Tudo no Artemis — repositórios, achados, pipelines, relatórios, políticas, integrações, equipe e configurações — pertence a uma organização. Você pode ser membro de várias organizações, com um papel diferente em cada uma, e os dados delas ficam totalmente separados.' },
        { kind: 'p', text: 'Depois do login você vai direto para a sua organização se tiver apenas uma; caso contrário abre a página Organizações (/organizations). Ela mostra:' },
        {
          kind: 'ul',
          items: [
            'Suas organizações: nome, endereço e seu papel. Selecione uma para abrir o painel dela.',
            'Links de convite: para entrar em uma organização, abra o link de convite que a pessoa que convidou você compartilhou (entre ou crie uma conta antes, se for pedido). O link mostra primeiro a organização e o papel oferecido (“Entrar em Acme como Desenvolvedor?”): selecione “Entrar” para se tornar membro e ir ao painel da organização, ou “Agora não” para sair sem usá-lo; ele funciona uma vez e expira em 7 dias.',
            'Criar organização: informe um nome; o nome na URL é gerado a partir dele (minúsculas, sem acentos, espaços e símbolos viram hífens — “Acme Corp” vira /acme-corp — usado em todos os links, como /acme-corp/dashboard) e não pode ser editado. O nome precisa ter pelo menos 3 letras ou números, e alguns nomes de URL são reservados ou já estão em uso. Você será o proprietário. O nome não pode ser alterado depois, a menos que os administradores do Artemis habilitem a renomeação para a organização. Cada conta pode ser proprietária de uma organização (organizações criadas antes desta regra continuam disponíveis); a propriedade só pode ser transferida para quem ainda não é proprietário de uma organização. Você pode entrar em quantas organizações quiser por convite.',
          ],
        },
        { kind: 'p', text: 'Para trocar de organização a qualquer momento, selecione a organização no rodapé da barra lateral e escolha outra, ou "Todas as organizações · criar uma".' },
        { kind: 'note', text: 'O Artemis ainda não envia convites por e-mail, então os convites são links de uso único. Só quem tem o link pode usá-lo — é isso que impede outra pessoa de entrar apenas se cadastrando com o e-mail convidado. Se o link foi perdido, usado ou expirou, peça um novo.' },
        { kind: 'p', text: 'Para sair de uma organização, abra Configurações → Zona de perigo e selecione "Sair desta organização". O proprietário não pode sair; antes ele precisa transferir a propriedade (Configurações → Zona de perigo → “Transferir propriedade”) ou excluir a organização.' },
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
            'Achados abertos: achados com status Aberto ou Triado, com quantos estão fora do prazo de correção.',
            'Críticos: achados abertos com pontuação CVSS 9.0 ou superior (selecione o número para listá-los) e sua parcela do total de achados abertos.',
            'CVSS médio: média das pontuações dos achados abertos, com o nível de risco (Crítica, Alta, Média ou Baixa, nas mesmas faixas da tabela abaixo).',
            'Última análise: há quanto tempo o pipeline mais recente terminou, a data e hora exatas no seu fuso horário e quantos repositórios são monitorados.',
            'Achados abertos e Críticos também mostram uma pequena linha do período escolhido em "Tendências" e a variação desde o primeiro dia dele (▲ mais, ▼ menos).',
          ],
        },
        { kind: 'p', text: '"Achados por severidade" divide os achados abertos por severidade em uma única barra, com a quantidade e a porcentagem de cada uma; selecione uma severidade para ver esses achados. "Vulnerabilidades recentes" lista os achados mais novos; selecione o identificador de uma CVE para abrir seus detalhes, "Ver todas" para abrir a página Vulnerabilidades, ou o link de fontes para ver as bases de vulnerabilidades na página Integrações.' },
        { kind: 'p', text: '"Tendências" mostra os últimos 30 ou 90 dias (escolha o período no canto superior direito da seção). Os dias seguem o fuso horário do seu navegador. Passe o mouse sobre um gráfico, ou selecione-o e use as setas, para ler os valores de cada dia ou semana; "Mostrar tabela de dados" lista todos os valores.' },
        {
          kind: 'ul',
          items: [
            'Achados abertos ao longo do tempo: achados que estavam abertos ou em triagem ao fim de cada dia, empilhados por severidade. Cada achado é contado pela severidade atual.',
            'Novos vs corrigidos por semana: primeiras detecções e correções (automáticas, quando uma análise não relata mais o problema, ou manuais) em blocos de 7 dias terminando hoje. Um achado reaberto não é contado de novo como novo.',
            'Tempo médio de correção: tempo médio entre a primeira detecção de um achado e sua correção, considerando as correções do período. "Corrigidos no período" conta essas correções.',
            'Execuções de pipeline por dia: execuções concluídas por resultado (sucesso, falha, canceladas), no dia em que começaram, com a taxa de sucesso e o número de execuções no período.',
            'Achados abertos por tipo (todos os tipos aparecem; os sem achados abertos ficam esmaecidos) e Repositórios com mais achados abertos (os 5 primeiros, por severidade): selecione uma barra para abrir Vulnerabilidades filtrada por esse tipo ou repositório.',
          ],
        },
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
            'Repositório: informe a URL SSH do repositório (por exemplo git@git.example.com:acme/projeto.git) e a branch a ser analisada. O Artemis analisa todo repositório — público ou privado — por meio de uma deploy key somente leitura que ele gera, o que também comprova que você controla o repositório (veja "Acesso aos repositórios (deploy keys)"). Se for um monorepo, ative "Este repositório é um monorepo" e liste as pastas a analisar (por exemplo frontend e backend), escolhendo a stack de cada uma; a etapa de stack passa a usar essas escolhas.',
            'Configurações: escolha o agendamento e, opcionalmente, uma imagem de contêiner (veja "Configurações da análise").',
            'Pipeline: escolha quais etapas de segurança serão executadas (veja "Pipeline DevSecOps").',
            'Stack: “Detectar automaticamente” (recomendado) faz o Artemis ler os arquivos de manifesto do repositório (package.json, pom.xml, build.gradle, requirements.txt, pyproject.toml…) depois do primeiro “Testar acesso” bem-sucedido — nada é executado — e definir a stack, ou as pastas de um monorepo. Ou selecione você mesmo: React, Angular, Java + Spring, Python + Flask, Python + FastAPI ou Python + Django. Enquanto a detecção está pendente o repositório mostra “Detectando stack…”; depois, um símbolo de brilhos ao lado da stack indica que ela foi detectada automaticamente e um símbolo de pessoa indica que alguém a selecionou.',
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
            'Agendamento de análises (recurso opcional, habilitado pelos administradores do Artemis): a cada 6 horas, 24 horas ou 7 dias o Artemis coloca na fila, sozinho, uma análise da branch padrão — exibida como “Agendada” na página Pipelines, por “Artemis scheduler”. As configurações mostram a próxima análise agendada no seu fuso horário. As análises agendadas contam no limite mensal de análises e rodam como as manuais (verificação de acesso, políticas); uma análise é pulada até o próximo intervalo quando o limite foi atingido, o acesso não está verificado ou uma execução do repositório ainda está na fila ou rodando. Enquanto o recurso não estiver habilitado para a organização, o controle fica bloqueado (“Disponível mediante solicitação”) e as análises só rodam quando alguém seleciona Executar análise; um agendamento salvo antes é mantido, mas fica inativo. Depois de habilitado, as configurações mostram “Sua organização tem permissão para usar análises agendadas.”',
            'Imagem de contêiner: opcionalmente, uma imagem publicada (por exemplo ghcr.io/acme/app:1.4) para a etapa de varredura da imagem de contêiner.',
            'Triagem com IA: recurso opcional que os administradores do Artemis habilitam por organização mediante solicitação. Depois de habilitado, as configurações mostram “Sua organização tem permissão para usar a triagem com IA.”: os relatórios recebem resumo e recomendações escritos por IA (veja Relatórios) e os achados podem ser explicados com IA (veja Vulnerabilidades). Até lá, aparece bloqueado (“Disponível mediante solicitação”) e leva à página de Uso.',
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
        { kind: 'note', text: 'Dica: comece pelo modelo "Recomendado".' },
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
            'O scanner clona o último commit da branch escolhida via SSH com a deploy key do repositório, depois de verificar que a chave ainda tem acesso — se ela foi removida, a execução para na hora, o repositório aparece como “Erro de autenticação” e as análises ficam bloqueadas até o “Testar acesso” funcionar de novo (a chave é apagada do scanner logo após o clone) em um espaço de trabalho isolado e temporário. Em um monorepo, "Executar análise" primeiro pergunta quais pastas analisar (todas vêm selecionadas); cada etapa analisa as pastas escolhidas uma após a outra e junta os resultados, e a página da execução lista as pastas analisadas. Executar novamente analisa as mesmas pastas; os caminhos de arquivo nos achados continuam relativos à raiz do repositório.',
            'Cada etapa ativa executa sua ferramenta. A varredura de imagem é pulada quando nenhuma imagem está definida.',
            'Cada etapa passa, gera alerta (achados abaixo do critério de falha) ou falha (achados no critério ou acima). Uma etapa com falha interrompe o pipeline: as etapas seguintes são ignoradas e a execução falha.',
            'A cópia do código é apagada. Ficam com a execução os achados, logs curtos das ferramentas e o SBOM (a lista de dependências, em CycloneDX JSON).',
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
        { kind: 'p', text: 'Achados que não aparecem mais em uma análise posterior são marcados como corrigidos automaticamente. Cada execução conta como uma análise no limite mensal da organização (25 análises), a menos que termine antes de qualquer etapa rodar (por exemplo, se a verificação de acesso ou o clone falhar, ou se for cancelada ainda na fila): nesse caso a página da execução informa que ela não contou e a análise é devolvida.' },
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
            'Aba Geral: a stack (altere se a detecção automática errou — sua escolha nunca é sobrescrita depois), pastas do monorepo e suas stacks, imagem de contêiner, agendamento e triagem com IA.',
            'Aba Pipeline: etapas, ferramentas, critérios de falha e modelos.',
            'Aba Deploy Key: a deploy key do repositório, os passos de configuração, a identidade do servidor e o teste de acesso (veja "Acesso aos repositórios (deploy keys)").',
          ],
        },
        { kind: 'p', text: 'Selecione "Salvar alterações" para aplicar. As alterações valem a partir da próxima execução do pipeline; "Cancelar" as descarta.' },
        { kind: 'p', text: 'Para parar de monitorar um repositório, abra a aba Geral, selecione "Remover repositório…" e digite o nome do repositório para confirmar. O repositório sai da lista, não pode mais ser escaneado, seus scans na fila são cancelados e sua deploy key é destruída (remova-a também do seu provedor Git); o repositório em si não é alterado. Por padrão o histórico é mantido: achados, execuções de pipeline e logs, relatórios e aceites de risco continuam visíveis em Vulnerabilidades, Execuções de pipeline, relatórios e na exportação CSV, marcados como “Repositório removido” (essas execuções não podem ser executadas de novo, e os achados abertos dele deixam de contar no painel). Marque “Apagar também tudo o que está vinculado a este repositório” para apagar tudo definitivamente. O histórico mantido aparece em Repositórios → Repositórios removidos, onde “Apagar histórico” o apaga depois. Você pode conectar de novo um repositório com o mesmo nome; ele começa com um histórico novo. Remover exige um papel que possa gerenciar pipelines.' },
      ],
    },
    {
      id: 'private-repositories',
      title: 'Acesso aos repositórios (deploy keys)',
      blocks: [
        { kind: 'p', text: 'Todo repositório — público ou privado — precisa de uma deploy key: o Artemis só analisa repositórios aos quais você deu acesso de leitura, o que também comprova que o repositório é seu. Adicione o repositório com a URL SSH (por exemplo git@git.example.com:acme/app.git); o Artemis gera uma deploy key SSH somente leitura só para ele e abre a aba Deploy Key. A primeira análise espera até o acesso funcionar.' },
        {
          kind: 'ol',
          items: [
            'Copie a chave pública exibida na aba Deploy Key.',
            'Adicione-a ao repositório como deploy key — GitHub: Settings → Deploy keys; GitLab: Settings → Repository → Deploy keys; Bitbucket: Repository settings → Access keys; qualquer outro servidor Git com deploy keys (Gitea, Forgejo, GitLab próprio…): as configurações de deploy keys do repositório. Deixe o acesso de escrita desativado.',
            'Selecione "Testar acesso". O Artemis confere se consegue ler a branch; o resultado aparece em alguns segundos. Cada organização pode fazer até 30 testes de acesso por hora.',
            'Com o acesso OK, selecione "Executar análise" para iniciar a primeira análise.',
          ],
        },
        { kind: 'p', text: 'Identidade do servidor: o Artemis só se conecta a um servidor Git cuja chave de host ele confia. GitHub, GitLab e Bitbucket são verificados com as chaves que eles publicam. Para outros servidores, a chave é registrada na primeira vez que você testa o acesso e exibida com a impressão digital — confira se ela corresponde ao seu servidor; as conexões seguintes precisam apresentar a mesma chave.' },
        { kind: 'p', text: '"Trocar chave" gera uma nova chave e apaga a antiga na hora: adicione a nova chave pública ao repositório e remova a antiga. Remover o repositório também apaga a chave dele (mantendo ou não o histórico).' },
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
            'Triagem com IA: quando os administradores do Artemis habilitaram a IA para sua organização, "Explicar com IA" escreve uma explicação curta do achado — impacto, quando pode ser explorado, prioridade e correção — marcada como "Gerado por IA" (revise antes de agir: a IA pode cometer erros). Nunca é automática e exige a permissão “Triar achados”; leitores veem as explicações já feitas. O resultado fica salvo para a organização e é reutilizado para o mesmo CVE na mesma versão do pacote (ou a mesma regra) em qualquer repositório, então pedir de novo não custa nada. Ela é escrita no idioma padrão da organização. Só identificadores públicos e dados do scanner são enviados ao provedor de IA (CVE ou id da regra, título e descrição — nenhum dos dois para segredos —, severidade, CVSS, CWE, pacote e versões) e a stack do repositório; nunca código, caminhos de arquivo, valores de segredos ou nomes de repositórios. Até 50 novas explicações por organização por dia; toda tentativa conta, inclusive as que falham. Se a IA estiver ocupada, tente de novo em um minuto. Com a IA habilitada, o cartão mostra “Sua organização tem permissão para usar a triagem com IA.”; sem ela, o cartão aparece bloqueado.',
            'Referências (NVD, registro do pacote, CWE) e uma linha do tempo do que aconteceu com o achado.',
          ],
        },
        { kind: 'p', text: 'Use "Alterar status" para marcar o achado como triado, como falso positivo, aceitar o risco ou reabri-lo. A alteração vale para todos os repositórios afetados, é salva imediatamente e registrada na linha do tempo. Um achado marcado como falso positivo, com risco aceito ou corrigido só pode ser reaberto. "Corrigido" é definido automaticamente quando uma análise não detecta mais o problema. Aceitar um risco pede uma justificativa e uma data de expiração e cria uma aceitação de risco (veja Políticas); o quadro de status também mostra o prazo de correção definido pelo SLA.' },
        { kind: 'p', text: 'Para alterar vários achados de uma vez, selecione Selecionar na lista de Vulnerabilidades, marque os achados (ou a caixa do cabeçalho para todos os da página atual; a seleção é mantida ao trocar de página) e escolha o novo status. Cada botão mostra quantos dos achados selecionados podem receber aquele status; os demais ficam como estão. Aceitar o risco pede uma justificativa e uma data de expiração para todos. É necessária a permissão “Triar achados”.' },
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
        { kind: 'p', text: 'Quando a etapa de geração de SBOM rodou, selecione "Baixar SBOM (CycloneDX JSON)" abaixo dela para salvar a lista de materiais de software daquela análise (em um monorepo, uma por pasta analisada, identificada pela pasta e pelo número de componentes). SBOMs maiores que 20 MB não são guardados (o log da etapa avisa). O SBOM fica guardado até a execução, o histórico do repositório ou a organização ser excluído; execuções antigas não têm SBOM.' },
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
            ['Resumo de segurança', 'Visão dos achados novos, corrigidos e abertos no período, com os principais riscos e o que corrigir primeiro.'],
            ['Conformidade', 'Os mesmos números organizados por categoria do OWASP Top 10 (2021), útil para auditorias.'],
          ],
        },
        { kind: 'p', text: 'Para solicitar um relatório, selecione "Gerar relatório", escolha o tipo, o escopo (a organização inteira ou um repositório) e o período (a última semana, mês ou trimestre completo), e selecione "Gerar". Gerar relatórios exige um papel que possa fazer a triagem de achados. O relatório aparece na lista como "Gerando" e normalmente fica "Pronto" em poucos segundos; a lista se atualiza sozinha. Se aparecer "Falhou", selecione "Tentar novamente". Uma organização pode ter até 3 relatórios sendo gerados ao mesmo tempo; espere um terminar antes de pedir outro.' },
        { kind: 'p', text: 'Os números vêm dos seus achados: novos são os detectados pela primeira vez no período e corrigidos os corrigidos nele; contagens de abertos, severidades, principais riscos e o mapeamento OWASP descrevem os achados abertos agora, sem os repositórios removidos. Vulnerabilidades de dependências contam em A06 (Componentes Vulneráveis e Desatualizados), segredos expostos em A07, achados de código e configuração pelo CWE; o restante aparece como "Outros".' },
        { kind: 'p', text: 'Resumos escritos por IA: quando os administradores do Artemis habilitam a IA para sua organização (mediante solicitação), o resumo executivo e as recomendações dos novos relatórios são escritos por IA (Anthropic Claude) e marcados como "Gerado por IA". Eles são escritos apenas no idioma padrão da organização (Configurações → Geral); quem usa o outro idioma os vê nesse idioma, com um aviso. Só são enviados dados agregados e desidentificados: contagens, indicadores, categorias OWASP e os principais riscos descritos por CVE ou id da regra, título (exceto para segredos), severidade, CVSS, CWE, nome do pacote, versões instalada e corrigida, e idade. Código-fonte, caminhos de arquivos, valores de segredos, nomes de repositórios e da organização, pessoas e logs nunca são enviados. A IA pode cometer erros: revise o texto antes de compartilhar. Se o serviço de IA estiver indisponível, ou depois de 10 tentativas com IA no dia (toda tentativa conta, inclusive as que falham), o resumo padrão é usado e o relatório informa isso. Sem IA, o Artemis escreve o resumo e as recomendações a partir de modelos.' },
        { kind: 'p', text: 'Um relatório contém:' },
        {
          kind: 'ul',
          items: [
            'Resumo executivo: uma visão curta e não técnica para gestores.',
            'Indicadores: achados novos, corrigidos e ainda abertos, tempo médio de correção e o percentual de achados corrigidos dentro do SLA.',
            'Tendência de achados: achados novos e corrigidos por semana. Passe o mouse sobre o gráfico (ou foque nele e use as setas) para ver cada semana; "Mostrar tabela de dados" lista os mesmos valores.',
            'Achados abertos por severidade, principais riscos (achados críticos e altos abertos, com o pacote e a versão que os corrige), mapeamento OWASP Top 10 e recomendações priorizadas.',
          ],
        },
        { kind: 'p', text: 'Os textos do relatório seguem o idioma selecionado na barra superior. Selecione "Exportar PDF" para imprimir ou salvar o relatório em PDF, ou "Copiar link" para compartilhá-lo com alguém que tenha acesso ao Artemis.' },
      ],
    },

    {
      id: 'policies',
      title: 'Políticas',
      blocks: [
        { kind: 'p', text: 'Políticas são regras da organização que o Artemis aplica a todos os repositórios. Os papéis que gerenciam pipelines (proprietário, administrador, analista de segurança) as editam; os papéis que fazem triagem gerenciam as aceitações de risco.' },
        {
          kind: 'ul',
          items: [
            'Critérios do pipeline: o critério de falha mínimo de cada etapa. Um repositório pode escolher um critério mais rígido, mas não mais permissivo — as opções mais permissivas ficam desativadas no editor de pipeline, e as execuções sempre usam o mais rígido dos dois. Marque uma etapa como “Obrigatória” para rodá-la em todos os repositórios: ela mostra “Obrigatória pela política da organização” e não pode ser desligada.',
            'SLA de correção: o número máximo de dias (de 1 a 365) para corrigir um achado de cada severidade, contado a partir da primeira detecção. Achados abertos e triados mostram “Vence em N dias” ou “Atrasado” em Vulnerabilidades, a página do achado mostra a data e o painel conta os achados fora do prazo.',
            'Política de licenças: licenças permitidas ou proibidas (identificadores SPDX como MPL-2.0, sem diferenciar maiúsculas). A etapa de Conformidade de licenças ignora as permitidas, reporta as proibidas com severidade alta e qualquer outra licença restritiva como média, para revisão; a etapa falha conforme o seu critério. Uma licença não pode ser permitida e proibida ao mesmo tempo.',
            'Aceitações de risco: achados aceitos como riscos conhecidos, com justificativa (pelo menos 10 caracteres) e data de expiração (no máximo um ano). Aceite um risco a partir do achado (“Aceitar risco”) ou aqui com “Aceitar um risco”, usando a referência do achado (F-1101) ou uma CVE, que aceita todos os achados abertos dessa CVE no repositório. Achados aceitos nunca falham pipelines. Quando a data passa, o achado é reaberto automaticamente; “Revogar” o reabre na hora, e reabrir um achado aceito remove a sua aceitação.',
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
        { kind: 'p', text: 'A página Integrações lista os dados de vulnerabilidades que o Artemis usa e as deploy keys SSH dos seus repositórios.' },
        { kind: 'p', text: 'A integração com o NIST NVD está sempre ativa e não pode ser desconectada: ela fornece os registros de CVE e as pontuações CVSS. O card mostra a última sincronização.' },
        { kind: 'p', text: 'Em Dados de vulnerabilidades, um cartão por fonte lista todas as bases e conjuntos de regras usados pelos scanners (NVD, GitHub Advisory Database, rastreadores de distribuições Linux, as bases do Trivy e do Grype, regras de configuração e de licenças, Gitleaks e as regras de código do próprio Artemis), o que cada uma fornece e qual etapa a utiliza. As bases são baixadas e consultadas localmente; seu código nunca é enviado a elas.' },
        { kind: 'p', text: 'Em "Deploy keys SSH" você vê todas as chaves que o Artemis gerou para clonar seus repositórios (cada repositório tem a sua), com impressão digital, repositório e último uso. As chaves são criadas e trocadas na aba Deploy Key de cada repositório; selecione o repositório para abri-la. "Revogar" apaga uma chave (as análises desse repositório falham até uma nova chave ser gerada) — remova-a também do repositório no seu provedor Git.' },
        { kind: 'note', text: 'Chaves marcadas como "Só chave pública" foram adicionadas antes de o Artemis gerar chaves. O Artemis não tem a chave privada delas, então nunca são usadas para clonar; gere uma chave na aba Deploy Key do repositório.' },
      ],
    },
    {
      id: 'team',
      title: 'Equipe e papéis',
      blocks: [
        { kind: 'p', text: 'A página Equipe lista todos os membros da organização com papel, última atividade e status. Proprietários e administradores mudam o papel de um membro escolhendo um novo na coluna Papel. Ninguém pode mudar o próprio papel, e o papel de proprietário nunca é atribuído ali: o proprietário seleciona "Tornar proprietário" ao lado de um membro ativo para transferir a propriedade, passando a ser administrador.' },
        { kind: 'p', text: 'Proprietários e administradores podem mudar o papel de um membro a qualquer momento pelo seletor de papel na lista de membros, ou remover o membro com “Remover”. Só o proprietário gerencia administradores: administradores podem mudar e remover analistas, desenvolvedores e leitores, mas não podem promover ninguém a administrador, mudar o papel de outro administrador nem remover um administrador. Sempre há exatamente um proprietário; para passar a organização adiante, o proprietário usa Configurações → Zona de perigo → “Transferir propriedade” e passa a ser administrador. Ninguém pode mudar o próprio papel nem se remover (use “Sair da organização” em Configurações).' },
        { kind: 'p', text: 'Para adicionar alguém, selecione "Convidar membro", informe o e-mail e escolha um papel. Um endereço que já pertence a um membro ou já tem convite pendente é recusado. Em seguida o Artemis mostra um link de convite de uso único — copie-o e envie você mesmo para a pessoa (o Artemis ainda não envia convites por e-mail). O link só aparece uma vez, funciona uma vez e expira em 7 dias; a pessoa vê a organização e o papel e confirma antes de entrar. "Novo link" gera um link novo (o antigo deixa de funcionar) e "Revogar" cancela o convite.' },
        {
          kind: 'table',
          head: ['Papel', 'Indicado para'],
          rows: [
            ['Proprietário', 'Acesso total, incluindo transferir a propriedade e excluir a organização. Um por organização.'],
            ['Administrador', 'Gerencia repositórios, pipelines, integrações e a equipe.'],
            ['Analista de segurança', 'Faz a triagem de achados e configura pipelines.'],
            ['Desenvolvedor', 'Vê e faz a triagem de achados nos seus repositórios.'],
            ['Leitor', 'Acesso somente leitura a achados e relatórios.'],
          ],
        },
        { kind: 'p', text: 'A tabela "Papéis e permissões", no fim da página, mostra exatamente o que cada papel pode fazer nesta organização, e o Artemis aplica essas regras em todas as requisições. Proprietários e administradores podem alterá-la: clique em uma célula para alternar entre ✓ (permitido) e – (não permitido) e selecione "Salvar permissões"; a mudança vale para todos com aquele papel na próxima ação. Administradores podem alterar analistas, desenvolvedores e leitores, mas só o proprietário altera as permissões de administrador. Algumas células são fixas: o proprietário sempre tem todas as permissões, todo papel pode ver os achados e “Propriedade e exclusão” (transferir a propriedade, excluir a organização) fica com o proprietário. Organizações novas começam com estes padrões:' },
        {
          kind: 'table',
          head: ['Permissão', 'O que permite', 'Papéis'],
          rows: [
            ['Ver achados e relatórios', 'Ver todas as páginas da organização', 'Todos os papéis'],
            ['Triar achados', 'Mudar o status de achados, gerenciar aceites de risco, gerar relatórios', 'Proprietário, Administrador, Analista de segurança, Desenvolvedor'],
            ['Configurar pipelines', 'Adicionar repositórios, executar e cancelar análises, testar o acesso a repositórios, editar configurações de repositórios, pipelines e políticas', 'Proprietário, Administrador, Analista de segurança'],
            ['Gerenciar integrações', 'Integrações, gerar, trocar e revogar deploy keys', 'Proprietário, Administrador'],
            ['Gerenciar equipe', 'Convites, papéis e configurações da organização', 'Proprietário, Administrador'],
            ['Propriedade e exclusão', 'Transferir a propriedade, excluir a organização', 'Proprietário'],
          ],
        },
        { kind: 'p', text: 'Quando o seu papel não permite algo, os controles aparecem desativados com um cadeado e uma breve explicação, em vez de ficarem ocultos. Peça a um proprietário ou administrador se precisar de mais acesso.' },
      ],
    },
    {
      id: 'settings',
      title: 'Configurações da organização',
      blocks: [
        { kind: 'p', text: 'Configurações, na barra lateral, reúne opções que valem para toda a organização, em duas abas:' },
        {
          kind: 'ul',
          items: [
            'Geral: nome da organização, idioma padrão e fuso horário. A URL é sempre gerada a partir do nome e aparece somente para leitura. Renomear a organização é um recurso opcional que os administradores do Artemis habilitam por organização (até lá o nome fica bloqueado); depois de habilitado, o campo mostra “Sua organização tem permissão para se renomear.” Renomear também muda a URL, então a página vai para o novo endereço e links antigos deixam de funcionar. Cada membro ainda pode escolher o próprio idioma na barra superior.',
            'Zona de perigo: membros que não são o proprietário podem sair da organização. O proprietário pode excluí-la digitando o nome exato — isso apaga permanentemente todos os repositórios, achados, execuções de pipeline, relatórios, políticas, integrações e vínculos de membros, sem possibilidade de desfazer.',
          ],
        },
        { kind: 'p', text: 'Na aba Geral, selecione "Salvar alterações" para aplicar. A zona de perigo tem efeito imediato. Somente proprietários e administradores podem alterar as configurações; os demais papéis as veem somente para leitura.' },
      ],
    },

    {
      id: 'usage',
      title: 'Uso e recursos opcionais',
      blocks: [
        { kind: 'p', text: 'O Artemis é gratuito: não há planos, preços nem pagamentos. Configuração → Uso mostra quantas análises sua organização executou neste mês, o limite e quando o contador recomeça, e quais recursos opcionais estão habilitados para ela.' },
        { kind: 'p', text: 'Cada organização pode executar 25 análises por mês do calendário (UTC). Cada execução de pipeline conta como uma análise — manuais, agendadas, primeiras análises e reexecuções; execuções que terminam antes de qualquer etapa rodar (verificação de acesso ou clone com falha, cancelada na fila, runner interrompido) não contam. O uso também aparece no rodapé da barra lateral e na página inicial; ao atingir o limite, novas execuções são recusadas até o mês seguinte.' },
        {
          kind: 'table',
          head: ['Recurso opcional', 'O que faz'],
          rows: [
            ['Análises agendadas', 'Analisar repositórios automaticamente a cada 6 horas, 24 horas ou 7 dias.'],
            ['Renomear a organização', 'Renomear a organização; a URL também muda.'],
            ['Triagem com IA', 'Explicações de achados por IA (mediante solicitação, na página do achado) e resumos de relatórios escritos por IA.'],
          ],
        },
        { kind: 'note', text: 'Os recursos opcionais são habilitados por organização pelos administradores do Artemis — as pessoas que operam esta instância do Artemis, não o proprietário nem os administradores da sua organização. Controles bloqueados mostram “Disponível mediante solicitação”: peça aos administradores do Artemis para habilitar o recurso. Recursos habilitados mostram uma nota curta, como “Sua organização tem permissão para usar análises agendadas.”' },
      ],
    },
    {
      id: 'platform-admin',
      title: 'Administração da plataforma',
      blocks: [
        { kind: 'p', text: 'Os administradores do Artemis (um papel atribuído no provedor de identidade, sem relação com o papel Administrador de uma organização) abrem a Administração da plataforma pela barra superior ou pela página inicial. Ela lista todas as organizações — nome, URL, proprietário, número de membros e de repositórios, data de criação — com uma caixa de busca e um interruptor por recurso opcional; cada mudança é salva na hora.' },
        { kind: 'p', text: 'Abrir (ao lado de cada organização) mostra as páginas da organização — painel, vulnerabilidades, repositórios, execuções de pipeline, relatórios, políticas, equipe, configurações — em modo somente leitura, com as permissões de um leitor. Um aviso informa que você está vendo como administrador do Artemis, a etiqueta de papel mostra “Leitor · Administrador” e a organização aparece no seletor da barra lateral, marcada como “Somente leitura”, enquanto estiver aberta. Todos os controles que alteram algo ficam bloqueados, e os e-mails dos membros continuam ocultos. Se você também for membro da organização, vale o seu próprio papel.' },
        { kind: 'p', text: 'Excluir remove a organização permanentemente com tudo o que há nela: repositórios, deploy keys, achados, execuções de pipeline, relatórios, políticas, membros, convites e configurações. Para confirmar, digite o nome de URL da organização na caixa de diálogo. Não é possível desfazer.' },
        { kind: 'p', text: 'A aba Usuários lista todas as contas desta instância do Artemis — nome, nome de usuário, e-mail, data de criação e uma etiqueta “Administrador” para os administradores do Artemis — com as organizações de cada uma como etiquetas “acme · Proprietário” (selecione uma para abrir aquela organização em modo somente leitura). Busque por nome, nome de usuário ou e-mail. Excluir remove a conta permanentemente: a pessoa é desconectada de todos os lugares e removida de todas as organizações, e pode se cadastrar novamente depois, como uma nova conta; os convites que ela enviou permanecem. Para confirmar, digite o nome de usuário. Excluir fica desabilitado, com o motivo, para a sua própria conta, para outros administradores do Artemis (remova primeiro o papel deles no provedor de identidade) e para proprietários de organizações (exclua essas organizações ou transfira a propriedade primeiro). Se a página disser “O gerenciamento de usuários não está configurado”, a API ainda não tem acesso ao diretório de usuários do provedor de identidade; as organizações continuam funcionando.' },
        { kind: 'note', text: 'Os administradores do Artemis podem ver as organizações, habilitar recursos opcionais e excluir organizações e contas, mas não podem alterar nada dentro de uma organização, e o papel não os torna membros de nenhuma organização.' },
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
            ['SBOM', 'Software Bill of Materials: inventário dos componentes de um build.'],
            ['IaC', 'Infrastructure as Code: infraestrutura definida em arquivos como Terraform.'],
            ['OIDC', 'OpenID Connect: protocolo de login único usado na autenticação.'],
          ],
        },
      ],
    },
  ],
};
