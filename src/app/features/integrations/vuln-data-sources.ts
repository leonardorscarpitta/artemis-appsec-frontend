import { Lang } from '../../core/i18n';

export interface DataSource {
  name: string;
  url: string;
  provides: string;
  usedBy: string;
}

interface SourcesContent {
  title: string;
  intro: string;
  privacy: string;
  cols: { source: string; provides: string; usedBy: string };
  sources: DataSource[];
}

/** Where the data behind each finding comes from. Scanners use downloaded databases; nothing about the code is sent to them. */
export const VULN_DATA_SOURCES: Record<Lang, SourcesContent> = {
  'en-US': {
    title: 'Data sources behind each finding',
    intro:
      'The scanners compare your dependencies, images and code with the public databases and rule sets below. When a source has a CVSS score, Artemis uses NVD first, then GitHub Advisory and Red Hat.',
    privacy:
      'The vulnerability databases are downloaded by the scanner and searched locally: your code, package list and findings are never sent to these services.',
    cols: { source: 'Source', provides: 'What it provides', usedBy: 'Used by' },
    sources: [
      {
        name: 'NIST National Vulnerability Database (NVD)',
        url: 'https://nvd.nist.gov',
        provides: 'CVE records, CVSS scores and vectors (preferred), CWE weaknesses and references.',
        usedBy: 'Trivy and Grype databases (SCA, licenses, container image)',
      },
      {
        name: 'GitHub Advisory Database (GHSA)',
        url: 'https://github.com/advisories',
        provides: 'Advisories for npm, Maven, PyPI and other ecosystems: affected and fixed versions; CVSS when NVD has none.',
        usedBy: 'Trivy and Grype databases (SCA)',
      },
      {
        name: 'Linux distribution security trackers',
        url: 'https://trivy.dev/latest/docs/scanner/vulnerability/#data-sources',
        provides: 'Alpine, Debian, Ubuntu, Red Hat and other distributions: OS package vulnerabilities and fixed versions; Red Hat CVSS as a fallback.',
        usedBy: 'Trivy (container image, Dockerfile base images) and Grype',
      },
      {
        name: 'Trivy vulnerability database (Aqua Security)',
        url: 'https://github.com/aquasecurity/trivy-db',
        provides: 'The combined, regularly rebuilt database of the sources above, downloaded by the scanner and used offline.',
        usedBy: 'Trivy — SCA, licenses, IaC, container image',
      },
      {
        name: 'Grype vulnerability database (Anchore)',
        url: 'https://github.com/anchore/grype-db',
        provides: 'An independent build of the same public feeds, for the Grype option of the SCA stage.',
        usedBy: 'Grype — SCA',
      },
      {
        name: 'Trivy misconfiguration checks and Hadolint rules',
        url: 'https://avd.aquasec.com/misconfig/',
        provides: 'Rules for Terraform, Kubernetes, Dockerfile and other configuration files.',
        usedBy: 'Trivy and Hadolint — IaC and Dockerfile stages',
      },
      {
        name: 'SPDX License List',
        url: 'https://spdx.org/licenses/',
        provides: 'License identifiers and classification used to flag restricted or unknown licenses.',
        usedBy: 'Trivy — license stage',
      },
      {
        name: 'Gitleaks rules',
        url: 'https://github.com/gitleaks/gitleaks',
        provides: 'Patterns for API keys, tokens, passwords and private keys (values are redacted).',
        usedBy: 'Gitleaks — secrets stage',
      },
      {
        name: 'Artemis code rules',
        url: '/licenses',
        provides: 'Artemis’s own rules for JavaScript/TypeScript, Java/Spring and Python (Flask, Django, FastAPI), mapped to CWE.',
        usedBy: 'Semgrep CE engine — SAST stage',
      },
    ],
  },
  'pt-BR': {
    title: 'Fontes dos dados de cada achado',
    intro:
      'Os scanners comparam suas dependências, imagens e código com as bases públicas e conjuntos de regras abaixo. Quando há pontuação CVSS, o Artemis usa primeiro a NVD, depois o GitHub Advisory e a Red Hat.',
    privacy:
      'As bases de vulnerabilidades são baixadas pelo scanner e consultadas localmente: seu código, a lista de pacotes e os achados nunca são enviados a esses serviços.',
    cols: { source: 'Fonte', provides: 'O que fornece', usedBy: 'Usada por' },
    sources: [
      {
        name: 'NIST National Vulnerability Database (NVD)',
        url: 'https://nvd.nist.gov',
        provides: 'Registros de CVE, pontuações e vetores CVSS (preferenciais), fraquezas CWE e referências.',
        usedBy: 'Bases do Trivy e do Grype (SCA, licenças, imagem de contêiner)',
      },
      {
        name: 'GitHub Advisory Database (GHSA)',
        url: 'https://github.com/advisories',
        provides: 'Alertas para npm, Maven, PyPI e outros ecossistemas: versões afetadas e corrigidas; CVSS quando a NVD não tem.',
        usedBy: 'Bases do Trivy e do Grype (SCA)',
      },
      {
        name: 'Rastreadores de segurança de distribuições Linux',
        url: 'https://trivy.dev/latest/docs/scanner/vulnerability/#data-sources',
        provides: 'Alpine, Debian, Ubuntu, Red Hat e outras distribuições: vulnerabilidades de pacotes do sistema e versões corrigidas; CVSS da Red Hat como alternativa.',
        usedBy: 'Trivy (imagem de contêiner, imagens base de Dockerfile) e Grype',
      },
      {
        name: 'Base de vulnerabilidades do Trivy (Aqua Security)',
        url: 'https://github.com/aquasecurity/trivy-db',
        provides: 'A base combinada das fontes acima, reconstruída com frequência, baixada pelo scanner e usada offline.',
        usedBy: 'Trivy — SCA, licenças, IaC, imagem de contêiner',
      },
      {
        name: 'Base de vulnerabilidades do Grype (Anchore)',
        url: 'https://github.com/anchore/grype-db',
        provides: 'Uma montagem independente dos mesmos feeds públicos, para a opção Grype da etapa de SCA.',
        usedBy: 'Grype — SCA',
      },
      {
        name: 'Verificações de configuração do Trivy e regras do Hadolint',
        url: 'https://avd.aquasec.com/misconfig/',
        provides: 'Regras para Terraform, Kubernetes, Dockerfile e outros arquivos de configuração.',
        usedBy: 'Trivy e Hadolint — etapas de IaC e Dockerfile',
      },
      {
        name: 'SPDX License List',
        url: 'https://spdx.org/licenses/',
        provides: 'Identificadores e classificação de licenças usados para sinalizar licenças restritas ou desconhecidas.',
        usedBy: 'Trivy — etapa de licenças',
      },
      {
        name: 'Regras do Gitleaks',
        url: 'https://github.com/gitleaks/gitleaks',
        provides: 'Padrões de chaves de API, tokens, senhas e chaves privadas (os valores são ocultados).',
        usedBy: 'Gitleaks — etapa de segredos',
      },
      {
        name: 'Regras de código do Artemis',
        url: '/licenses',
        provides: 'Regras próprias do Artemis para JavaScript/TypeScript, Java/Spring e Python (Flask, Django, FastAPI), mapeadas para CWE.',
        usedBy: 'Motor Semgrep CE — etapa de SAST',
      },
    ],
  },
};
