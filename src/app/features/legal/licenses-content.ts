import { Lang } from '../../core/i18n';
import { LegalText } from './legal-content';

/** Required verbatim by the NVD terms of use. */
export const NVD_NOTICE = 'This product uses data from the NVD API but is not endorsed or certified by the NVD.';

const UPDATED = '2026-10-18';
const FRONTEND_REPO = 'https://github.com/leonardorscarpitta/artemis-appsec-frontend';
const BACKEND_REPO = 'https://github.com/leonardorscarpitta/artemis-appsec-backend';

const SCANNERS = [
  ['Gitleaks', 'Secret scanning', 'MIT', 'https://github.com/gitleaks/gitleaks'],
  ['Semgrep CE (engine)', 'Static analysis (SAST) with Artemis’s own rules', 'LGPL-2.1', 'https://github.com/semgrep/semgrep'],
  ['Trivy', 'Dependency, license and infrastructure-as-code scanning', 'Apache-2.0', 'https://github.com/aquasecurity/trivy'],
  ['Grype', 'Dependency scanning', 'Apache-2.0', 'https://github.com/anchore/grype'],
  ['Syft', 'SBOM generation', 'Apache-2.0', 'https://github.com/anchore/syft'],
  ['Hadolint', 'Dockerfile audit', 'GPL-3.0', 'https://github.com/hadolint/hadolint'],
];

const SCANNERS_PT = [
  ['Gitleaks', 'Varredura de segredos', 'MIT', 'https://github.com/gitleaks/gitleaks'],
  ['Semgrep CE (motor)', 'Análise estática (SAST) com regras próprias do Artemis', 'LGPL-2.1', 'https://github.com/semgrep/semgrep'],
  ['Trivy', 'Análise de dependências, licenças e infraestrutura como código', 'Apache-2.0', 'https://github.com/aquasecurity/trivy'],
  ['Grype', 'Análise de dependências', 'Apache-2.0', 'https://github.com/anchore/grype'],
  ['Syft', 'Geração de SBOM', 'Apache-2.0', 'https://github.com/anchore/syft'],
  ['Hadolint', 'Auditoria do Dockerfile', 'GPL-3.0', 'https://github.com/hadolint/hadolint'],
];

const PLATFORM = [
  ['Keycloak', 'Apache-2.0', 'https://github.com/keycloak/keycloak'],
  ['Caddy', 'Apache-2.0', 'https://github.com/caddyserver/caddy'],
  ['PostgreSQL', 'PostgreSQL License', 'https://www.postgresql.org'],
  ['Spring Boot', 'Apache-2.0', 'https://github.com/spring-projects/spring-boot'],
  ['Angular', 'MIT', 'https://github.com/angular/angular'],
  ['oidc-client-ts', 'Apache-2.0', 'https://github.com/authts/oidc-client-ts'],
  ['IBM Plex Sans / IBM Plex Mono (fonts, served by Artemis)', 'SIL OFL 1.1', 'https://github.com/IBM/plex'],
];

