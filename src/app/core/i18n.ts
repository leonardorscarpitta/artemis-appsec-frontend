import { Service, computed, effect, signal } from '@angular/core';

export type Lang = 'en-US' | 'pt-BR';

const dictionary = {
  'en-US': {
    'nav.dashboard': 'Dashboard',
    'nav.repositories': 'Repositories',
    'nav.onboarding': 'New project',
    'nav.main': 'Main navigation',
    'nav.signOut': 'Sign out',
    'nav.skip': 'Skip to content',
    'lang.label': 'Language',

    'login.title': 'Sign in to Artemis',
    'login.subtitle': 'Continuous static analysis for your repositories.',
    'login.sso': 'Continue with SSO',
    'login.provider': 'Authentication provided by Authelia via OpenID Connect.',
    'login.tagline': 'Find vulnerabilities before they ship.',
    'login.feature1': 'Automatic stack detection for React, Angular and Java + Spring',
    'login.feature2': 'CVSS scoring backed by the NIST National Vulnerability Database',
    'login.feature3': 'Optional AI triage to reduce false positives',

    'dash.title': 'Security overview',
    'dash.subtitle': 'Vulnerabilities found across all monitored repositories.',
    'dash.openFindings': 'Open findings',
    'dash.critical': 'Critical',
    'dash.avgCvss': 'Average CVSS',
    'dash.lastScan': 'Last scan',
    'dash.severity': 'Severity distribution',
    'dash.recent': 'Recent CVEs',
    'dash.source': 'Source: NIST NVD',
    'dash.newScan': 'Run scan',

    'col.cve': 'CVE',
    'col.package': 'Package',
    'col.repository': 'Repository',
    'col.cvss': 'CVSS',
    'col.status': 'Status',
    'col.detected': 'Detected',
    'col.stack': 'Stack',
    'col.schedule': 'Schedule',
    'col.findings': 'Findings',

    'sev.critical': 'Critical',
    'sev.high': 'High',
    'sev.medium': 'Medium',
    'sev.low': 'Low',

    'status.open': 'Open',
    'status.triaged': 'Triaged',
    'status.falsePositive': 'False positive',
    'status.fixed': 'Fixed',

    'repo.title': 'Repositories',
    'repo.subtitle': 'Projects connected to Artemis.',
    'repo.add': 'Add repository',

    'ob.title': 'Connect a new project',
    'ob.subtitle': 'Four steps and Artemis starts watching your code.',
    'ob.step1': 'SSH key',
    'ob.step2': 'Repository',
    'ob.step3': 'Settings',
    'ob.step4': 'Detection',
    'ob.back': 'Back',
    'ob.next': 'Continue',
    'ob.finish': 'Start monitoring',

    'ob.ssh.title': 'Connect your SSH key',
    'ob.ssh.desc': 'Artemis uses a read-only deploy key to clone your repository.',
    'ob.ssh.label': 'Public key',
    'ob.ssh.hint': 'Paste an ed25519 or RSA public key. Never share your private key.',
    'ob.ssh.generate': 'Generate a key for me',

    'ob.repo.title': 'Choose a repository',
    'ob.repo.desc': 'Provide the SSH URL of the repository you want to analyze.',
    'ob.repo.label': 'Repository URL',
    'ob.repo.branch': 'Branch',

    'ob.settings.title': 'Scan settings',
    'ob.settings.desc': 'Decide how often Artemis runs and what it does when it finds something.',
    'ob.settings.interval': 'Re-run scans every',
    'ob.settings.interval.6h': '6 hours',
    'ob.settings.interval.24h': '24 hours',
    'ob.settings.interval.7d': '7 days',
    'ob.settings.interval.push': 'On every push',
    'ob.settings.actions': 'Automatic actions on new CVE',
    'ob.settings.action.issue': 'Open an issue in the repository',
    'ob.settings.action.email': 'Notify maintainers by e-mail',
    'ob.settings.action.block': 'Fail the pipeline for critical findings',
    'ob.settings.dockerfile': 'Build environment',
    'ob.settings.dockerfile.recommended': 'Recommended Dockerfile',
    'ob.settings.dockerfile.recommendedDesc': 'Maintained by Artemis for the detected stack.',
    'ob.settings.dockerfile.custom': 'Use my own Dockerfile',
    'ob.settings.dockerfile.customDesc': 'Your Dockerfile will be audited before use.',
    'ob.settings.ai': 'AI triage',
    'ob.settings.aiDesc': 'Check findings for false positives and generate reports.',

    'ob.detect.title': 'Stack detection',
    'ob.detect.desc': 'Artemis analyzed the repository and recognized the following stack.',
    'ob.detect.detected': 'Detected',
    'ob.detect.supported': 'Currently supported stacks',
  },
  'pt-BR': {
    'nav.dashboard': 'Painel',
    'nav.repositories': 'Repositórios',
    'nav.onboarding': 'Novo projeto',
    'nav.main': 'Navegação principal',
    'nav.signOut': 'Sair',
    'nav.skip': 'Pular para o conteúdo',
    'lang.label': 'Idioma',

    'login.title': 'Entrar no Artemis',
    'login.subtitle': 'Análise estática contínua para seus repositórios.',
    'login.sso': 'Continuar com SSO',
    'login.provider': 'Autenticação fornecida pelo Authelia via OpenID Connect.',
    'login.tagline': 'Encontre vulnerabilidades antes que cheguem à produção.',
    'login.feature1': 'Detecção automática de React, Angular e Java + Spring',
    'login.feature2': 'Pontuação CVSS baseada na National Vulnerability Database do NIST',
    'login.feature3': 'Triagem opcional com IA para reduzir falsos positivos',

    'dash.title': 'Visão geral de segurança',
    'dash.subtitle': 'Vulnerabilidades encontradas em todos os repositórios monitorados.',
    'dash.openFindings': 'Achados abertos',
    'dash.critical': 'Críticos',
    'dash.avgCvss': 'CVSS médio',
    'dash.lastScan': 'Última análise',
    'dash.severity': 'Distribuição por severidade',
    'dash.recent': 'CVEs recentes',
    'dash.source': 'Fonte: NIST NVD',
    'dash.newScan': 'Executar análise',

    'col.cve': 'CVE',
    'col.package': 'Pacote',
    'col.repository': 'Repositório',
    'col.cvss': 'CVSS',
    'col.status': 'Status',
    'col.detected': 'Detectado',
    'col.stack': 'Stack',
    'col.schedule': 'Agendamento',
    'col.findings': 'Achados',

    'sev.critical': 'Crítica',
    'sev.high': 'Alta',
    'sev.medium': 'Média',
    'sev.low': 'Baixa',

    'status.open': 'Aberto',
    'status.triaged': 'Triado',
    'status.falsePositive': 'Falso positivo',
    'status.fixed': 'Corrigido',

    'repo.title': 'Repositórios',
    'repo.subtitle': 'Projetos conectados ao Artemis.',
    'repo.add': 'Adicionar repositório',

    'ob.title': 'Conectar um novo projeto',
    'ob.subtitle': 'Quatro passos e o Artemis começa a monitorar seu código.',
    'ob.step1': 'Chave SSH',
    'ob.step2': 'Repositório',
    'ob.step3': 'Configurações',
    'ob.step4': 'Detecção',
    'ob.back': 'Voltar',
    'ob.next': 'Continuar',
    'ob.finish': 'Iniciar monitoramento',

    'ob.ssh.title': 'Conecte sua chave SSH',
    'ob.ssh.desc': 'O Artemis usa uma deploy key somente leitura para clonar seu repositório.',
    'ob.ssh.label': 'Chave pública',
    'ob.ssh.hint': 'Cole uma chave pública ed25519 ou RSA. Nunca compartilhe sua chave privada.',
    'ob.ssh.generate': 'Gerar uma chave para mim',

    'ob.repo.title': 'Escolha um repositório',
    'ob.repo.desc': 'Informe a URL SSH do repositório que deseja analisar.',
    'ob.repo.label': 'URL do repositório',
    'ob.repo.branch': 'Branch',

    'ob.settings.title': 'Configurações da análise',
    'ob.settings.desc': 'Defina a frequência das análises e o que fazer ao encontrar algo.',
    'ob.settings.interval': 'Reexecutar análises a cada',
    'ob.settings.interval.6h': '6 horas',
    'ob.settings.interval.24h': '24 horas',
    'ob.settings.interval.7d': '7 dias',
    'ob.settings.interval.push': 'A cada push',
    'ob.settings.actions': 'Ações automáticas para novas CVEs',
    'ob.settings.action.issue': 'Abrir uma issue no repositório',
    'ob.settings.action.email': 'Notificar mantenedores por e-mail',
    'ob.settings.action.block': 'Falhar o pipeline em achados críticos',
    'ob.settings.dockerfile': 'Ambiente de build',
    'ob.settings.dockerfile.recommended': 'Dockerfile recomendado',
    'ob.settings.dockerfile.recommendedDesc': 'Mantido pelo Artemis para a stack detectada.',
    'ob.settings.dockerfile.custom': 'Usar meu próprio Dockerfile',
    'ob.settings.dockerfile.customDesc': 'Seu Dockerfile será auditado antes do uso.',
    'ob.settings.ai': 'Triagem com IA',
    'ob.settings.aiDesc': 'Verifica falsos positivos nos achados e gera relatórios.',

    'ob.detect.title': 'Detecção de stack',
    'ob.detect.desc': 'O Artemis analisou o repositório e reconheceu a seguinte stack.',
    'ob.detect.detected': 'Detectado',
    'ob.detect.supported': 'Stacks suportadas no momento',
  },
} satisfies Record<Lang, Record<string, string>>;

export type TranslationKey = keyof (typeof dictionary)['en-US'];

const STORAGE_KEY = 'artemis.lang';

@Service()
export class I18n {
  readonly lang = signal<Lang>(this.initialLang());
  private readonly current = computed(() => dictionary[this.lang()]);

  constructor() {
    effect(() => {
      document.documentElement.lang = this.lang();
      localStorage.setItem(STORAGE_KEY, this.lang());
    });
  }

  t(key: TranslationKey): string {
    return this.current()[key];
  }

  private initialLang(): Lang {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en-US' || stored === 'pt-BR') return stored;
    return navigator.language.startsWith('pt') ? 'pt-BR' : 'en-US';
  }
}
