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
        { kind: 'p', text: 'To sign in, choose "Sign in with SSO" and authenticate with your organization account. Authentication is handled by your identity provider through OpenID Connect; Artemis never stores your password.' },
        { kind: 'p', text: 'The interface is organized as follows:' },
        {
          kind: 'ul',
          items: [
            'Sidebar: navigation grouped into Overview, Security and Configuration. Badges show the number of open vulnerabilities and connected repositories.',
            'New project button: starts the flow to connect a new repository.',
            'Bottom of the sidebar: scans used this month against your plan limit, this help page and the current organization.',
            'Top bar: language selector (English or Portuguese), light/dark theme toggle and sign out. Language and theme are remembered in your browser.',
          ],
        },
        { kind: 'p', text: 'Artemis adapts to your screen. On smaller laptop screens the sidebar shows icons only; hover over an icon to see its name. On tablets and phones the sidebar is hidden: open it with the menu button at the top left and close it with the X button, the Escape key or by tapping outside it.' },
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
        { kind: 'p', text: '"Findings by severity" breaks the open findings down by severity. "Recent vulnerabilities" lists the latest findings; select a CVE identifier to open its record on the NIST website.' },
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
            ['False positive', 'Reviewed (manually or by AI triage) and dismissed.'],
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
            'Detection: Artemis identifies the project stack. Supported stacks are React, Angular and Java + Spring.',
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
            'AI triage: when enabled, findings are reviewed automatically to flag likely false positives and to generate reports.',
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
    // (help section for this area goes here)

    // --- pipeline runs ---
    // (help section for this area goes here)

    // --- reports + policies ---
    // (help section for this area goes here)

    // --- integrations + team + settings ---
    {
      id: 'integrations',
      title: 'Integrations',
      blocks: [
        { kind: 'p', text: 'The Integrations page connects Artemis to the tools your team already uses. Integrations are grouped by category: source control, CI/CD, notifications, issue tracking and vulnerability data.' },
        {
          kind: 'ul',
          items: [
            'Connected (green): the integration is active. Use "Configure" to change its options or "Disconnect" to remove it.',
            'Not connected: select "Connect" to authorize Artemis in the external tool.',
            'Connection error (red): the credentials expired or were revoked. Select "Reconnect" to authorize again.',
          ],
        },
        { kind: 'p', text: 'The NIST NVD integration is always active: it provides CVE records and CVSS scores. Its card shows the last synchronization and whether the API key is valid.' },
        { kind: 'p', text: 'Under "SSH deploy keys" you can see every key Artemis uses to clone repositories, with its fingerprint, repository and last use. Select "Add key" to register a new public key for a repository, or "Revoke" to remove a key you no longer need. Also remove the key from the repository on your Git provider.' },
      ],
    },
    {
      id: 'team',
      title: 'Team and roles',
      blocks: [
        { kind: 'p', text: 'The Team page lists every member of the organization with their role, last activity and status. To change a member\'s role, pick a new one in the Role column. The owner role cannot be changed there; only the owner can transfer ownership.' },
        { kind: 'p', text: 'To add someone, select "Invite member", enter their e-mail and choose a role. Pending invitations appear in their own list, where you can resend or revoke them.' },
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
            'Authentication: the OpenID Connect identity provider (Authelia), issuer URL, client ID and session timeout. The client secret is never displayed. Turn on "Enforce single sign-on" so members can only sign in through the identity provider.',
            'Notifications: choose which events (new critical CVE, pipeline failed, weekly report, SLA breached) are sent to each channel (e-mail, Slack, Microsoft Teams).',
            'API tokens: tokens let scripts and CI jobs call the Artemis API. Select "Create token", give it a name, an expiration and scopes. The token is shown only once: copy it before selecting "Done". Revoke tokens you no longer use.',
            'Data retention: how long findings history, pipeline logs and reports are kept. Older data is deleted permanently.',
            'Danger zone: delete the organization. To confirm, type the organization name exactly.',
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
        { kind: 'p', text: 'Para entrar, escolha "Entrar com SSO" e autentique-se com a conta da sua organização. A autenticação é feita pelo seu provedor de identidade via OpenID Connect; o Artemis nunca armazena sua senha.' },
        { kind: 'p', text: 'A interface está organizada assim:' },
        {
          kind: 'ul',
          items: [
            'Barra lateral: navegação agrupada em Visão geral, Segurança e Configuração. Os indicadores mostram a quantidade de vulnerabilidades abertas e de repositórios conectados.',
            'Botão Novo projeto: inicia o fluxo para conectar um novo repositório.',
            'Rodapé da barra lateral: análises usadas no mês em relação ao limite do plano, esta página de ajuda e a organização atual.',
            'Barra superior: seletor de idioma (inglês ou português), alternância entre tema claro e escuro e sair. Idioma e tema ficam salvos no seu navegador.',
          ],
        },
        { kind: 'p', text: 'O Artemis se adapta à sua tela. Em notebooks com telas menores a barra lateral mostra apenas ícones; passe o mouse sobre um ícone para ver o nome. Em tablets e celulares a barra lateral fica oculta: abra-a pelo botão de menu no canto superior esquerdo e feche pelo botão X, pela tecla Esc ou tocando fora dela.' },
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
        { kind: 'p', text: '"Achados por severidade" divide os achados abertos por severidade. "Vulnerabilidades recentes" lista os achados mais novos; selecione o identificador de uma CVE para abrir o registro no site do NIST.' },
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
            ['Falso positivo', 'Revisado (manualmente ou pela triagem com IA) e descartado.'],
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
            'Detecção: o Artemis identifica a stack do projeto. As stacks suportadas são React, Angular e Java + Spring.',
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
            'Triagem com IA: quando ativada, os achados são revisados automaticamente para sinalizar prováveis falsos positivos e gerar relatórios.',
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
    // (help section for this area goes here)

    // --- pipeline runs ---
    // (help section for this area goes here)

    // --- reports + policies ---
    // (help section for this area goes here)

    // --- integrations + team + settings ---
    {
      id: 'integrations',
      title: 'Integrações',
      blocks: [
        { kind: 'p', text: 'A página Integrações conecta o Artemis às ferramentas que sua equipe já usa. As integrações são agrupadas por categoria: controle de versão, CI/CD, notificações, gestão de issues e dados de vulnerabilidades.' },
        {
          kind: 'ul',
          items: [
            'Conectado (verde): a integração está ativa. Use "Configurar" para alterar as opções ou "Desconectar" para removê-la.',
            'Não conectado: selecione "Conectar" para autorizar o Artemis na ferramenta externa.',
            'Erro de conexão (vermelho): as credenciais expiraram ou foram revogadas. Selecione "Reconectar" para autorizar novamente.',
          ],
        },
        { kind: 'p', text: 'A integração com o NIST NVD está sempre ativa: ela fornece os registros de CVE e as pontuações CVSS. O card mostra a última sincronização e se a chave de API é válida.' },
        { kind: 'p', text: 'Em "Deploy keys SSH" você vê todas as chaves que o Artemis usa para clonar repositórios, com impressão digital, repositório e último uso. Selecione "Adicionar chave" para registrar uma nova chave pública para um repositório, ou "Revogar" para remover uma chave que não é mais necessária. Remova a chave também do repositório no seu provedor Git.' },
      ],
    },
    {
      id: 'team',
      title: 'Equipe e papéis',
      blocks: [
        { kind: 'p', text: 'A página Equipe lista todos os membros da organização com papel, última atividade e status. Para mudar o papel de um membro, escolha um novo na coluna Papel. O papel de proprietário não pode ser alterado ali; somente o proprietário pode transferir a propriedade.' },
        { kind: 'p', text: 'Para adicionar alguém, selecione "Convidar membro", informe o e-mail e escolha um papel. Os convites pendentes aparecem em uma lista própria, onde podem ser reenviados ou revogados.' },
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
            'Autenticação: provedor de identidade OpenID Connect (Authelia), URL do emissor, client ID e tempo limite da sessão. O client secret nunca é exibido. Ative "Exigir login único (SSO)" para que os membros só entrem pelo provedor de identidade.',
            'Notificações: escolha quais eventos (nova CVE crítica, pipeline falhou, relatório semanal, SLA excedido) são enviados para cada canal (e-mail, Slack, Microsoft Teams).',
            'Tokens de API: tokens permitem que scripts e jobs de CI chamem a API do Artemis. Selecione "Criar token" e informe nome, validade e escopos. O token é exibido uma única vez: copie-o antes de selecionar "Concluir". Revogue tokens que não usa mais.',
            'Retenção de dados: por quanto tempo o histórico de achados, os logs de pipeline e os relatórios são mantidos. Dados mais antigos são excluídos permanentemente.',
            'Zona de perigo: excluir a organização. Para confirmar, digite o nome da organização exatamente.',
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
