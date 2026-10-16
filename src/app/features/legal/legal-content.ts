import { Lang } from '../../core/i18n';
import { HelpSection } from '../help/help-content';

export type LegalDocument = 'privacy' | 'terms';

export interface LegalText {
  title: string;
  summary: string;
  updated: string;
  sections: HelpSection[];
}

const CONTACT = 'privacy@artemisappsec.com';
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
                ['Name, username, e-mail and groups provided by your sign-in provider', 'To sign you in, show who you are and apply your role in the organization.'],
                ['Organization settings, team members and invitations', 'To run your organization’s workspace and control who can access it.'],
                ['Repository addresses, branches and public SSH deploy keys', 'To read your code and run the security pipeline you configured. We only accept public keys and never ask for private keys or passwords to your repositories.'],
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
            { kind: 'p', text: 'Artemis accesses your repositories with read-only deploy keys, only to run the scans you enabled. Source code is processed for those scans and is not used for any other purpose, sold or shared. Results (findings, logs and reports) belong to your organization.' },
          ],
        },
        {
          id: 'external-services',
          title: 'Public vulnerability data',
          blocks: [
            { kind: 'p', text: 'To enrich findings we look up public vulnerability records (CVE and CVSS data) from sources such as the NIST National Vulnerability Database. These lookups contain vulnerability identifiers only — never your code, your users or your organization’s information.' },
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
                'Access to an organization’s data is limited to its members.',
              ],
            },
          ],
        },
        {
          id: 'retention',
          title: 'Retention and deletion',
          blocks: [
            { kind: 'p', text: 'Your organization decides how long findings history and pipeline logs are kept (Organization settings → Data retention). When an organization is deleted, its data is deleted with it. You can ask us to delete your personal information at any time.' },
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
                ['Nome, usuário, e-mail e grupos fornecidos pelo seu provedor de login', 'Para fazer seu login, mostrar quem você é e aplicar seu papel na organização.'],
                ['Configurações da organização, membros da equipe e convites', 'Para manter o espaço de trabalho da sua organização e controlar quem tem acesso.'],
                ['Endereços de repositórios, branches e chaves SSH públicas de deploy', 'Para ler seu código e executar o pipeline de segurança que você configurou. Aceitamos apenas chaves públicas e nunca pedimos chaves privadas ou senhas dos seus repositórios.'],
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
            { kind: 'p', text: 'O Artemis acessa seus repositórios com deploy keys somente leitura, apenas para executar as análises que você ativou. O código-fonte é processado para essas análises e não é usado para nenhuma outra finalidade, vendido ou compartilhado. Os resultados (achados, logs e relatórios) pertencem à sua organização.' },
          ],
        },
        {
          id: 'external-services',
          title: 'Dados públicos de vulnerabilidades',
          blocks: [
            { kind: 'p', text: 'Para enriquecer os achados consultamos registros públicos de vulnerabilidades (dados de CVE e CVSS) em fontes como a National Vulnerability Database do NIST. Essas consultas contêm apenas identificadores de vulnerabilidades — nunca seu código, seus usuários ou informações da sua organização.' },
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
                'O acesso aos dados de uma organização é limitado aos seus membros.',
              ],
            },
          ],
        },
        {
          id: 'retention',
          title: 'Retenção e exclusão',
          blocks: [
            { kind: 'p', text: 'Sua organização decide por quanto tempo o histórico de achados e os logs de pipeline são mantidos (Configurações da organização → Retenção de dados). Quando uma organização é excluída, seus dados são excluídos junto. Você pode pedir a exclusão das suas informações pessoais a qualquer momento.' },
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
            { kind: 'p', text: 'By signing in to or using Artemis you agree to these Terms of Use and to the Privacy Policy. If you use Artemis on behalf of an organization, you confirm you are allowed to accept these terms for it.' },
          ],
        },
        {
          id: 'service',
          title: 'The service',
          blocks: [
            { kind: 'p', text: 'Artemis is an application security testing platform: it connects to your repositories, runs the security pipeline you configure (such as SAST, dependency scanning and container scanning) and reports findings scored with CVSS. Features may change as the product evolves.' },
          ],
        },
        {
          id: 'accounts',
          title: 'Accounts and access',
          blocks: [
            {
              kind: 'ul',
              items: [
                'You sign in through your organization’s identity provider; keep your credentials and API tokens confidential.',
                'Organization owners and admins decide who belongs to the organization and which role each member has.',
                'Tell us immediately at the contact below if you suspect unauthorized access.',
              ],
            },
          ],
        },
        {
          id: 'acceptable-use',
          title: 'Acceptable use',
          blocks: [
            { kind: 'p', text: 'You may only connect repositories and test environments that you own or are explicitly authorized to test. You must not:' },
            {
              kind: 'ul',
              items: [
                'Use Artemis — including dynamic analysis (DAST) — against systems you are not authorized to test.',
                'Try to access other organizations’ data, bypass security controls or disrupt the service.',
                'Upload private keys, passwords or other secrets you are not supposed to share.',
                'Use the service to develop or distribute malware or to break the law.',
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
            { kind: 'p', text: 'You may stop using Artemis and delete your organization at any time. We may suspend access that violates these terms, explaining the reason whenever possible.' },
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
            { kind: 'p', text: 'Ao entrar ou usar o Artemis você concorda com estes Termos de Uso e com a Política de Privacidade. Se usar o Artemis em nome de uma organização, você confirma que pode aceitar estes termos por ela.' },
          ],
        },
        {
          id: 'service',
          title: 'O serviço',
          blocks: [
            { kind: 'p', text: 'O Artemis é uma plataforma de testes de segurança de aplicações: conecta-se aos seus repositórios, executa o pipeline de segurança que você configura (como SAST, análise de dependências e varredura de contêineres) e reporta achados pontuados com CVSS. As funcionalidades podem mudar conforme o produto evolui.' },
          ],
        },
        {
          id: 'accounts',
          title: 'Contas e acesso',
          blocks: [
            {
              kind: 'ul',
              items: [
                'Você entra pelo provedor de identidade da sua organização; mantenha suas credenciais e tokens de API em sigilo.',
                'Proprietários e administradores da organização decidem quem faz parte dela e qual o papel de cada membro.',
                'Avise-nos imediatamente pelo contato abaixo se suspeitar de acesso não autorizado.',
              ],
            },
          ],
        },
        {
          id: 'acceptable-use',
          title: 'Uso aceitável',
          blocks: [
            { kind: 'p', text: 'Você só pode conectar repositórios e ambientes de teste que sejam seus ou que esteja expressamente autorizado a testar. Você não pode:' },
            {
              kind: 'ul',
              items: [
                'Usar o Artemis — inclusive a análise dinâmica (DAST) — contra sistemas que não está autorizado a testar.',
                'Tentar acessar dados de outras organizações, contornar controles de segurança ou prejudicar o serviço.',
                'Enviar chaves privadas, senhas ou outros segredos que não deveria compartilhar.',
                'Usar o serviço para desenvolver ou distribuir malware ou para infringir a lei.',
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
            { kind: 'p', text: 'Você pode deixar de usar o Artemis e excluir sua organização a qualquer momento. Podemos suspender acessos que violem estes termos, explicando o motivo sempre que possível.' },
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
