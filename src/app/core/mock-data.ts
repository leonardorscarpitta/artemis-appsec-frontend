import type { Lang, TranslationKey } from './i18n';

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'triaged' | 'falsePositive' | 'accepted' | 'fixed';
export type Stack = 'React' | 'Angular' | 'Java + Spring';
export type Ecosystem = 'npm' | 'maven' | 'debian';
export type DetectionStage = 'sca' | 'image';

export interface AiVerdict {
  falsePositive: boolean;
  confidence: number;
  rationale: Record<Lang, string>;
}

export interface Finding {
  id: string;
  cve: string;
  pkg: string;
  repository: string;
  cvss: number;
  status: FindingStatus;
  detected: string;
  title: string;
  description: string;
  vector: string;
  cwe: string;
  ecosystem: Ecosystem;
  // Maven groupId, used to build registry links and upgrade commands.
  group?: string;
  fixedVersion: string | null;
  stage: DetectionStage;
  tool: string;
  statusChanged?: string;
  ai?: AiVerdict;
}

export interface Repository {
  name: string;
  url: string;
  stack: Stack;
  schedule: string;
  findings: number;
  lastScan: string;
}

export const STATUS_KEYS: Record<FindingStatus, TranslationKey> = {
  open: 'status.open',
  triaged: 'status.triaged',
  falsePositive: 'status.falsePositive',
  accepted: 'vuln.status.accepted',
  fixed: 'status.fixed',
};

export function severityOf(cvss: number): Severity {
  if (cvss >= 9) return 'critical';
  if (cvss >= 7) return 'high';
  if (cvss >= 4) return 'medium';
  return 'low';
}

export function splitPackage(pkg: string): { name: string; version: string } {
  const at = pkg.lastIndexOf('@');
  return { name: pkg.slice(0, at), version: pkg.slice(at + 1) };
}

const PATH_TO_REGEXP_REDOS = {
  cve: 'CVE-2024-45296',
  cvss: 7.5,
  title: 'Regular expression denial of service in path-to-regexp',
  description:
    'path-to-regexp turns path strings into regular expressions. In certain cases, path-to-regexp outputs a regular expression that can be exploited to cause poor performance, because JavaScript is single threaded and regex matching runs on the main thread. Routes containing two parameters within a single segment separated by something that is not a period are affected.',
  vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
  cwe: 'CWE-1333',
  ecosystem: 'npm',
  fixedVersion: '0.1.10',
  stage: 'sca',
  tool: 'Trivy',
} as const;

