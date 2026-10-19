import { Lang } from '../../core/i18n';
import { HelpSection } from '../help/help-content';

export type LegalDocument = 'privacy' | 'terms';

export interface LegalText {
  title: string;
  summary: string;
  updated: string;
  sections: HelpSection[];
}

const CONTACT = 'privacy@artemisappsec.papopromines.com.br';
const UPDATED = '2026-10-19';
const REPOSITORY = 'https://github.com/leonardorscarpitta/artemis-appsec-frontend';

export const LEGAL: Record<LegalDocument, Record<Lang, LegalText>> = {
  privacy: {
    'en-US': {
      title: 'Privacy Policy',
      summary:
        'Artemis exists to help you find and fix vulnerabilities. We are not interested in your data or your organization’s data beyond what is needed to run the service, and we never sell, rent, trade or share it.',
      updated: `Last updated: ${UPDATED}`,
      sections: [
        {
          id: 'commitment',
          title: 'Our commitment',
          blocks: [
            { kind: 'note', text: 'We do not sell, rent, trade, share or give away any information about you, your organization, your repositories or your findings — not to advertisers, data brokers, partners or anyone else. The only service provider that receives any of it is Anthropic, and only de-identified report and finding data for organizations that asked for AI (see “AI-written reports and explanations”).' },
            { kind: 'p', text: 'Our only goal is to give you the best possible application security experience. We collect the minimum information required to run Artemis, use it only for that purpose, and do not build profiles about you, track you across other websites or show advertising.' },
          ],
        },
        {
          id: 'controller',
          title: 'Who is responsible',
          blocks: [
            { kind: 'p', text: `Artemis (“Artemis”, “we”) is the data controller for the service at artemisappsec.papopromines.com.br. Contact: ${CONTACT}.` },
            { kind: 'p', text: 'Artemis is open source under the MIT License, so anyone can run their own copy. This policy covers only artemisappsec.papopromines.com.br: whoever runs another instance is the controller of the data in it and is responsible for it.' },
          ],
        },
        {
          id: 'data-we-process',
          title: 'Information we process',
          blocks: [
            {
              kind: 'table',
              head: ['Information', 'Why we need it'],
              rows: [
                ['Your account: name, username, e-mail address and whether it is verified. It is kept by our identity service (Keycloak, running on Artemis’s own infrastructure); your password is stored there only as a salted one-way hash and Artemis itself never receives it', 'To create your account, sign you in, protect it (password rules, temporary lockout after repeated failed attempts, optional two-factor authentication) and show who you are.'],
                ['The date you accepted the Terms of Use and this Privacy Policy when registering', 'To record your consent, as the law requires.'],
                ['Password-reset messages', 'Sent only to your address, when you ask to recover your account. We never send marketing e-mails.'],
                ['Security events of the identity service: sign-ins, failed sign-ins, sign-outs and account changes, with the username, IP address, time and the application used; changes that administrators make to accounts are recorded too', 'To detect and investigate attacks on accounts and misuse of administrator access. Kept for 90 days, then deleted automatically.'],
                ['Memberships: the organizations you belong to, your role in each, your last activity, and invitations (invited e-mail, role, who invited and when it expires)', 'To apply your permissions, keep each organization’s data separate and let you join organizations you are invited to.'],
                ['Organization settings and who owns each organization', 'To run each organization’s workspace and let its owner control it.'],
                ['Repository addresses, branches, scanned commit and SSH deploy keys', 'To read your code and run the security pipeline you configured. Artemis generates one read-only deploy key per repository (public or private — every repository needs one); its private key is encrypted at rest, never shown or sent to anyone, and only handed to the isolated scanner while it clones. We never ask for your passwords or personal keys.'],
                ['Findings, pipeline runs, logs, reports, policies and risk acceptances', 'To show the security posture of your projects and their history.'],
                ['API tokens', 'Stored only as a one-way hash plus the last four characters, so nobody — including us — can read them back.'],
                ['The optional features enabled for your organization and the number of scans it used this month', 'To apply the usage limits and provide the features the Artemis administrators enabled for your organization.'],
                ['Language, theme and session in your browser’s local storage', 'To remember your preferences and keep you signed in. This stays on your device.'],
              ],
            },
            { kind: 'p', text: 'We do not use advertising cookies, analytics trackers or third-party tracking scripts. The app’s pages, scripts and fonts are served from Artemis’s own servers, so your browser does not contact third parties (such as font or CDN providers) while you use it. Artemis is free: there are no paid plans, and it does not collect or store any payment information.' },
          ],
        },
        {
          id: 'source-code',
          title: 'Your source code',
          blocks: [
            { kind: 'p', text: 'Scans run on Artemis’s own infrastructure — we do not send your code to any third-party scanning service. For each scan, the repository is cloned (read-only, latest commit of the chosen branch) into an isolated scanner that has no access to our database, and the open-source tools listed on the Third-party notices page analyze it there.' },
            { kind: 'p', text: 'The copy of your code exists only while the scan runs and is deleted as soon as it finishes. We keep only the results: findings, short tool logs and reports. Source code is not used for any other purpose, sold or shared, and results belong to your organization. The same applies to container images you ask us to scan: we pull them from their registry into the isolated scanner, never build or run them, and delete them after the scan; the registry sees only an anonymous download from our servers.' },
            { kind: 'p', text: 'Secrets found in your code are redacted by the scanner before anything is stored: Artemis records the rule, file and line, never the secret itself. Logs are limited in size and secret-looking values are masked.' },
            { kind: 'p', text: 'Every repository is cloned over SSH with its own read-only deploy key, which is written to the scanner’s temporary memory only for the clone and deleted right after. Deploy keys are deleted when you rotate them, revoke them or remove the repository.' },
          ],
        },
        {
          id: 'external-services',
          title: 'Public vulnerability data',
          blocks: [
            { kind: 'p', text: 'To match dependencies against known vulnerabilities, the scanner downloads public vulnerability databases (published by the Trivy and Grype projects from sources such as the NIST National Vulnerability Database and the GitHub Advisory Database) and checks your dependencies locally. These downloads are the same for everyone and send no information about you, your organization or your code. Scanner telemetry and update checks are turned off.' },
          ],
        },
        {
          id: 'ai-reports',
          title: 'AI-written reports and explanations',
          blocks: [
            { kind: 'p', text: 'This applies only to organizations for which the Artemis administrators enabled AI (on request). For those organizations, when a report is generated, Artemis sends aggregated, de-identified vulnerability data to Anthropic (Claude API), which writes the report’s executive summary and recommendations. Anthropic acts as our processor (service provider): it processes the data only to write that text, on our instructions. This is not a sale or sharing of your data, and Artemis uses the text for nothing else.' },
            { kind: 'p', text: 'Sent to Anthropic:' },
            {
              kind: 'ul',
              items: [
                'The report type and the length of its period; counts of findings detected, fixed and open, mean time to remediate, SLA compliance, open findings by severity and by kind, and how many are past their deadline; the number of open findings per OWASP Top 10 category',
                'For up to 8 top risks: the public CVE or the scanner rule id, the finding title (not for secrets), severity, CVSS score, CWE, package name, installed and fixed versions, kind and age in days',
              ],
            },
            { kind: 'p', text: 'Never sent:' },
            {
              kind: 'ul',
              items: [
                'Source code, file names, paths or lines',
                'Secret values or what a secret rule matched (secrets are identified only by the rule id)',
                'Names or URLs of repositories, the organization’s name, people’s names or e-mail addresses, deploy keys, tokens or tool logs',
              ],
            },
            { kind: 'p', text: 'AI explanations of findings: in the same organizations, a member whose role has the triage permission can ask for a short AI explanation of one finding (impact, when it can be exploited, priority and fix) by clicking “Explain with AI”. Nothing is sent automatically. The explanation is saved in Artemis for the organization and reused for every occurrence of the same CVE in the same package version (or the same rule), so the data is sent at most once per finding type; it is never shared with other organizations. For each explanation Artemis sends:' },
            {
              kind: 'ul',
              items: [
                'The kind of finding, the public CVE or the scanner rule id, the finding title and the scanner description (shortened; neither for secrets), severity, CVSS score and vector, CWE, package name, ecosystem, installed and fixed versions, the organization’s language',
                'The technology stack of the repository (for example “Java + Spring”), not its name',
              ],
            },
            { kind: 'p', text: 'The “Never sent” list above applies to explanations too.' },
            { kind: 'p', text: 'Artemis uses the Claude API under Anthropic’s commercial terms and data processing terms, under which Anthropic does not use this data to train its models. Anthropic may process it outside Brazil (for example in the United States); this international transfer relies on the safeguards in those terms, as permitted by the LGPD and the GDPR. Anthropic keeps request data only for a limited time as its terms describe, for example to detect abuse.' },
            { kind: 'p', text: 'Reports and explanations written this way are marked “AI-generated”. Without AI enabled, or when the AI service is unavailable, no data is sent and Artemis writes the report text itself. An organization can ask the Artemis administrators to turn AI off at any time.' },
          ],
        },
        {
          id: 'administrators',
          title: 'Platform administrators',
          blocks: [
            { kind: 'p', text: 'Accounts with an Artemis administrator role can see the list of organizations — name, URL, creation date, the owner’s display name and the number of members and repositories — so they can enable or disable optional features (AI-assisted triage, scheduled scans, renaming the organization) and delete organizations.' },
            { kind: 'p', text: 'To support and moderate the service, administrators can also open any organization read-only, with the same access as a viewer: its repositories and their settings, findings, pipeline runs and logs, reports, policies and members’ names and roles — not members’ e-mail addresses. They are not members of your organization and cannot make changes inside it: no scans, triage, settings or team changes. Each time an administrator opens an organization this way, it is recorded in our server logs (the administrator’s username, the organization and the time).' },
            { kind: 'p', text: 'Administrators can also see the list of accounts — name, username, e-mail address, creation date and the organizations each account belongs to with its role — and can delete an account, for example in case of abuse or at the account holder’s request. Deleting an account removes it from our identity provider (ending its sessions) and removes its memberships; the organization data it contributed stays with each organization. Accounts that own an organization, and other administrators, cannot be deleted this way. A deleted account can register again later as a new account.' },
          ],
        },
        {
          id: 'legal-requests',
          title: 'The only exception: the law',
          blocks: [
            { kind: 'p', text: 'We will only disclose information if we are compelled by a valid and binding legal order. In that case we disclose the minimum required, challenge requests that are overly broad and, whenever the law allows, notify the affected organization before doing so.' },
          ],
        },
        {
          id: 'security',
          title: 'How we protect information',
          blocks: [
            {
              kind: 'ul',
              items: [
                'Sign-in through OpenID Connect; Artemis never sees or stores your password.',
                'Encrypted connections (HTTPS) between your browser, the app and the sign-in service.',
                'Secrets such as API tokens are stored only as hashes; identity-provider client secrets are never stored by the app.',
                'Private keys of deploy keys are encrypted with AES-256-GCM under a key kept outside the database, and the scanner only connects to Git servers whose host key it trusts.',
                'Each organization’s data is isolated: every request is checked against your membership and your role in that organization.',
                'Password policy and protection against repeated sign-in attempts at the identity service.',
              ],
            },
          ],
        },
        {
          id: 'retention',
          title: 'Retention and deletion',
          blocks: [
            { kind: 'p', text: 'Findings history, pipeline logs and reports are kept while the organization exists. When its owner or an Artemis administrator deletes an organization, all of its data is deleted with it. When a repository is removed, its deploy key is deleted right away; its findings, pipeline runs and logs, reports and risk acceptances are kept as part of the organization’s history unless the person removing it chooses to delete them too, and stay until they are deleted later (Repositories → Removed repositories) or the organization is deleted. If you leave an organization, your access ends immediately; the findings history and changes you made stay with the organization, which owns that information. Pending invitations expire after 7 days.' },
            { kind: 'p', text: 'You can delete your account at any time from your account page at the identity service (select your name in the top bar) or by asking us. Deleting it removes your profile and memberships; if you own an organization, transfer ownership or delete the organization first. You can also ask us to delete your personal information at any time.' },
          ],
        },
        {
          id: 'rights',
          title: 'Your rights',
          blocks: [
            { kind: 'p', text: 'Under Brazil’s LGPD (Lei nº 13.709/2018), the GDPR and similar laws you can ask to access, correct, export or delete your personal information, and to know how it is used. We do not use your information for automated decisions about you.' },
            { kind: 'p', text: `Send requests to ${CONTACT}. We answer within 15 days.` },
          ],
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          blocks: [
            { kind: 'p', text: 'If we change this policy we will update the date above and, for significant changes, notify organization owners in advance. We will never change it to allow selling or sharing your information.' },
          ],
        },
      ],
    },
    'pt-BR': {
      title: 'Política de Privacidade',
      summary:
        'O Artemis existe para ajudar você a encontrar e corrigir vulnerabilidades. Não temos interesse nos seus dados nem nos da sua organização além do necessário para o serviço funcionar, e nunca os vendemos, alugamos, trocamos ou compartilhamos.',
      updated: `Última atualização: ${UPDATED}`,
      sections: [
        {
          id: 'commitment',
          title: 'Nosso compromisso',
          blocks: [
            { kind: 'note', text: 'Não vendemos, alugamos, trocamos, compartilhamos nem cedemos nenhuma informação sobre você, sua organização, seus repositórios ou seus achados — nem para anunciantes, corretores de dados, parceiros ou qualquer outra pessoa. O único prestador de serviço que recebe algo é a Anthropic, e apenas dados desidentificados de relatórios e de achados, para organizações que pediram IA (veja “Relatórios e explicações escritos por IA”).' },
            { kind: 'p', text: 'Nosso único objetivo é oferecer a melhor experiência possível em segurança de aplicações. Coletamos o mínimo de informação necessário para o Artemis funcionar, usamos apenas para essa finalidade e não criamos perfis sobre você, não rastreamos você em outros sites e não exibimos publicidade.' },
          ],
        },
        {
          id: 'controller',
          title: 'Quem é o responsável',
          blocks: [
            { kind: 'p', text: `O Artemis (“Artemis”, “nós”) é o controlador dos dados do serviço em artemisappsec.papopromines.com.br. Contato: ${CONTACT}.` },
            { kind: 'p', text: 'O Artemis é código aberto sob a Licença MIT, então qualquer pessoa pode rodar a sua própria cópia. Esta política cobre apenas artemisappsec.papopromines.com.br: quem roda outra instância é o controlador dos dados dela e responde por ela.' },
          ],
        },
        {
          id: 'data-we-process',
          title: 'Informações que tratamos',
          blocks: [
            {
              kind: 'table',
              head: ['Informação', 'Por que precisamos'],
              rows: [
                ['Sua conta: nome, usuário, e-mail e se ele foi verificado. Ela fica no nosso serviço de identidade (Keycloak, rodando na infraestrutura do próprio Artemis); sua senha é guardada lá apenas como hash irreversível com salt e o Artemis em si nunca a recebe', 'Para criar sua conta, fazer seu login, protegê-la (regras de senha, bloqueio temporário após tentativas erradas repetidas, verificação em duas etapas opcional) e mostrar quem você é.'],
                ['A data em que você aceitou os Termos de Uso e esta Política de Privacidade no cadastro', 'Para registrar o seu consentimento, como a lei exige.'],
                ['Mensagens de redefinição de senha', 'Enviadas apenas ao seu endereço, quando você pede para recuperar a conta. Nunca enviamos e-mails de marketing.'],
                ['Eventos de segurança do serviço de identidade: logins, tentativas de login com erro, saídas e alterações de conta, com o nome de usuário, endereço IP, horário e a aplicação usada; as alterações que administradores fazem em contas também são registradas', 'Para detectar e investigar ataques a contas e o uso indevido do acesso de administrador. Mantidos por 90 dias e então apagados automaticamente.'],
                ['Vínculos: as organizações de que você participa, seu papel em cada uma, sua última atividade e convites (e-mail convidado, papel, quem convidou e quando expira)', 'Para aplicar suas permissões, manter os dados de cada organização separados e permitir que você entre nas organizações para as quais foi convidado.'],
                ['Configurações da organização e quem é o proprietário de cada uma', 'Para manter o espaço de trabalho de cada organização e permitir que o proprietário a controle.'],
                ['Endereços de repositórios, branches, commit analisado e deploy keys SSH', 'Para ler seu código e executar o pipeline de segurança que você configurou. O Artemis gera uma deploy key somente leitura por repositório (público ou privado — todo repositório precisa de uma); a chave privada fica criptografada, nunca é exibida nem enviada a ninguém e só é entregue ao scanner isolado durante o clone. Nunca pedimos suas senhas ou chaves pessoais.'],
                ['Achados, execuções de pipeline, logs, relatórios, políticas e aceitações de risco', 'Para mostrar a postura de segurança dos seus projetos e o histórico.'],
                ['Tokens de API', 'Armazenados apenas como hash irreversível e os quatro últimos caracteres, para que ninguém — nem nós — consiga lê-los novamente.'],
                ['As funcionalidades opcionais habilitadas para a sua organização e o número de análises usadas no mês', 'Para aplicar os limites de uso e oferecer as funcionalidades que os administradores do Artemis habilitaram para a sua organização.'],
                ['Idioma, tema e sessão no armazenamento local do navegador', 'Para lembrar suas preferências e manter você conectado. Isso fica no seu dispositivo.'],
              ],
            },
            { kind: 'p', text: 'Não usamos cookies de publicidade, ferramentas de analytics nem scripts de rastreamento de terceiros. As páginas, os scripts e as fontes do aplicativo são servidos pelos servidores do próprio Artemis, então seu navegador não contata terceiros (como provedores de fontes ou CDNs) enquanto você o usa. O Artemis é gratuito: não há planos pagos, e ele não coleta nem armazena nenhum dado de pagamento.' },
          ],
        },
        {
          id: 'source-code',
          title: 'Seu código-fonte',
          blocks: [
            { kind: 'p', text: 'As análises rodam na infraestrutura do próprio Artemis — não enviamos seu código para nenhum serviço de análise de terceiros. Em cada análise, o repositório é clonado (somente leitura, último commit da branch escolhida) em um scanner isolado, sem acesso ao nosso banco de dados, e as ferramentas de código aberto listadas na página Avisos de terceiros o analisam lá.' },
            { kind: 'p', text: 'A cópia do seu código existe apenas enquanto a análise roda e é apagada assim que ela termina. Guardamos somente os resultados: achados, logs curtos das ferramentas e relatórios. O código-fonte não é usado para nenhuma outra finalidade, vendido ou compartilhado, e os resultados pertencem à sua organização. O mesmo vale para as imagens de contêiner que você pede para analisar: nós as baixamos do registry para o scanner isolado, nunca as construímos nem executamos, e as apagamos após a análise; o registry vê apenas um download anônimo vindo dos nossos servidores.' },
            { kind: 'p', text: 'Segredos encontrados no seu código são ocultados pelo scanner antes de qualquer armazenamento: o Artemis registra a regra, o arquivo e a linha, nunca o segredo em si. Os logs têm tamanho limitado e valores que parecem segredos são mascarados.' },
            { kind: 'p', text: 'Todo repositório é clonado via SSH com a sua própria deploy key somente leitura, que é gravada na memória temporária do scanner só para o clone e apagada logo depois. As deploy keys são apagadas quando você as troca, revoga ou remove o repositório.' },
          ],
        },
        {
          id: 'external-services',
          title: 'Dados públicos de vulnerabilidades',
          blocks: [
            { kind: 'p', text: 'Para comparar dependências com vulnerabilidades conhecidas, o scanner baixa bancos públicos de vulnerabilidades (publicados pelos projetos Trivy e Grype a partir de fontes como a National Vulnerability Database do NIST e o GitHub Advisory Database) e verifica suas dependências localmente. Esses downloads são iguais para todos e não enviam nenhuma informação sobre você, sua organização ou seu código. A telemetria e as verificações de atualização dos scanners ficam desligadas.' },
          ],
        },
        {
          id: 'ai-reports',
          title: 'Relatórios e explicações escritos por IA',
          blocks: [
            { kind: 'p', text: 'Isto vale apenas para organizações em que os administradores do Artemis habilitaram a IA (mediante solicitação). Para essas organizações, quando um relatório é gerado, o Artemis envia dados de vulnerabilidades agregados e desidentificados ao Anthropic (Claude API), que escreve o resumo executivo e as recomendações do relatório. A Anthropic atua como nossa operadora (prestador de serviço): trata os dados apenas para escrever esse texto, conforme nossas instruções. Isso não é venda nem compartilhamento dos seus dados, e o Artemis não usa o texto para mais nada.' },
            { kind: 'p', text: 'Enviado à Anthropic:' },
            {
              kind: 'ul',
              items: [
                'O tipo do relatório e a duração do período; contagens de achados detectados, corrigidos e abertos, tempo médio de correção, conformidade com o SLA, achados abertos por severidade e por tipo, e quantos passaram do prazo; o número de achados abertos por categoria do OWASP Top 10',
                'Para até 8 principais riscos: o CVE público ou o id da regra do scanner, o título do achado (exceto para segredos), severidade, nota CVSS, CWE, nome do pacote, versões instalada e corrigida, tipo e idade em dias',
              ],
            },
            { kind: 'p', text: 'Nunca enviado:' },
            {
              kind: 'ul',
              items: [
                'Código-fonte, nomes, caminhos ou linhas de arquivos',
                'Valores de segredos ou o que uma regra de segredos encontrou (segredos são identificados apenas pelo id da regra)',
                'Nomes ou URLs de repositórios, o nome da organização, nomes ou e-mails de pessoas, chaves de implantação, tokens ou logs das ferramentas',
              ],
            },
            { kind: 'p', text: 'Explicações de achados por IA: nessas mesmas organizações, um membro cujo papel tem a permissão de triagem pode pedir uma explicação curta de um achado por IA (impacto, quando pode ser explorado, prioridade e correção) clicando em “Explicar com IA”. Nada é enviado automaticamente. A explicação fica salva no Artemis para a organização e é reutilizada em todas as ocorrências do mesmo CVE na mesma versão do pacote (ou da mesma regra), então os dados são enviados no máximo uma vez por tipo de achado; ela nunca é compartilhada com outras organizações. Para cada explicação o Artemis envia:' },
            {
              kind: 'ul',
              items: [
                'O tipo do achado, o CVE público ou o id da regra do scanner, o título do achado e a descrição do scanner (encurtada; nenhum dos dois para segredos), severidade, nota e vetor CVSS, CWE, nome do pacote, ecossistema, versões instalada e corrigida, o idioma da organização',
                'A stack de tecnologia do repositório (por exemplo, “Java + Spring”), não o nome dele',
              ],
            },
            { kind: 'p', text: 'A lista “Nunca enviado” acima também vale para as explicações.' },
            { kind: 'p', text: 'O Artemis usa a API do Claude sob os termos comerciais e de tratamento de dados da Anthropic, segundo os quais a Anthropic não usa esses dados para treinar seus modelos. A Anthropic pode tratá-los fora do Brasil (por exemplo, nos Estados Unidos); essa transferência internacional se apoia nas salvaguardas desses termos, como permitem a LGPD e o GDPR. A Anthropic guarda os dados das requisições apenas por tempo limitado, como descrevem seus termos, por exemplo para detectar abusos.' },
            { kind: 'p', text: 'Relatórios e explicações escritos assim são marcados como “Gerado por IA”. Sem a IA habilitada, ou quando o serviço de IA está indisponível, nenhum dado é enviado e o próprio Artemis escreve o texto do relatório. Uma organização pode pedir aos administradores do Artemis que desliguem a IA a qualquer momento.' },
          ],
        },
        {
          id: 'administrators',
          title: 'Administradores da plataforma',
          blocks: [
            { kind: 'p', text: 'Contas com o papel de administrador do Artemis podem ver a lista de organizações — nome, URL, data de criação, nome de exibição do proprietário e número de membros e de repositórios — para habilitar ou desabilitar funcionalidades opcionais (triagem com IA, análises agendadas, renomear a organização) e excluir organizações.' },
            { kind: 'p', text: 'Para dar suporte e moderar o serviço, os administradores também podem abrir qualquer organização em modo somente leitura, com o mesmo acesso de um leitor: os repositórios e suas configurações, os achados, as execuções de pipeline e seus logs, os relatórios, as políticas e os nomes e papéis dos membros — não os e-mails dos membros. Eles não são membros da sua organização e não podem fazer alterações nela: nada de análises, triagem, configurações ou mudanças na equipe. Cada vez que um administrador abre uma organização dessa forma, isso fica registrado nos logs do nosso servidor (o nome de usuário do administrador, a organização e o horário).' },
            { kind: 'p', text: 'Os administradores também podem ver a lista de contas — nome, nome de usuário, endereço de e-mail, data de criação e as organizações de que cada conta participa com o respectivo papel — e podem excluir uma conta, por exemplo em caso de abuso ou a pedido do titular. Excluir uma conta a remove do nosso provedor de identidade (encerrando suas sessões) e remove suas participações; os dados de organização que ela produziu permanecem com cada organização. Contas que são proprietárias de uma organização e outros administradores não podem ser excluídos dessa forma. Uma conta excluída pode se cadastrar novamente depois, como uma nova conta.' },
          ],
        },
        {
          id: 'legal-requests',
          title: 'A única exceção: a lei',
          blocks: [
            { kind: 'p', text: 'Só divulgaremos informações se formos obrigados por uma ordem legal válida e vinculante. Nesse caso divulgamos o mínimo exigido, contestamos pedidos excessivamente amplos e, sempre que a lei permitir, avisamos a organização afetada antes.' },
          ],
        },
        {
          id: 'security',
          title: 'Como protegemos as informações',
          blocks: [
            {
              kind: 'ul',
              items: [
                'Login via OpenID Connect; o Artemis nunca vê nem armazena sua senha.',
                'Conexões criptografadas (HTTPS) entre seu navegador, a aplicação e o serviço de login.',
                'Segredos como tokens de API são armazenados apenas como hash; segredos de cliente do provedor de identidade nunca são armazenados pela aplicação.',
                'As chaves privadas das deploy keys são criptografadas com AES-256-GCM sob uma chave mantida fora do banco de dados, e o scanner só se conecta a servidores Git cuja chave de host ele confia.',
                'Os dados de cada organização são isolados: toda requisição é verificada contra o seu vínculo e o seu papel naquela organização.',
                'Política de senhas e proteção contra tentativas repetidas de login no serviço de identidade.',
              ],
            },
          ],
        },
        {
          id: 'retention',
          title: 'Retenção e exclusão',
          blocks: [
            { kind: 'p', text: 'O histórico de achados, os logs de pipeline e os relatórios são mantidos enquanto a organização existir. Quando o proprietário ou um administrador do Artemis exclui uma organização, todos os dados dela são excluídos junto. Quando um repositório é removido, sua deploy key é apagada na hora; seus achados, execuções de pipeline e logs, relatórios e aceites de risco são mantidos como parte do histórico da organização, a menos que quem o remove escolha apagá-los também, e ficam até serem apagados depois (Repositórios → Repositórios removidos) ou até a organização ser excluída. Se você sair de uma organização, seu acesso termina na hora; o histórico de achados e as alterações que você fez permanecem com a organização, que é dona dessas informações. Convites pendentes expiram em 7 dias.' },
            { kind: 'p', text: 'Você pode excluir sua conta a qualquer momento pela página da sua conta no serviço de identidade (selecione seu nome na barra superior) ou pedindo para nós. A exclusão remove seu perfil e seus vínculos; se você for proprietário de uma organização, transfira a propriedade ou exclua a organização antes. Você também pode pedir a exclusão das suas informações pessoais a qualquer momento.' },
          ],
        },
        {
          id: 'rights',
          title: 'Seus direitos',
          blocks: [
            { kind: 'p', text: 'Pela LGPD (Lei nº 13.709/2018), pelo GDPR e por leis semelhantes, você pode pedir acesso, correção, portabilidade ou exclusão das suas informações pessoais e saber como são usadas. Não usamos suas informações para decisões automatizadas sobre você.' },
            { kind: 'p', text: `Envie seus pedidos para ${CONTACT}. Respondemos em até 15 dias.` },
          ],
        },
        {
          id: 'changes',
          title: 'Alterações nesta política',
          blocks: [
            { kind: 'p', text: 'Se alterarmos esta política, atualizaremos a data acima e, em mudanças relevantes, avisaremos os proprietários das organizações com antecedência. Nunca a alteraremos para permitir a venda ou o compartilhamento das suas informações.' },
          ],
        },
      ],
    },
  },
  terms: {
    'en-US': {
      title: 'Terms of Use',
      summary:
        'These terms explain how you may use Artemis. In short: use it to secure software you are authorized to test, keep your account safe, and remember that your data stays yours and is never shared.',
      updated: `Last updated: ${UPDATED}`,
      sections: [
        {
          id: 'acceptance',
          title: 'Acceptance',
          blocks: [
            { kind: 'p', text: 'You accept these Terms of Use and the Privacy Policy when you create your account, and by signing in to or using Artemis. If you use Artemis on behalf of a company or another organization, you confirm you are allowed to accept these terms for it.' },
          ],
        },
        {
          id: 'service',
          title: 'The service',
          blocks: [
            { kind: 'p', text: 'Artemis is an application security testing platform: it connects to your repositories, runs the security pipeline you configure (such as secret scanning, SAST and dependency scanning) and reports the findings. Features may change as the product evolves.' },
            { kind: 'p', text: 'The service at artemisappsec.papopromines.com.br is provided free of charge.' },
            { kind: 'p', text: 'Scans are performed on Artemis’s own infrastructure by third-party open-source tools, each used unmodified and under its own license (see Third-party notices). Repositories are only cloned over SSH with a read-only deploy key generated by Artemis, which you add to repositories you control; container images are pulled only from public registries.' },
          ],
        },
        {
          id: 'accounts',
          title: 'Accounts and access',
          blocks: [
            {
              kind: 'ul',
              items: [
                'Register with an e-mail address you control; give accurate information and keep one account per person.',
                'Keep your password and API tokens confidential. You are responsible for what is done with your account.',
                'Tell us immediately at the contact below if you suspect unauthorized access.',
              ],
            },
          ],
        },
        {
          id: 'organizations',
          title: 'Organizations and roles',
          blocks: [
            {
              kind: 'ul',
              items: [
                'Whoever creates an organization becomes its owner and is responsible for it: who is invited, the roles assigned, the repositories connected and the organization’s compliance with these terms. Each organization has exactly one owner.',
                'Owners and admins decide who belongs to the organization and which role each member has. Members act on behalf of the organization and only within the permissions of their role.',
                'The owner may transfer ownership to another active member. Members may leave at any time; information they created remains with the organization.',
                'The owner may delete the organization, which permanently deletes all of its data.',
              ],
            },
          ],
        },
        {
          id: 'acceptable-use',
          title: 'Acceptable use',
          blocks: [
            { kind: 'p', text: 'You may only connect repositories, container images and test environments that you own or are explicitly authorized to test. You must not:' },
            {
              kind: 'ul',
              items: [
                'Use Artemis against systems you are not authorized to test.',
                'Try to access other organizations’ data, bypass security controls or disrupt the service.',
                'Upload private keys, passwords or other secrets you are not supposed to share.',
                'Use the service to develop or distribute malware or to break the law.',
                'Grant a deploy key write access: give each key read-only access to its repository only, and remove it from your Git provider when you stop scanning that repository or stop using Artemis.',
              ],
            },
          ],
        },
        {
          id: 'your-data',
          title: 'Your data stays yours',
          blocks: [
            { kind: 'note', text: 'Your code, repositories, findings, reports and organization information belong to you. We do not claim any ownership, and we never sell or share them — see the Privacy Policy.' },
            { kind: 'p', text: 'You give us only the permission needed to store and process this information to provide the service to you.' },
          ],
        },
        {
          id: 'results',
          title: 'Security results',
          blocks: [
            { kind: 'p', text: 'Automated analysis helps reduce risk but cannot guarantee that software is free of vulnerabilities. Findings may include false positives or miss issues; you remain responsible for reviewing them and for the security decisions you make.' },
            { kind: 'p', text: 'Report summaries and recommendations and finding explanations marked “AI-generated” are written by an AI model (Anthropic Claude) and may be inaccurate, incomplete or out of date. Review them before sharing or acting on them; they are not professional advice.' },
          ],
        },
        {
          id: 'license',
          title: 'Software license',
          blocks: [
            { kind: 'p', text: `Artemis is open source under the MIT License (${REPOSITORY}). You may use, copy, modify and distribute it, including commercially, under the terms of that license.` },
            { kind: 'p', text: 'These Terms apply only to the service at artemisappsec.papopromines.com.br. Whoever runs their own copy of Artemis is responsible for that instance, its users and the data in it.' },
          ],
        },
        {
          id: 'limits',
          title: 'Free service, limits and optional features',
          blocks: [
            { kind: 'p', text: 'Artemis is free: there are no paid plans and nothing is ever charged. To keep it available to everyone, each organization can run up to 25 scans per month and each account can own one organization; organizations created before this rule remain available. Each pipeline run counts as one scan, except runs that end before any stage runs (for example when the repository cannot be accessed or cloned); once the monthly limit is reached, new runs are refused until the next calendar month.' },
            { kind: 'p', text: 'The Artemis administrators may enable optional features for an organization, and turn them off again: AI (AI-written report summaries — see the Privacy Policy for the data sent to Anthropic — and AI explanations of findings, on request), scheduled scans and renaming the organization. Scheduled scans (every 6 hours, 24 hours or 7 days) are started by Artemis on your organization’s behalf with your repository settings and count toward the monthly scan limit like any other run; when the limit is reached they are skipped. Only schedule repositories you are authorized to scan.' },
            { kind: 'p', text: 'To manage these features and support the service, administrators see the list of organizations with their name, URL, creation date, the owner’s display name and the number of members and repositories, and can open any organization read-only (as a viewer, without members’ e-mail addresses). They also see the list of accounts (name, username, e-mail address, creation date, organizations and roles). They are not members of your organization and cannot change anything inside it. See the Privacy Policy for details.' },
          ],
        },
        {
          id: 'liability',
          title: 'Availability and liability',
          blocks: [
            { kind: 'p', text: 'We work to keep Artemis available and secure, but the service is provided free of charge and “as is”, without warranties of uninterrupted operation. To the extent permitted by law, we are not liable for indirect damages, loss of profits or data resulting from the use of the service.' },
          ],
        },
        {
          id: 'termination',
          title: 'Suspension and termination',
          blocks: [
            { kind: 'p', text: 'You may stop using Artemis, leave or delete your organizations and delete your account at any time. We may suspend access that violates these terms, explaining the reason whenever possible. The Artemis administrators may delete an organization and all of its data — for example in case of abuse, long inactivity or at its owner’s request — and may delete accounts (with their organization memberships), for example in case of abuse or at the account holder’s request; an account that owns an organization is only deleted after that organization is deleted or its ownership is transferred.' },
          ],
        },
        {
          id: 'law',
          title: 'Changes and applicable law',
          blocks: [
            { kind: 'p', text: 'We will notify organization owners of significant changes to these terms in advance. These terms are governed by the laws of Brazil.' },
            { kind: 'p', text: `Questions: ${CONTACT}.` },
          ],
        },
      ],
    },
    'pt-BR': {
      title: 'Termos de Uso',
      summary:
        'Estes termos explicam como você pode usar o Artemis. Em resumo: use-o para proteger software que você está autorizado a testar, mantenha sua conta segura e lembre-se de que seus dados continuam seus e nunca são compartilhados.',
      updated: `Última atualização: ${UPDATED}`,
      sections: [
        {
          id: 'acceptance',
          title: 'Aceitação',
          blocks: [
            { kind: 'p', text: 'Você aceita estes Termos de Uso e a Política de Privacidade ao criar sua conta, e ao entrar ou usar o Artemis. Se usar o Artemis em nome de uma empresa ou outra organização, você confirma que pode aceitar estes termos por ela.' },
          ],
        },
        {
          id: 'service',
          title: 'O serviço',
          blocks: [
            { kind: 'p', text: 'O Artemis é uma plataforma de testes de segurança de aplicações: conecta-se aos seus repositórios, executa o pipeline de segurança que você configura (como varredura de segredos, SAST e análise de dependências) e reporta os achados. As funcionalidades podem mudar conforme o produto evolui.' },
            { kind: 'p', text: 'O serviço em artemisappsec.papopromines.com.br é oferecido gratuitamente.' },
            { kind: 'p', text: 'As análises são feitas na infraestrutura do próprio Artemis por ferramentas de código aberto de terceiros, cada uma usada sem modificações e sob a sua própria licença (veja Avisos de terceiros). Os repositórios são clonados apenas via SSH com uma deploy key somente leitura gerada pelo Artemis, que você adiciona a repositórios que controla; imagens de contêiner são baixadas apenas de registries públicos.' },
          ],
        },
        {
          id: 'accounts',
          title: 'Contas e acesso',
          blocks: [
            {
              kind: 'ul',
              items: [
                'Cadastre-se com um e-mail que você controla; informe dados corretos e mantenha uma conta por pessoa.',
                'Mantenha sua senha e seus tokens de API em sigilo. Você é responsável pelo que for feito com a sua conta.',
                'Avise-nos imediatamente pelo contato abaixo se suspeitar de acesso não autorizado.',
              ],
            },
          ],
        },
        {
          id: 'organizations',
          title: 'Organizações e papéis',
          blocks: [
            {
              kind: 'ul',
              items: [
                'Quem cria uma organização passa a ser o proprietário e é responsável por ela: quem é convidado, os papéis atribuídos, os repositórios conectados e o cumprimento destes termos pela organização. Cada organização tem exatamente um proprietário.',
                'Proprietários e administradores decidem quem faz parte da organização e qual o papel de cada membro. Os membros agem em nome da organização e somente dentro das permissões do seu papel.',
                'O proprietário pode transferir a propriedade para outro membro ativo. Membros podem sair a qualquer momento; as informações que criaram permanecem com a organização.',
                'O proprietário pode excluir a organização, o que apaga permanentemente todos os dados dela.',
              ],
            },
          ],
        },
        {
          id: 'acceptable-use',
          title: 'Uso aceitável',
          blocks: [
            { kind: 'p', text: 'Você só pode conectar repositórios, imagens de contêiner e ambientes de teste que sejam seus ou que esteja expressamente autorizado a testar. Você não pode:' },
            {
              kind: 'ul',
              items: [
                'Usar o Artemis contra sistemas que não está autorizado a testar.',
                'Tentar acessar dados de outras organizações, contornar controles de segurança ou prejudicar o serviço.',
                'Enviar chaves privadas, senhas ou outros segredos que não deveria compartilhar.',
                'Usar o serviço para desenvolver ou distribuir malware ou para infringir a lei.',
                'Dar permissão de escrita a uma deploy key: dê a cada chave acesso somente leitura ao seu repositório e remova-a do seu provedor Git quando parar de analisar esse repositório ou de usar o Artemis.',
              ],
            },
          ],
        },
        {
          id: 'your-data',
          title: 'Seus dados continuam seus',
          blocks: [
            { kind: 'note', text: 'Seu código, repositórios, achados, relatórios e informações da organização pertencem a você. Não reivindicamos nenhuma propriedade e nunca os vendemos ou compartilhamos — veja a Política de Privacidade.' },
            { kind: 'p', text: 'Você nos concede apenas a permissão necessária para armazenar e processar essas informações a fim de prestar o serviço a você.' },
          ],
        },
        {
          id: 'results',
          title: 'Resultados de segurança',
          blocks: [
            { kind: 'p', text: 'A análise automatizada ajuda a reduzir riscos, mas não garante que um software esteja livre de vulnerabilidades. Os achados podem incluir falsos positivos ou deixar de detectar problemas; você continua responsável por revisá-los e pelas decisões de segurança que tomar.' },
            { kind: 'p', text: 'Resumos e recomendações de relatórios e explicações de achados marcados como “Gerado por IA” são escritos por um modelo de IA (Anthropic Claude) e podem ser imprecisos, incompletos ou desatualizados. Revise-os antes de compartilhar ou agir com base neles; eles não são aconselhamento profissional.' },
          ],
        },
        {
          id: 'license',
          title: 'Licença do software',
          blocks: [
            { kind: 'p', text: `O Artemis é código aberto sob a Licença MIT (${REPOSITORY}). Você pode usá-lo, copiá-lo, modificá-lo e distribuí-lo, inclusive comercialmente, nos termos dessa licença.` },
            { kind: 'p', text: 'Estes Termos valem apenas para o serviço em artemisappsec.papopromines.com.br. Quem roda a sua própria cópia do Artemis é responsável por essa instância, pelos usuários dela e pelos dados que ela guarda.' },
          ],
        },
        {
          id: 'limits',
          title: 'Serviço gratuito, limites e funcionalidades opcionais',
          blocks: [
            { kind: 'p', text: 'O Artemis é gratuito: não há planos pagos e nada é cobrado. Para mantê-lo disponível para todos, cada organização pode executar até 25 análises por mês e cada conta pode ser proprietária de uma organização; organizações criadas antes desta regra continuam disponíveis. Cada execução de pipeline conta como uma análise, exceto execuções que terminam antes de qualquer etapa rodar (por exemplo, quando o repositório não pode ser acessado ou clonado); ao atingir o limite mensal, novas execuções são recusadas até o mês seguinte.' },
            { kind: 'p', text: 'Os administradores do Artemis podem habilitar funcionalidades opcionais para uma organização, e desabilitá-las depois: IA (resumos de relatórios escritos por IA — veja na Política de Privacidade os dados enviados à Anthropic — e explicações de achados por IA, mediante solicitação), análises agendadas e renomear a organização. As análises agendadas (a cada 6 horas, 24 horas ou 7 dias) são iniciadas pelo Artemis em nome da sua organização, com as configurações do repositório, e contam no limite mensal de análises como qualquer outra execução; ao atingir o limite, elas são puladas. Agende apenas repositórios que você está autorizado a analisar.' },
            { kind: 'p', text: 'Para gerenciar essas funcionalidades e dar suporte ao serviço, os administradores veem a lista de organizações com nome, URL, data de criação, nome de exibição do proprietário e número de membros e de repositórios, e podem abrir qualquer organização em modo somente leitura (como leitor, sem os e-mails dos membros). Também veem a lista de contas (nome, nome de usuário, e-mail, data de criação, organizações e papéis). Eles não são membros da sua organização e não podem alterar nada nela. Veja a Política de Privacidade para mais detalhes.' },
          ],
        },
        {
          id: 'liability',
          title: 'Disponibilidade e responsabilidade',
          blocks: [
            { kind: 'p', text: 'Trabalhamos para manter o Artemis disponível e seguro, mas o serviço é fornecido gratuitamente e “no estado em que se encontra”, sem garantia de funcionamento ininterrupto. Na medida permitida pela lei, não nos responsabilizamos por danos indiretos, lucros cessantes ou perda de dados decorrentes do uso do serviço.' },
          ],
        },
        {
          id: 'termination',
          title: 'Suspensão e encerramento',
          blocks: [
            { kind: 'p', text: 'Você pode deixar de usar o Artemis, sair das suas organizações ou excluí-las e excluir sua conta a qualquer momento. Podemos suspender acessos que violem estes termos, explicando o motivo sempre que possível. Os administradores do Artemis podem excluir uma organização e todos os seus dados — por exemplo, em caso de abuso, longa inatividade ou a pedido do proprietário — e podem excluir contas (com suas participações em organizações), por exemplo em caso de abuso ou a pedido do titular; uma conta proprietária de uma organização só é excluída depois que essa organização for excluída ou sua propriedade for transferida.' },
          ],
        },
        {
          id: 'law',
          title: 'Alterações e lei aplicável',
          blocks: [
            { kind: 'p', text: 'Avisaremos os proprietários das organizações com antecedência sobre mudanças relevantes nestes termos. Estes termos são regidos pelas leis do Brasil.' },
            { kind: 'p', text: `Dúvidas: ${CONTACT}.` },
          ],
        },
      ],
    },
  },
};
