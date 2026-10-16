import { Lang } from '../../core/i18n';

export interface HomeContent {
  nav: { product: string; how: string; pipeline: string; pricing: string; faq: string; signIn: string; cta: string; menu: string };
  pricing: { title: string; lead: string; freeCta: string; note: string };
  hero: { eyebrow: string; title: string; lead: string; primary: string; secondary: string; previewLabel: string };
  facts: { label: string; value: string }[];
  how: { title: string; lead: string; steps: { title: string; text: string }[] };
  features: { title: string; lead: string; items: { title: string; text: string }[] };
  pipeline: { title: string; lead: string; phases: { name: string; stages: string[] }[]; note: string };
  faq: { title: string; items: { q: string; a: string }[] };
  cta: { title: string; lead: string; button: string };
  footer: { tagline: string; powered: string; product: string; resources: string; docs: string; signIn: string; rights: string };
  preview: { open: string; critical: string; avg: string; repos: string; recent: string };
}

export const HOME: Record<Lang, HomeContent> = {
  'en-US': {
    nav: { product: 'Product', how: 'How it works', pipeline: 'Pipeline', pricing: 'Pricing', faq: 'FAQ', signIn: 'Sign in', cta: 'Get started', menu: 'Page sections' },
    hero: {
      eyebrow: 'Application Security Testing',
      title: 'Find and fix vulnerabilities before they reach production',
      lead: 'Artemis connects to your repositories, runs a DevSecOps pipeline you configure and reports every finding scored with CVSS from the NIST National Vulnerability Database.',
      primary: 'Get started',
      secondary: 'See how it works',
      previewLabel: 'Preview of the Artemis security dashboard',
    },
    facts: [
      { label: 'Supported stacks', value: 'React · Angular · Java + Spring' },
      { label: 'Vulnerability data', value: 'NIST NVD' },
      { label: 'Pipeline stages', value: '9 across 3 phases' },
      { label: 'Sign-in', value: 'OpenID Connect' },
    ],
    how: {
      title: 'From repository to report in four steps',
      lead: 'No agents to install. Artemis only needs read access to your code.',
      steps: [
        { title: 'Connect an SSH key', text: 'Add a read-only deploy key so Artemis can clone the repository.' },
        { title: 'Choose a repository', text: 'Point to the SSH URL and branch. The stack is detected automatically.' },
        { title: 'Configure the pipeline', text: 'Pick the security stages, tools and fail thresholds, or start from a preset.' },
        { title: 'Monitor and respond', text: 'Scans run on your schedule; new CVEs open issues, notify maintainers or block merges.' },
      ],
    },
    features: {
      title: 'Everything your security program needs',
      lead: 'Built for engineering teams that want security checks without slowing delivery.',
      items: [
        { title: 'Static and dependency analysis', text: 'SAST, SCA, secret scanning and license compliance on every push.' },
        { title: 'Configurable DevSecOps pipeline', text: 'Turn stages on or off, choose the tool and decide what fails the build.' },
        { title: 'CVSS-based dashboard', text: 'One view of open findings by severity across all repositories.' },
        { title: 'AI triage', text: 'Optional review that flags likely false positives and writes reports.' },
        { title: 'Automated response', text: 'Open issues, e-mail maintainers or block merge requests on new critical CVEs.' },
        { title: 'Pipeline as code', text: 'Export the configuration to GitHub Actions or GitLab CI.' },
      ],
    },
    pipeline: {
      title: 'Security at every phase of delivery',
      lead: 'Stages run in order and stop the pipeline only when your policy says so.',
      phases: [
        { name: 'Source', stages: ['Secret scanning', 'Static analysis (SAST)', 'Dependency scanning (SCA)', 'License compliance'] },
        { name: 'Build', stages: ['Dockerfile audit', 'Container image scan', 'SBOM generation'] },
        { name: 'Pre-deploy', stages: ['Infrastructure as code', 'Dynamic analysis (DAST)'] },
      ],
      note: 'Bring your own Dockerfile — it is audited before use — or use the one recommended for your stack.',
    },
    pricing: {
      title: 'Simple pricing',
      lead: 'Start for free. Upgrade when you want AI to help triage findings.',
      freeCta: 'Get started for free',
      note: 'Prices in Brazilian reais (BRL), billed monthly. Paid plans are not available yet — nothing is charged.',
    },
    faq: {
      title: 'Frequently asked questions',
      items: [
        { q: 'Which technologies are supported?', a: 'React and Angular front ends and Java + Spring back ends. Artemis detects the stack automatically when you connect a repository.' },
        { q: 'What access does Artemis need to my code?', a: 'A read-only SSH deploy key for each repository. You never share a private key with Artemis.' },
        { q: 'How do I get started?', a: 'Create an account with your e-mail address and confirm it from the message we send. Then create an organization — you become its owner, on the Free plan — or accept an invitation to join an existing one.' },
        { q: 'How does my team work together?', a: 'Invite colleagues by e-mail and give each one a role — owner, admin, security analyst, developer or viewer. Every person can belong to several organizations, and each organization’s data is kept separate.' },
        { q: 'How do users sign in?', a: 'With an Artemis account (OpenID Connect, with a strong password policy and optional two-factor authentication). Artemis itself never sees or stores your password.' },
        { q: 'Where does vulnerability data come from?', a: 'Findings are matched to CVE records and CVSS scores from the NIST National Vulnerability Database.' },
        { q: 'Can the AI triage be turned off?', a: 'Yes. AI triage is optional and can be enabled or disabled per repository.' },
      ],
    },
    cta: {
      title: 'Start securing your repositories',
      lead: 'Connect your first project in a few minutes.',
      button: 'Get started',
    },
    footer: {
      tagline: 'Continuous application security testing.',
      powered: 'Powered by open-source tools — Gitleaks, Semgrep CE, Trivy, Grype, Syft and Hadolint — running on our own infrastructure.',
      product: 'Product',
      resources: 'Resources',
      docs: 'Documentation',
      signIn: 'Sign in',
      rights: 'All rights reserved.',
    },
    preview: { open: 'Open findings', critical: 'Critical', avg: 'Avg. CVSS', repos: 'Repositories', recent: 'Recent vulnerabilities' },
  },
  'pt-BR': {
    nav: { product: 'Produto', how: 'Como funciona', pipeline: 'Pipeline', pricing: 'Preços', faq: 'Dúvidas', signIn: 'Entrar', cta: 'Começar', menu: 'Seções da página' },
    hero: {
      eyebrow: 'Testes de Segurança de Aplicações',
      title: 'Encontre e corrija vulnerabilidades antes que cheguem à produção',
      lead: 'O Artemis se conecta aos seus repositórios, executa um pipeline DevSecOps configurado por você e reporta cada achado com pontuação CVSS da National Vulnerability Database do NIST.',
      primary: 'Começar',
      secondary: 'Veja como funciona',
      previewLabel: 'Prévia do painel de segurança do Artemis',
    },
    facts: [
      { label: 'Stacks suportadas', value: 'React · Angular · Java + Spring' },
      { label: 'Dados de vulnerabilidades', value: 'NIST NVD' },
      { label: 'Etapas de pipeline', value: '9 em 3 fases' },
      { label: 'Login', value: 'OpenID Connect' },
    ],
    how: {
      title: 'Do repositório ao relatório em quatro passos',
      lead: 'Nenhum agente para instalar. O Artemis só precisa de acesso de leitura ao seu código.',
      steps: [
        { title: 'Conecte uma chave SSH', text: 'Adicione uma deploy key somente leitura para o Artemis clonar o repositório.' },
        { title: 'Escolha um repositório', text: 'Informe a URL SSH e a branch. A stack é detectada automaticamente.' },
        { title: 'Configure o pipeline', text: 'Escolha etapas de segurança, ferramentas e critérios de falha, ou comece por um modelo.' },
        { title: 'Monitore e responda', text: 'As análises rodam no seu agendamento; novas CVEs abrem issues, notificam mantenedores ou bloqueiam merges.' },
      ],
    },
    features: {
      title: 'Tudo o que o seu programa de segurança precisa',
      lead: 'Feito para equipes de engenharia que querem segurança sem atrasar as entregas.',
      items: [
        { title: 'Análise estática e de dependências', text: 'SAST, SCA, varredura de segredos e conformidade de licenças a cada push.' },
        { title: 'Pipeline DevSecOps configurável', text: 'Ative ou desative etapas, escolha a ferramenta e defina o que falha o build.' },
        { title: 'Painel baseado em CVSS', text: 'Uma visão dos achados abertos por severidade em todos os repositórios.' },
        { title: 'Triagem com IA', text: 'Revisão opcional que sinaliza prováveis falsos positivos e gera relatórios.' },
        { title: 'Resposta automatizada', text: 'Abra issues, envie e-mails aos mantenedores ou bloqueie merge requests em novas CVEs críticas.' },
        { title: 'Pipeline como código', text: 'Exporte a configuração para GitHub Actions ou GitLab CI.' },
      ],
    },
    pipeline: {
      title: 'Segurança em cada fase da entrega',
      lead: 'As etapas rodam em ordem e só interrompem o pipeline quando a sua política determina.',
      phases: [
        { name: 'Código-fonte', stages: ['Varredura de segredos', 'Análise estática (SAST)', 'Análise de dependências (SCA)', 'Conformidade de licenças'] },
        { name: 'Build', stages: ['Auditoria do Dockerfile', 'Varredura da imagem de contêiner', 'Geração de SBOM'] },
        { name: 'Pré-deploy', stages: ['Infraestrutura como código', 'Análise dinâmica (DAST)'] },
      ],
      note: 'Use seu próprio Dockerfile — ele é auditado antes do uso — ou o recomendado para a sua stack.',
    },
    pricing: {
      title: 'Preços simples',
      lead: 'Comece de graça. Assine quando quiser que a IA ajude na triagem dos achados.',
      freeCta: 'Começar de graça',
      note: 'Preços em reais (BRL), cobrança mensal. Os planos pagos ainda não estão disponíveis — nada é cobrado.',
    },
    faq: {
      title: 'Perguntas frequentes',
      items: [
        { q: 'Quais tecnologias são suportadas?', a: 'Front-ends React e Angular e back-ends Java + Spring. O Artemis detecta a stack automaticamente ao conectar um repositório.' },
        { q: 'Que acesso o Artemis precisa ao meu código?', a: 'Uma deploy key SSH somente leitura por repositório. Você nunca compartilha uma chave privada com o Artemis.' },
        { q: 'Como começo?', a: 'Crie uma conta com seu e-mail e confirme-o pela mensagem que enviamos. Depois crie uma organização — você será o proprietário, no plano Free — ou aceite um convite para entrar em uma existente.' },
        { q: 'Como minha equipe trabalha junto?', a: 'Convide colegas por e-mail e dê a cada um um papel — proprietário, administrador, analista de segurança, desenvolvedor ou leitor. Cada pessoa pode participar de várias organizações, e os dados de cada organização ficam separados.' },
        { q: 'Como os usuários entram?', a: 'Com uma conta Artemis (OpenID Connect, com política de senhas forte e verificação em duas etapas opcional). O próprio Artemis nunca vê nem armazena sua senha.' },
        { q: 'De onde vêm os dados de vulnerabilidades?', a: 'Os achados são associados a registros CVE e pontuações CVSS da National Vulnerability Database do NIST.' },
        { q: 'A triagem com IA pode ser desativada?', a: 'Sim. A triagem com IA é opcional e pode ser ativada ou desativada por repositório.' },
      ],
    },
    cta: {
      title: 'Comece a proteger seus repositórios',
      lead: 'Conecte seu primeiro projeto em poucos minutos.',
      button: 'Começar',
    },
    footer: {
      tagline: 'Testes contínuos de segurança de aplicações.',
      powered: 'Movido por ferramentas de código aberto — Gitleaks, Semgrep CE, Trivy, Grype, Syft e Hadolint — rodando na nossa própria infraestrutura.',
      product: 'Produto',
      resources: 'Recursos',
      docs: 'Documentação',
      signIn: 'Entrar',
      rights: 'Todos os direitos reservados.',
    },
    preview: { open: 'Achados abertos', critical: 'Críticos', avg: 'CVSS médio', repos: 'Repositórios', recent: 'Vulnerabilidades recentes' },
  },
};
