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
const UPDATED = '2026-10-16';

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
            { kind: 'note', text: 'We do not sell, rent, trade, share or give away any information about you, your organization, your repositories or your findings — not to advertisers, data brokers, partners or anyone else.' },
            { kind: 'p', text: 'Our only goal is to give you the best possible application security experience. We collect the minimum information required to run Artemis, use it only for that purpose, and do not build profiles about you, track you across other websites or show advertising.' },
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
                ['Memberships: the organizations you belong to, your role in each, your last activity, and invitations (invited e-mail, role, who invited and when it expires)', 'To apply your permissions, keep each organization’s data separate and let you join organizations you are invited to.'],
                ['Organization settings and who owns each organization', 'To run each organization’s workspace and let its owner control it.'],
                ['Repository addresses, branches, scanned commit and SSH deploy keys', 'To read your code and run the security pipeline you configured. For private repositories Artemis generates one read-only deploy key per repository; its private key is encrypted at rest, never shown or sent to anyone, and only handed to the isolated scanner while it clones. We never ask for your passwords or personal keys.'],
                ['Findings, pipeline runs, logs, reports, policies and risk acceptances', 'To show the security posture of your projects and their history.'],
                ['API tokens', 'Stored only as a one-way hash plus the last four characters, so nobody — including us — can read them back.'],
                ['Your organization’s plan (Free or PRO) and since when', 'To provide the features included in your plan.'],
                ['Language, theme and session in your browser’s local storage', 'To remember your preferences and keep you signed in. This stays on your device.'],
              ],
            },
            { kind: 'p', text: 'We do not use advertising cookies, analytics trackers or third-party tracking scripts. Artemis does not collect or store payment information: payments are not enabled yet, and when they are, this policy will be updated before anything changes.' },
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
            { kind: 'p', text: 'Your organization decides how long findings history and pipeline logs are kept (Organization settings → Data retention). When its owner deletes an organization, all of its data is deleted with it. If you leave an organization, your access ends immediately; the findings history and changes you made stay with the organization, which owns that information. Pending invitations expire after 7 days.' },
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
            { kind: 'note', text: 'Não vendemos, alugamos, trocamos, compartilhamos nem cedemos nenhuma informação sobre você, sua organização, seus repositórios ou seus achados — nem para anunciantes, corretores de dados, parceiros ou qualquer outra pessoa.' },
            { kind: 'p', text: 'Nosso único objetivo é oferecer a melhor experiência possível em segurança de aplicações. Coletamos o mínimo de informação necessário para o Artemis funcionar, usamos apenas para essa finalidade e não criamos perfis sobre você, não rastreamos você em outros sites e não exibimos publicidade.' },
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
                ['Vínculos: as organizações de que você participa, seu papel em cada uma, sua última atividade e convites (e-mail convidado, papel, quem convidou e quando expira)', 'Para aplicar suas permissões, manter os dados de cada organização separados e permitir que você entre nas organizações para as quais foi convidado.'],
                ['Configurações da organização e quem é o proprietário de cada uma', 'Para manter o espaço de trabalho de cada organização e permitir que o proprietário a controle.'],
                ['Endereços de repositórios, branches, commit analisado e deploy keys SSH', 'Para ler seu código e executar o pipeline de segurança que você configurou. Para repositórios privados o Artemis gera uma deploy key somente leitura por repositório; a chave privada fica criptografada, nunca é exibida nem enviada a ninguém e só é entregue ao scanner isolado durante o clone. Nunca pedimos suas senhas ou chaves pessoais.'],
                ['Achados, execuções de pipeline, logs, relatórios, políticas e aceitações de risco', 'Para mostrar a postura de segurança dos seus projetos e o histórico.'],
                ['Tokens de API', 'Armazenados apenas como hash irreversível e os quatro últimos caracteres, para que ninguém — nem nós — consiga lê-los novamente.'],
                ['O plano da sua organização (Free ou PRO) e desde quando', 'Para oferecer as funcionalidades incluídas no seu plano.'],
                ['Idioma, tema e sessão no armazenamento local do navegador', 'Para lembrar suas preferências e manter você conectado. Isso fica no seu dispositivo.'],
              ],
            },
            { kind: 'p', text: 'Não usamos cookies de publicidade, ferramentas de analytics nem scripts de rastreamento de terceiros. O Artemis não coleta nem armazena dados de pagamento: os pagamentos ainda não estão habilitados e, quando estiverem, esta política será atualizada antes de qualquer mudança.' },
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
            { kind: 'p', text: 'Sua organização decide por quanto tempo o histórico de achados e os logs de pipeline são mantidos (Configurações da organização → Retenção de dados). Quando o proprietário exclui uma organização, todos os dados dela são excluídos junto. Se você sair de uma organização, seu acesso termina na hora; o histórico de achados e as alterações que você fez permanecem com a organização, que é dona dessas informações. Convites pendentes expiram em 7 dias.' },
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
            { kind: 'p', text: 'Scans are performed on Artemis’s own infrastructure by third-party open-source tools, each used unmodified and under its own license (see Third-party notices). Repositories are only cloned over SSH with a read-only deploy key generated by Artemis, which you add to repositories you control; container images are pulled only from public registries, and dynamic analysis is not available yet.' },
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
                'Use Artemis — including dynamic analysis (DAST) — against systems you are not authorized to test.',
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
          ],
        },
        {
          id: 'license',
          title: 'Software license',
          blocks: [
            { kind: 'p', text: 'The Artemis source code is available under the PolyForm Noncommercial License 1.0.0. You may use, study and modify it for noncommercial purposes; commercial use — such as reselling it or offering it as a paid service — is reserved to the copyright holder.' },
          ],
        },
        {
          id: 'payments',
          title: 'Plans and payments',
          blocks: [
            { kind: 'p', text: 'Artemis offers two plans: Free (R$ 0, up to 90 scans per month) and PRO (R$ 24,99 per month, in Brazilian reais, up to 300 scans per month), which adds AI-assisted triage. Each pipeline run counts as one scan; once the monthly limit is reached, new runs are refused until the next calendar month. Billing is not enabled yet, so every organization currently uses the Free plan.' },
            { kind: 'p', text: 'When payments become available, prices and conditions will always be shown before any charge, nothing will be charged without your explicit agreement, and you will be able to cancel or switch back to Free at any time.' },
          ],
        },
        {
          id: 'liability',
          title: 'Availability and liability',
          blocks: [
            { kind: 'p', text: 'We work to keep Artemis available and secure, but the service is provided “as is”, without warranties of uninterrupted operation. To the extent permitted by law, we are not liable for indirect damages, loss of profits or data resulting from the use of the service.' },
          ],
        },
        {
          id: 'termination',
          title: 'Suspension and termination',
          blocks: [
            { kind: 'p', text: 'You may stop using Artemis, leave or delete your organizations and delete your account at any time. We may suspend access that violates these terms, explaining the reason whenever possible.' },
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
            { kind: 'p', text: 'As análises são feitas na infraestrutura do próprio Artemis por ferramentas de código aberto de terceiros, cada uma usada sem modificações e sob a sua própria licença (veja Avisos de terceiros). Os repositórios são clonados apenas via SSH com uma deploy key somente leitura gerada pelo Artemis, que você adiciona a repositórios que controla; imagens de contêiner são baixadas apenas de registries públicos, e a análise dinâmica ainda não está disponível.' },
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
                'Usar o Artemis — inclusive a análise dinâmica (DAST) — contra sistemas que não está autorizado a testar.',
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
          ],
        },
        {
          id: 'license',
          title: 'Licença do software',
          blocks: [
            { kind: 'p', text: 'O código-fonte do Artemis está disponível sob a PolyForm Noncommercial License 1.0.0. Você pode usá-lo, estudá-lo e modificá-lo para fins não comerciais; o uso comercial — como revendê-lo ou oferecê-lo como serviço pago — é reservado ao titular dos direitos autorais.' },
          ],
        },
        {
          id: 'payments',
          title: 'Planos e pagamentos',
          blocks: [
            { kind: 'p', text: 'O Artemis oferece dois planos: Free (R$ 0, até 90 análises por mês) e PRO (R$ 24,99 por mês, até 300 análises por mês), que adiciona triagem com IA. Cada execução de pipeline conta como uma análise; ao atingir o limite mensal, novas execuções são recusadas até o mês seguinte. A cobrança ainda não está habilitada, então todas as organizações usam atualmente o plano Free.' },
            { kind: 'p', text: 'Quando os pagamentos estiverem disponíveis, preços e condições serão sempre exibidos antes de qualquer cobrança, nada será cobrado sem a sua concordância expressa e você poderá cancelar ou voltar ao Free a qualquer momento.' },
          ],
        },
        {
          id: 'liability',
          title: 'Disponibilidade e responsabilidade',
          blocks: [
            { kind: 'p', text: 'Trabalhamos para manter o Artemis disponível e seguro, mas o serviço é fornecido “no estado em que se encontra”, sem garantia de funcionamento ininterrupto. Na medida permitida pela lei, não nos responsabilizamos por danos indiretos, lucros cessantes ou perda de dados decorrentes do uso do serviço.' },
          ],
        },
        {
          id: 'termination',
          title: 'Suspensão e encerramento',
          blocks: [
            { kind: 'p', text: 'Você pode deixar de usar o Artemis, sair das suas organizações ou excluí-las e excluir sua conta a qualquer momento. Podemos suspender acessos que violem estes termos, explicando o motivo sempre que possível.' },
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