export const LICENSES: Record<Lang, LegalText> = {
  'en-US': {
    title: 'Third-party notices',
    summary:
      'Artemis is powered by open-source security tools and vulnerability data. This page credits them and explains how they are used.',
    updated: `Last updated: ${UPDATED}`,
    sections: [
      {
        id: 'artemis',
        title: 'About Artemis',
        blocks: [
          { kind: 'p', text: `Artemis is open source under the MIT License. Source code: ${FRONTEND_REPO} (web app) and ${BACKEND_REPO} (API and scanner).` },
        ],
      },
      {
        id: 'scanners',
        title: 'Security tools',
        blocks: [
          { kind: 'p', text: 'Scans run on Artemis’s own infrastructure, in an isolated scanner, with these tools. Each one is used unmodified, as a separate program, and remains under its own license.' },
          { kind: 'table', head: ['Tool', 'Used for', 'License', 'Source code'], rows: SCANNERS },
          { kind: 'p', text: 'For the GPL-3.0 (Hadolint) and LGPL-2.1 (Semgrep CE) tools, the complete corresponding source code is available at the addresses above. Artemis does not modify these programs; their license and notice files are shipped inside the scanner image.' },
          { kind: 'p', text: 'Semgrep CE is used only as an engine with rules written by Artemis — not with the Semgrep Registry rules.' },
        ],
      },
      {
        id: 'data',
        title: 'Vulnerability data',
        blocks: [
          { kind: 'note', text: NVD_NOTICE },
          {
            kind: 'ul',
            items: [
              'NIST National Vulnerability Database (NVD) — CVE and CVSS data (public domain).',
              'GitHub Advisory Database — CC-BY-4.0, © GitHub, Inc. and contributors.',
              'OSV and the vulnerability databases published by the Trivy and Grype projects, which aggregate the sources above and operating-system security advisories under their respective terms.',
            ],
          },
          { kind: 'p', text: 'Downloading these databases sends no information about you, your organization or your code.' },
        ],
      },
      {
        id: 'platform',
        title: 'Other open-source components',
        blocks: [{ kind: 'table', head: ['Component', 'License', 'Source code'], rows: PLATFORM }],
      },
      {
        id: 'trademarks',
        title: 'Trademarks',
        blocks: [
          { kind: 'p', text: 'Product names are used only to identify the tools Artemis runs. All trademarks belong to their owners, and their use does not imply endorsement of Artemis by those projects or companies.' },
        ],
      },
    ],
  },
  'pt-BR': {
    title: 'Avisos de terceiros',
    summary:
      'O Artemis usa ferramentas de segurança de código aberto e dados públicos de vulnerabilidades. Esta página dá os créditos e explica como são usados.',
    updated: `Última atualização: ${UPDATED}`,
    sections: [
      {
        id: 'artemis',
        title: 'Sobre o Artemis',
        blocks: [
          { kind: 'p', text: `O Artemis é código aberto sob a Licença MIT. Código-fonte: ${FRONTEND_REPO} (aplicação web) e ${BACKEND_REPO} (API e scanner).` },
        ],
      },
      {
        id: 'scanners',
        title: 'Ferramentas de segurança',
        blocks: [
          { kind: 'p', text: 'As análises rodam na infraestrutura do próprio Artemis, em um scanner isolado, com estas ferramentas. Cada uma é usada sem modificações, como um programa separado, e continua sob a sua própria licença.' },
          { kind: 'table', head: ['Ferramenta', 'Usada para', 'Licença', 'Código-fonte'], rows: SCANNERS_PT },
          { kind: 'p', text: 'Para as ferramentas sob GPL-3.0 (Hadolint) e LGPL-2.1 (Semgrep CE), o código-fonte completo correspondente está disponível nos endereços acima. O Artemis não modifica esses programas; seus arquivos de licença e de aviso acompanham a imagem do scanner.' },
          { kind: 'p', text: 'O Semgrep CE é usado apenas como motor, com regras escritas pelo Artemis — não com as regras do Semgrep Registry.' },
        ],
      },
      {
        id: 'data',
        title: 'Dados de vulnerabilidades',
        blocks: [
          { kind: 'note', text: NVD_NOTICE },
          { kind: 'p', text: 'Tradução: este produto usa dados da API da NVD, mas não é endossado nem certificado pela NVD.' },
          {
            kind: 'ul',
            items: [
              'National Vulnerability Database (NVD) do NIST — dados de CVE e CVSS (domínio público).',
              'GitHub Advisory Database — CC-BY-4.0, © GitHub, Inc. e colaboradores.',
              'OSV e os bancos de vulnerabilidades publicados pelos projetos Trivy e Grype, que agregam as fontes acima e avisos de segurança de sistemas operacionais, sob os respectivos termos.',
            ],
          },
          { kind: 'p', text: 'O download desses bancos não envia nenhuma informação sobre você, sua organização ou seu código.' },
        ],
      },
      {
        id: 'platform',
        title: 'Outros componentes de código aberto',
        blocks: [{ kind: 'table', head: ['Componente', 'Licença', 'Código-fonte'], rows: PLATFORM }],
      },
      {
        id: 'trademarks',
        title: 'Marcas',
        blocks: [
          { kind: 'p', text: 'Os nomes de produtos são usados apenas para identificar as ferramentas que o Artemis executa. Todas as marcas pertencem aos seus donos, e seu uso não implica endosso do Artemis por esses projetos ou empresas.' },
        ],
      },
    ],
  },
};