// Placeholder data until the API is available.
export const FINDINGS: Finding[] = [
  {
    id: 'F-1101',
    cve: 'CVE-2025-29927',
    pkg: 'next@14.2.10',
    repository: 'storefront-web',
    cvss: 9.1,
    status: 'open',
    detected: '2026-10-15',
    title: 'Authorization bypass in Next.js middleware',
    description:
      'Next.js is a React framework for building full-stack web applications. It is possible to bypass authorization checks within a Next.js application if the authorization check occurs in middleware, by sending a crafted x-middleware-subrequest header.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
    cwe: 'CWE-285',
    ecosystem: 'npm',
    fixedVersion: '14.2.25',
    stage: 'sca',
    tool: 'Trivy',
    ai: {
      falsePositive: false,
      confidence: 0.94,
      rationale: {
        'en-US': 'The app protects /account routes in middleware.ts, so the bypass is reachable from the internet.',
        'pt-BR': 'A aplicação protege as rotas /account no middleware.ts, então o bypass é alcançável pela internet.',
      },
    },
  },
  {
    id: 'F-1102',
    cve: 'CVE-2024-47875',
    pkg: 'dompurify@3.1.2',
    repository: 'storefront-web',
    cvss: 10,
    status: 'open',
    detected: '2026-10-15',
    title: 'Nesting-based mutation XSS in DOMPurify',
    description:
      'DOMPurify is a DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG. DOMPurify was vulnerable to nesting-based mutation XSS (mXSS), allowing crafted markup to bypass sanitization.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    cwe: 'CWE-79',
    ecosystem: 'npm',
    fixedVersion: '3.1.3',
    stage: 'sca',
    tool: 'Trivy',
  },
  {
    id: 'F-1103',
    ...PATH_TO_REGEXP_REDOS,
    pkg: 'path-to-regexp@0.1.7',
    repository: 'storefront-web',
    status: 'open',
    detected: '2026-10-14',
  },
  {
    id: 'F-1104',
    cve: 'CVE-2024-43788',
    pkg: 'webpack@5.93.0',
    repository: 'storefront-web',
    cvss: 6.4,
    status: 'triaged',
    detected: '2026-10-12',
    statusChanged: '2026-10-13',
    title: 'DOM clobbering gadget in webpack AutoPublicPathRuntimeModule',
    description:
      'Webpack is a module bundler. A DOM clobbering gadget in the AutoPublicPathRuntimeModule can lead to cross-site scripting in websites where attacker-controlled HTML elements, such as img tags with an unsanitized name attribute, are present.',
    vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:C/C:L/I:L/A:L',
    cwe: 'CWE-79',
    ecosystem: 'npm',
    fixedVersion: '5.94.0',
    stage: 'sca',
    tool: 'Trivy',
  },
  {
    id: 'F-1105',
    cve: 'CVE-2024-4067',
    pkg: 'micromatch@4.0.5',
    repository: 'storefront-web',
    cvss: 5.3,
    status: 'falsePositive',
    detected: '2026-10-10',
    statusChanged: '2026-10-10',
    title: 'Regular expression denial of service in micromatch',
    description:
      'The NPM package micromatch is vulnerable to Regular Expression Denial of Service (ReDoS). The vulnerability occurs in micromatch.braces() due to greedy matching of a pattern; supplying a malicious payload makes the function hang.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L',
    cwe: 'CWE-1333',
    ecosystem: 'npm',
    fixedVersion: '4.0.8',
    stage: 'sca',
    tool: 'Trivy',
    ai: {
      falsePositive: true,
      confidence: 0.88,
      rationale: {
        'en-US': 'micromatch is only pulled in by build tooling (devDependencies) and never receives user input at runtime.',
        'pt-BR': 'O micromatch só é usado pelas ferramentas de build (devDependencies) e nunca recebe entrada de usuário em execução.',
      },
    },
  },
  {
    id: 'F-1106',
    cve: 'CVE-2024-52798',
    pkg: 'path-to-regexp@0.1.10',
    repository: 'storefront-web',
    cvss: 5.9,
    status: 'fixed',
    detected: '2026-10-09',
    statusChanged: '2026-10-14',
    title: 'Incomplete fix for path-to-regexp ReDoS',
    description:
      'The regular expression generated for routes with multiple parameters in a single segment was still vulnerable to backtracking after the fix for CVE-2024-45296, allowing a denial of service with crafted URLs.',
    vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:H',
    cwe: 'CWE-1333',
    ecosystem: 'npm',
    fixedVersion: '0.1.12',
    stage: 'sca',
    tool: 'Trivy',
  },
  {
    id: 'F-1107',
    cve: 'CVE-2023-44270',
    pkg: 'postcss@8.4.24',
    repository: 'storefront-web',
    cvss: 5.3,
    status: 'accepted',
    detected: '2026-10-02',
    statusChanged: '2026-10-05',
    title: 'Line return parsing error in PostCSS',
    description:
      'An issue was discovered in PostCSS before 8.4.31. The vulnerability affects linters using PostCSS to parse external untrusted CSS. An attacker can prepare CSS so that it is parsed by PostCSS as a comment but included in the output as a CSS node.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N',
    cwe: 'CWE-74',
    ecosystem: 'npm',
    fixedVersion: '8.4.31',
    stage: 'sca',
    tool: 'Trivy',
  },
  {
    id: 'F-1201',
    cve: 'CVE-2025-24813',
    pkg: 'tomcat-embed-core@10.1.30',
    repository: 'payments-api',
    cvss: 9.8,
    status: 'open',
    detected: '2026-10-13',
    title: 'Remote code execution via partial PUT in Apache Tomcat',
    description:
      'Path equivalence (internal dot) in Apache Tomcat allows remote code execution, information disclosure or malicious content to be added to uploaded files via write-enabled Default Servlet when partial PUT support and file-based session persistence are enabled.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    cwe: 'CWE-44',
    ecosystem: 'maven',
    group: 'org.apache.tomcat.embed',
    fixedVersion: '10.1.35',
    stage: 'sca',
    tool: 'OWASP Dependency-Check',
    ai: {
      falsePositive: false,
      confidence: 0.71,
      rationale: {
        'en-US': 'Exploitation needs write-enabled Default Servlet, which is off by default; the version is still affected and should be upgraded.',
        'pt-BR': 'A exploração exige o Default Servlet com escrita habilitada, desativado por padrão; a versão continua afetada e deve ser atualizada.',
      },
    },
  },
  {
    id: 'F-1202',
    cve: 'CVE-2024-38821',
    pkg: 'spring-security-web@6.3.3',
    repository: 'payments-api',
    cvss: 9.1,
    status: 'open',
    detected: '2026-10-13',
    title: 'Authorization bypass of static resources in Spring Security',
    description:
      'Spring WebFlux applications that have Spring Security authorization rules on static resources can be bypassed under certain circumstances, giving unauthenticated access to protected static resources.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
    cwe: 'CWE-285',
    ecosystem: 'maven',
    group: 'org.springframework.security',
    fixedVersion: '6.3.4',
    stage: 'sca',
    tool: 'OWASP Dependency-Check',
  },
  {
    id: 'F-1203',
    cve: 'CVE-2024-45490',
    pkg: 'libexpat1@2.5.0-1',
    repository: 'payments-api',
    cvss: 9.8,
    status: 'open',
    detected: '2026-10-13',
    title: 'Negative length handling in libexpat XML_ParseBuffer',
    description:
      'An issue was discovered in libexpat before 2.6.3. xmlparse.c does not reject a negative length for XML_ParseBuffer, which may lead to memory corruption.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    cwe: 'CWE-611',
    ecosystem: 'debian',
    fixedVersion: '2.5.0-1+deb12u1',
    stage: 'image',
    tool: 'Trivy',
  },
  {
    id: 'F-1204',
    cve: 'CVE-2024-38816',
    pkg: 'spring-webmvc@6.1.12',
    repository: 'payments-api',
    cvss: 7.5,
    status: 'triaged',
    detected: '2026-10-11',
    statusChanged: '2026-10-12',
    title: 'Path traversal in Spring Framework functional web frameworks',
    description:
      'Applications serving static resources through the functional web frameworks WebMvc.fn or WebFlux.fn are vulnerable to path traversal attacks. An attacker can craft malicious HTTP requests and obtain any file on the file system that is also accessible to the process.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
    cwe: 'CWE-22',
    ecosystem: 'maven',
    group: 'org.springframework',
    fixedVersion: '6.1.13',
    stage: 'sca',
    tool: 'OWASP Dependency-Check',
  },
  {
    id: 'F-1205',
    cve: 'CVE-2024-7254',
    pkg: 'protobuf-java@3.25.3',
    repository: 'payments-api',
    cvss: 7.5,
    status: 'open',
    detected: '2026-10-11',
    title: 'Stack overflow parsing nested groups in protobuf-java',
    description:
      'Parsing untrusted Protocol Buffers data containing an arbitrary number of nested groups, or series of SGROUP tags, can corrupt the stack by exceeding the stack limit, leading to a denial of service.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
    cwe: 'CWE-674',
    ecosystem: 'maven',
    group: 'com.google.protobuf',
    fixedVersion: '3.25.5',
    stage: 'sca',
    tool: 'OWASP Dependency-Check',
  },
  {
    id: 'F-1206',
    cve: 'CVE-2022-1471',
    pkg: 'snakeyaml@1.33',
    repository: 'payments-api',
    cvss: 8.3,
    status: 'falsePositive',
    detected: '2026-10-09',
    statusChanged: '2026-10-09',
    title: 'Unsafe deserialization in SnakeYAML Constructor',
    description:
      'SnakeYAML\'s Constructor() class does not restrict types which can be instantiated during deserialization. Deserializing YAML content provided by an attacker can lead to remote code execution.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:L/I:L/A:L',
    cwe: 'CWE-502',
    ecosystem: 'maven',
    group: 'org.yaml',
    fixedVersion: '2.0',
    stage: 'sca',
    tool: 'OWASP Dependency-Check',
    ai: {
      falsePositive: true,
      confidence: 0.86,
      rationale: {
        'en-US': 'SnakeYAML only loads the bundled application.yml at startup through Spring Boot; no untrusted YAML reaches the parser.',
        'pt-BR': 'O SnakeYAML só carrega o application.yml empacotado na inicialização via Spring Boot; nenhum YAML não confiável chega ao parser.',
      },
    },
  },
  {
    id: 'F-1207',
    cve: 'CVE-2024-38808',
    pkg: 'spring-expression@6.1.10',
    repository: 'payments-api',
    cvss: 4.3,
    status: 'triaged',
    detected: '2026-10-08',
    statusChanged: '2026-10-09',
    title: 'Denial of service via crafted SpEL expression',
    description:
      'Applications that evaluate user-supplied Spring Expression Language (SpEL) expressions are vulnerable to a denial of service caused by a specially crafted expression.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:L',
    cwe: 'CWE-770',
    ecosystem: 'maven',
    group: 'org.springframework',
    fixedVersion: '6.1.14',
    stage: 'sca',
    tool: 'OWASP Dependency-Check',
  },
  {
    id: 'F-1208',
    cve: 'CVE-2023-6378',
    pkg: 'logback-classic@1.4.11',
    repository: 'payments-api',
    cvss: 7.1,
    status: 'fixed',
    detected: '2026-10-01',
    statusChanged: '2026-10-06',
    title: 'Serialization vulnerability in logback receiver',
    description:
      'A serialization vulnerability in the logback receiver component allows an attacker to mount a denial-of-service attack by sending poisoned data. This requires the logback-receiver component to be enabled and reachable by the attacker.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:H',
    cwe: 'CWE-502',
    ecosystem: 'maven',
    group: 'ch.qos.logback',
    fixedVersion: '1.4.12',
    stage: 'sca',
    tool: 'OWASP Dependency-Check',
  },
  {
    id: 'F-1301',
    cve: 'CVE-2025-27789',
    pkg: '@babel/runtime@7.24.0',
    repository: 'backoffice',
    cvss: 6.2,
    status: 'open',
    detected: '2026-10-12',
    title: 'Inefficient RegExp complexity in Babel named capturing groups',
    description:
      'When using Babel to compile regular expression named capturing groups, Babel generates a polyfill for the .replace method that has quadratic complexity on some specific replacement pattern strings.',
    vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:H',
    cwe: 'CWE-1333',
    ecosystem: 'npm',
    fixedVersion: '7.26.10',
    stage: 'sca',
    tool: 'Trivy',
  },
  {
    id: 'F-1302',
    ...PATH_TO_REGEXP_REDOS,
    pkg: 'path-to-regexp@0.1.7',
    repository: 'backoffice',
    status: 'triaged',
    detected: '2026-10-12',
    statusChanged: '2026-10-12',
  },
  {
    id: 'F-1303',
    cve: 'CVE-2024-21490',
    pkg: 'angular@1.8.3',
    repository: 'backoffice',
    cvss: 7.5,
    status: 'falsePositive',
    detected: '2026-10-12',
    statusChanged: '2026-10-12',
    title: 'ReDoS in AngularJS ng-srcset directive',
    description:
      'All versions of the package angular are vulnerable to Regular Expression Denial of Service (ReDoS) via the ng-srcset directive, due to insecure regular expressions. AngularJS is end-of-life and will not receive a fix.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
    cwe: 'CWE-1333',
    ecosystem: 'npm',
    fixedVersion: null,
    stage: 'sca',
    tool: 'Trivy',
    ai: {
      falsePositive: true,
      confidence: 0.91,
      rationale: {
        'en-US': 'The legacy AngularJS package is only referenced by an archived e2e fixture and is not part of the production bundle.',
        'pt-BR': 'O pacote legado do AngularJS só é referenciado por um fixture e2e arquivado e não faz parte do bundle de produção.',
      },
    },
  },
  {
    id: 'F-1304',
    cve: 'CVE-2024-47764',
    pkg: 'cookie@0.6.0',
    repository: 'backoffice',
    cvss: 5.3,
    status: 'open',
    detected: '2026-10-11',
    title: 'Out-of-bounds characters accepted in cookie name, path and domain',
    description:
      'The cookie name could be used to set other fields of the cookie, resulting in an unexpected cookie value, when user input is passed as the cookie name, path or domain.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N',
    cwe: 'CWE-74',
    ecosystem: 'npm',
    fixedVersion: '0.7.0',
    stage: 'sca',
    tool: 'Trivy',
  },
  {
    id: 'F-1305',
    cve: 'CVE-2024-55565',
    pkg: 'nanoid@3.3.7',
    repository: 'backoffice',
    cvss: 3.7,
    status: 'open',
    detected: '2026-10-07',
    title: 'Predictable results in nanoid with non-integer values',
    description:
      'nanoid mishandles non-integer values: when 0.1 is given as the size argument, the generated IDs can be predictable.',
    vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N',
    cwe: 'CWE-835',
    ecosystem: 'npm',
    fixedVersion: '3.3.8',
    stage: 'sca',
    tool: 'Trivy',
  },
];

const openCount = (repo: string) =>
  FINDINGS.filter((f) => f.repository === repo && (f.status === 'open' || f.status === 'triaged')).length;

export const REPOSITORIES: Repository[] = [
  { name: 'storefront-web', url: 'git@github.com:acme/storefront-web.git', stack: 'React', schedule: '24h', findings: openCount('storefront-web'), lastScan: '2026-10-15 22:10' },
  { name: 'payments-api', url: 'git@github.com:acme/payments-api.git', stack: 'Java + Spring', schedule: 'push', findings: openCount('payments-api'), lastScan: '2026-10-15 21:42' },
  { name: 'backoffice', url: 'git@gitlab.com:acme/backoffice.git', stack: 'Angular', schedule: '7d', findings: openCount('backoffice'), lastScan: '2026-10-12 08:00' },
];
