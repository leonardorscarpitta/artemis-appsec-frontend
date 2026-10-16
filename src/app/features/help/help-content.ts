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
        { kind: 'p', text: 'The home page presents the product, how it works and answers to common questions. Select "Sign in" or "Get started" to open the sign-in screen. This guide is also available without signing in, from "Documentation" on the home page. The Privacy Policy and Terms of Use are linked in the footer of the home and sign-in pages: Artemis never sells or shares information about you or your organization.' },
        { kind: 'p', text: 'To sign in, choose "Sign in with SSO". You are taken to your organization\'s sign-in page (Authelia), and after entering your username and password you return to the page you were trying to open. Authentication uses OpenID Connect; Artemis never sees or stores your password.' },
        { kind: 'p', text: 'Your name appears in the top bar while you are signed in; select it to open your account page at the sign-in service (password and two-factor settings). The session is shared by all tabs of the browser, and the home page shows you as signed in with a "Go to dashboard" button, plus a "Your workspace" section with your organization (your role, members and open findings) and shortcuts to each of your projects. If the session expires you are asked to sign in again. "Sign out" ends your Artemis session — the sign-in page may still remember you, so you can return without typing your password again.' },
        { kind: 'p', text: 'The interface is organized as follows:' },
        {
          kind: 'ul',
          items: [
            'Sidebar: navigation grouped into Overview, Security and Configuration. Badges show the number of open vulnerabilities and connected repositories.',
            'New project button: starts the flow to connect a new repository.',
            'Bottom of the sidebar: scans used this month against your plan limit, this help page and the current organization.',
            'Top bar: language selector (English or Portuguese), light/dark theme toggle and sign out. Language and theme are remembered in your browser.',
            'Addresses: every page lives under your organization, for example /acme/vulnerabilities. Links you share point to the same page for your colleagues.',
          ],
        },
        { kind: 'p', text: 'Artemis adapts to your screen. On smaller laptop screens the sidebar shows icons only; point at it (or move the keyboard focus into it) and it expands to show every name. On tablets and phones the sidebar is hidden: open it with the menu button at the top left and close it with the X button, the Escape key or by tapping outside it.' },
      ],
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      blocks: [
        { kind: 'p', text: 'The dashboard summarizes the security posture of every monitored repository.' },
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
        { kind: 'p', text: 'Select "New project" in the sidebar and complete the five steps:' },
        {
          kind: 'ol',
          items: [
            'SSH key: paste the public part of an ed25519 or RSA key, or let Artemis generate one. Add it to your repository as a read-only deploy key. Never paste a private key.',
            'Repository: enter the SSH URL (for example git@github.com:acme/project.git) and the branch to analyze.',
            'Settings: choose the scan schedule, automatic actions, build environment and AI triage (see "Scan settings").',
            'Pipeline: choose which security stages run (see "DevSecOps pipeline").',
            'Stack: select the technology used by the repository — React, Angular or Java + Spring. Automatic detection will be available soon.',
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
            'AI triage: automatic review of findings to flag likely false positives and generate reports. Not available yet — the option is shown locked.',
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
          head: ['Phase', 'Stage', 'What it does'],
          rows: [
            ['Source', 'Secret scanning', 'Finds leaked credentials, tokens and keys in code and commit history.'],
            ['Source', 'Static analysis (SAST)', 'Finds insecure code patterns such as injection or XSS.'],
            ['Source', 'Dependency scanning (SCA)', 'Matches third-party libraries against known CVEs.'],
            ['Source', 'License compliance', 'Flags dependencies with licenses not allowed by your policy.'],
            ['Build', 'Dockerfile audit', 'Checks the Dockerfile for insecure instructions.'],
            ['Build', 'Container image scan', 'Scans the built image for vulnerable OS packages.'],
            ['Build', 'SBOM generation', 'Produces a software bill of materials for each build.'],
            ['Pre-deploy', 'Infrastructure as code', 'Checks Terraform, Kubernetes and Compose files for misconfigurations.'],
            ['Pre-deploy', 'Dynamic analysis (DAST)', 'Tests a running instance of the application in staging.'],
          ],
        },
        { kind: 'p', text: 'For each stage you can:' },
        {
          kind: 'ul',
          items: [
            'Turn it on or off with the switch.',
            'Choose the tool that performs it (for example Gitleaks or TruffleHog for secret scanning).',
            'Choose when it fails the pipeline: never (report only), critical, high or above, medium or above, or any finding. SBOM generation only produces an artifact and never fails the pipeline.',
          ],
        },
        { kind: 'p', text: 'Presets enable a group of stages at once:' },
        {
          kind: 'table',
          head: ['Preset', 'Stages'],
          rows: [
            ['Essential', 'Secret scanning, SAST, SCA'],
            ['Recommended', 'Essential + Dockerfile audit, container image scan, SBOM'],
            ['Complete', 'All stages'],
          ],
        },
        { kind: 'p', text: 'Any manual change shows the preset as "Custom". The summary shows how many stages are enabled and an estimated duration. Under "Pipeline as code" you can view and copy the equivalent configuration for GitHub Actions or GitLab CI.' },
        { kind: 'note', text: 'Tip: start with "Recommended". Add DAST only when you have a staging environment the pipeline can reach.' },
      ],
    },
    {
      id: 'repositories',
      title: 'Managing repositories',
      blocks: [
        { kind: 'p', text: 'The Repositories page lists every connected project with its stack, schedule, number of findings and last scan.' },
        { kind: 'p', text: 'Select "Settings" on a repository to change its configuration at any time:' },
        {
          kind: 'ul',
          items: [
            'General tab: scan schedule, automatic actions, build environment and AI triage.',
            'Pipeline tab: stages, tools, fail thresholds and presets.',
          ],
        },
        { kind: 'p', text: 'Select "Save changes" to apply. Changes take effect from the next pipeline run; "Cancel" discards them.' },
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
            'Filter by severity, status and repository, and sort by CVSS score or detection date. "Clear filters" resets the list.',
            'Select a CVE identifier to open its details.',
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
        { kind: 'p', text: 'Under "SSH deploy keys" you can see every key Artemis uses to clone repositories, with its fingerprint, repository and last use. Select "Add key" to register a new public key for a repository, or "Revoke" to remove a key you no longer need. Also remove the key from the repository on your Git provider.' },
        { kind: 'note', text: 'Paste only the public key (the contents of the .pub file). Artemis accepts ed25519, ECDSA and RSA keys of at least 2048 bits, computes the SHA256 fingerprint itself and rejects private keys and keys already registered for the same repository.' },
      ],
    },
    {
      id: 'team',
      title: 'Team and roles',
      blocks: [
        { kind: 'p', text: 'The Team page lists every member of the organization with their role, last activity and status. To change a member\'s role, pick a new one in the Role column. The owner role cannot be changed there; only the owner can transfer ownership.' },
        { kind: 'p', text: 'To add someone, select "Invite member", enter their e-mail and choose a role. An address that already belongs to a member or has a pending invitation is rejected. Pending invitations appear in their own list, where you can resend or revoke them.' },
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
        { kind: 'p', text: 'The "Roles and permissions" table at the bottom of the page shows exactly what each role can do.' },
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
            'Authentication: the OpenID Connect identity provider (Authelia), issuer URL (must use https), client ID and session timeout. The client secret is never stored or displayed in Artemis: it is managed by your administrators in the deployment secrets, and the page only shows whether it is configured. Turn on "Enforce single sign-on" so members can only sign in through the identity provider.',
            'Notifications: choose which events (new critical CVE, pipeline failed, weekly report, SLA breached) are sent to each channel (e-mail, Slack, Microsoft Teams).',
            'API tokens: tokens let scripts and CI jobs call the Artemis API. Select "Create token", give it a name, an expiration and scopes. The token is shown only once: copy it before selecting "Done". Afterwards the list only shows its prefix and last four characters. Revoke tokens you no longer use.',
            'Data retention: how long findings history, pipeline logs and reports are kept. Older data is deleted permanently.',
            'Danger zone: deleting the organization requires typing its name exactly. Deletion is not available yet; contact support if you need it.',
          ],
        },
        { kind: 'p', text: 'On the General, Authentication, Notifications and Data retention tabs, select "Save changes" to apply. API tokens and the danger zone take effect immediately.' },
        { kind: 'note', text: 'Tip: give API tokens only the scopes they need and the shortest practical expiration.' },
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
        { kind: 'p', text: 'A página inicial apresenta o produto, como ele funciona e respostas a dúvidas comuns. Selecione "Entrar" ou "Começar" para abrir a tela de login. Este guia também está disponível sem login, em "Documentação" na página inicial. A Política de Privacidade e os Termos de Uso estão no rodapé da página inicial e da tela de login: o Artemis nunca vende nem compartilha informações sobre você ou sua organização.' },
        { kind: 'p', text: 'Para entrar, escolha "Entrar com SSO". Você será levado à página de login da sua organização (Authelia) e, depois de informar usuário e senha, voltará para a página que tentava abrir. A autenticação usa OpenID Connect; o Artemis nunca vê nem armazena sua senha.' },
        { kind: 'p', text: 'Seu nome aparece na barra superior enquanto você estiver conectado; selecione-o para abrir sua conta no serviço de login (senha e verificação em duas etapas). A sessão é compartilhada por todas as abas do navegador, e a página inicial mostra você conectado com o botão "Ir para o painel", além da seção "Seu espaço de trabalho" com a sua organização (seu papel, membros e achados abertos) e atalhos para cada um dos seus projetos. Se a sessão expirar, será pedido um novo login. "Sair" encerra sua sessão no Artemis — a página de login pode continuar lembrando de você, permitindo voltar sem digitar a senha novamente.' },
        { kind: 'p', text: 'A interface está organizada assim:' },
        {
          kind: 'ul',
          items: [
            'Barra lateral: navegação agrupada em Visão geral, Segurança e Configuração. Os indicadores mostram a quantidade de vulnerabilidades abertas e de repositórios conectados.',
            'Botão Novo projeto: inicia o fluxo para conectar um novo repositório.',
            'Rodapé da barra lateral: análises usadas no mês em relação ao limite do plano, esta página de ajuda e a organização atual.',
            'Barra superior: seletor de idioma (inglês ou português), alternância entre tema claro e escuro e sair. Idioma e tema ficam salvos no seu navegador.',
            'Endereços: todas as páginas ficam sob a sua organização, por exemplo /acme/vulnerabilities. Links compartilhados levam seus colegas à mesma página.',
          ],
        },
        { kind: 'p', text: 'O Artemis se adapta à sua tela. Em notebooks com telas menores a barra lateral mostra apenas ícones; aponte o mouse para ela (ou mova o foco do teclado até ela) e ela se expande mostrando todos os nomes. Em tablets e celulares a barra lateral fica oculta: abra-a pelo botão de menu no canto superior esquerdo e feche pelo botão X, pela tecla Esc ou tocando fora dela.' },
      ],
    },
    {
      id: 'dashboard',
      title: 'Painel',
      blocks: [
        { kind: 'p', text: 'O painel resume a postura de segurança de todos os repositórios monitorados.' },
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
        { kind: 'p', text: 'Selecione "Novo projeto" na barra lateral e conclua os cinco passos:' },
        {
          kind: 'ol',
          items: [
            'Chave SSH: cole a parte pública de uma chave ed25519 ou RSA, ou deixe o Artemis gerar uma. Adicione-a ao repositório como deploy key somente leitura. Nunca cole uma chave privada.',
            'Repositório: informe a URL SSH (por exemplo git@github.com:acme/projeto.git) e a branch a ser analisada.',
            'Configurações: escolha o agendamento, as ações automáticas, o ambiente de build e a triagem com IA (veja "Configurações da análise").',
            'Pipeline: escolha quais etapas de segurança serão executadas (veja "Pipeline DevSecOps").',
            'Stack: selecione a tecnologia usada pelo repositório — React, Angular ou Java + Spring. A detecção automática estará disponível em breve.',
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
            'Triagem com IA: revisão automática dos achados para sinalizar prováveis falsos positivos e gerar relatórios. Ainda não disponível — a opção aparece bloqueada.',
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
          head: ['Fase', 'Etapa', 'O que faz'],
          rows: [
            ['Código-fonte', 'Varredura de segredos', 'Encontra credenciais, tokens e chaves vazados no código e no histórico.'],
            ['Código-fonte', 'Análise estática (SAST)', 'Encontra padrões de código inseguros, como injeção ou XSS.'],
            ['Código-fonte', 'Análise de dependências (SCA)', 'Compara bibliotecas de terceiros com CVEs conhecidas.'],
            ['Código-fonte', 'Conformidade de licenças', 'Sinaliza dependências com licenças não permitidas pela sua política.'],
            ['Build', 'Auditoria do Dockerfile', 'Verifica o Dockerfile em busca de instruções inseguras.'],
            ['Build', 'Varredura da imagem de contêiner', 'Analisa a imagem gerada em busca de pacotes do SO vulneráveis.'],
            ['Build', 'Geração de SBOM', 'Gera uma lista de materiais de software a cada build.'],
            ['Pré-deploy', 'Infraestrutura como código', 'Verifica arquivos Terraform, Kubernetes e Compose em busca de erros de configuração.'],
            ['Pré-deploy', 'Análise dinâmica (DAST)', 'Testa uma instância da aplicação em execução em homologação.'],
          ],
        },
        { kind: 'p', text: 'Para cada etapa você pode:' },
        {
          kind: 'ul',
          items: [
            'Ativá-la ou desativá-la pelo botão.',
            'Escolher a ferramenta que a executa (por exemplo Gitleaks ou TruffleHog para varredura de segredos).',
            'Escolher quando ela falha o pipeline: nunca (apenas relatório), crítica, alta ou superior, média ou superior, ou qualquer achado. A geração de SBOM apenas produz um artefato e nunca falha o pipeline.',
          ],
        },
        { kind: 'p', text: 'Os modelos ativam um grupo de etapas de uma vez:' },
        {
          kind: 'table',
          head: ['Modelo', 'Etapas'],
          rows: [
            ['Essencial', 'Varredura de segredos, SAST, SCA'],
            ['Recomendado', 'Essencial + auditoria do Dockerfile, varredura da imagem, SBOM'],
            ['Completo', 'Todas as etapas'],
          ],
        },
        { kind: 'p', text: 'Qualquer alteração manual mostra o modelo como "Personalizado". O resumo mostra quantas etapas estão ativas e uma duração estimada. Em "Pipeline como código" você pode ver e copiar a configuração equivalente para GitHub Actions ou GitLab CI.' },
        { kind: 'note', text: 'Dica: comece pelo modelo "Recomendado". Ative o DAST apenas quando houver um ambiente de homologação acessível pelo pipeline.' },
      ],
    },
    {
      id: 'repositories',
      title: 'Gerenciando repositórios',
      blocks: [
        { kind: 'p', text: 'A página Repositórios lista todos os projetos conectados com stack, agendamento, quantidade de achados e última análise.' },
        { kind: 'p', text: 'Selecione "Configurações" em um repositório para alterar sua configuração a qualquer momento:' },
        {
          kind: 'ul',
          items: [
            'Aba Geral: agendamento, ações automáticas, ambiente de build e triagem com IA.',
            'Aba Pipeline: etapas, ferramentas, critérios de falha e modelos.',
          ],
        },
        { kind: 'p', text: 'Selecione "Salvar alterações" para aplicar. As alterações valem a partir da próxima execução do pipeline; "Cancelar" as descarta.' },
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
            'Filtre por severidade, status e repositório, e ordene pela pontuação CVSS ou pela data de detecção. "Limpar filtros" restaura a lista.',
            'Selecione o identificador de uma CVE para abrir seus detalhes.',
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
        { kind: 'p', text: 'Em "Deploy keys SSH" você vê todas as chaves que o Artemis usa para clonar repositórios, com impressão digital, repositório e último uso. Selecione "Adicionar chave" para registrar uma nova chave pública para um repositório, ou "Revogar" para remover uma chave que não é mais necessária. Remova a chave também do repositório no seu provedor Git.' },
        { kind: 'note', text: 'Cole apenas a chave pública (o conteúdo do arquivo .pub). O Artemis aceita chaves ed25519, ECDSA e RSA de pelo menos 2048 bits, calcula a impressão digital SHA256 e rejeita chaves privadas e chaves já cadastradas para o mesmo repositório.' },
      ],
    },
    {
      id: 'team',
      title: 'Equipe e papéis',
      blocks: [
        { kind: 'p', text: 'A página Equipe lista todos os membros da organização com papel, última atividade e status. Para mudar o papel de um membro, escolha um novo na coluna Papel. O papel de proprietário não pode ser alterado ali; somente o proprietário pode transferir a propriedade.' },
        { kind: 'p', text: 'Para adicionar alguém, selecione "Convidar membro", informe o e-mail e escolha um papel. Um endereço que já pertence a um membro ou já tem convite pendente é recusado. Os convites pendentes aparecem em uma lista própria, onde podem ser reenviados ou revogados.' },
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
        { kind: 'p', text: 'A tabela "Papéis e permissões", no fim da página, mostra exatamente o que cada papel pode fazer.' },
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
            'Autenticação: provedor de identidade OpenID Connect (Authelia), URL do emissor (deve usar https), client ID e tempo limite da sessão. O client secret nunca é armazenado nem exibido no Artemis: ele é gerenciado pelos administradores nos segredos da implantação, e a página mostra apenas se está configurado. Ative "Exigir login único (SSO)" para que os membros só entrem pelo provedor de identidade.',
            'Notificações: escolha quais eventos (nova CVE crítica, pipeline falhou, relatório semanal, SLA excedido) são enviados para cada canal (e-mail, Slack, Microsoft Teams).',
            'Tokens de API: tokens permitem que scripts e jobs de CI chamem a API do Artemis. Selecione "Criar token" e informe nome, validade e escopos. O token é exibido uma única vez: copie-o antes de selecionar "Concluir". Depois disso a lista mostra apenas o prefixo e os quatro últimos caracteres. Revogue tokens que não usa mais.',
            'Retenção de dados: por quanto tempo o histórico de achados, os logs de pipeline e os relatórios são mantidos. Dados mais antigos são excluídos permanentemente.',
            'Zona de perigo: excluir a organização exige digitar o nome exato dela. A exclusão ainda não está disponível; fale com o suporte se precisar.',
          ],
        },
        { kind: 'p', text: 'Nas abas Geral, Autenticação, Notificações e Retenção de dados, selecione "Salvar alterações" para aplicar. Tokens de API e a zona de perigo têm efeito imediato.' },
        { kind: 'note', text: 'Dica: dê aos tokens de API apenas os escopos necessários e a menor validade possível.' },
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
