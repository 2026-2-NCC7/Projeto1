export interface DeepDiveItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  bullets?: Array<{ label: string; text: string }>;
  disclaimer?: string;
}

export interface PlatformScreenSpec {
  id: string;
  number: string;
  title: string;
  purpose: string;
  statusBadge: string;
  statusTone: 'mvp-demo' | 'mvp-sim' | 'post-mvp';
  actor: string;
  headerRight: string;
  metrics: Array<{ label: string; value: string; accent?: boolean }>;
  rows: Array<{ left: string; right: string; highlight?: boolean }>;
  deepDive: {
    whatVisitorSees: string;
    howItWorksInProject: string;
    privacyAndRules: string;
  };
}

export interface CommercialPlanTab {
  id: string;
  code: string;
  tabLabel: string;
  title: string;
  badge?: string;
  highlightTag?: string;
  price: string;
  period: string;
  subPrice?: string;
  ctaText?: string;
  isFeatured?: boolean;
  targetAudience: string;
  summary: string;
  features: string[];
  note: string;
}

export interface MarketScenario {
  id: 'tam' | 'sam' | 'som05' | 'som10' | 'som20';
  shortLabel: string;
  title: string;
  annualValue: string;
  companiesCount: string;
  gaugePercent: number;
  description: string;
}

export interface ValuePropPillar {
  title: string;
  desc: string;
}

export interface AudienceValueProp {
  audience: 'empresas' | 'profissionais';
  badge: string;
  title: string;
  subtitle: string;
  dores: ValuePropPillar[];
  ganhos: ValuePropPillar[];
  analgesicos: ValuePropPillar[];
  flagshipFeature: {
    name: string;
    highlight: string;
    detail: string;
  };
}

export interface PersonaChannel {
  phase: string;
  channel: string;
  goal: string;
}

export interface PersonaVolume {
  id: string;
  volumeNumber: string;
  name: string;
  role: string;
  age: string;
  coverSubtitle: string;
  companyProfile?: string;
  leftPageTitle: string;
  leftPageChallenge: string;
  leftPagePoints: string[];
  rightPageTitle: string;
  rightPageHowQiHelps: string;
  rightPagePoints: string[];
  channels: PersonaChannel[];
}

export interface TrustHexItem {
  id: string;
  shortTitle: string;
  subtitle: string;
  detail: string;
  depth: number;
}

export interface GovernanceFolderTab {
  id: string;
  tabLabel: string;
  question: string;
  answer: string;
  highlights: string[];
}

export interface TechArchitectureNode {
  id: string;
  side: 'left' | 'right';
  title: string;
  role: string;
  codeTitle: string;
  codeLines: string[];
  terminalLog: string[];
}

export interface CostSpecialty {
  id: string;
  area: string;
  hours: number;
  rateBrl: number;
  totalBrl: number;
  deliverables: string;
}

export const PITCH_GUIDE_STEPS = [
  {
    step: '01',
    sectionId: 'sec-abertura',
    question: '1. O que é?',
    goal: 'Apresentar a Q.I. Match e sua proposta de valor em poucos segundos.',
  },
  {
    step: '02',
    sectionId: 'sec-problema',
    question: '2. Qual problema resolve?',
    goal: 'Mostrar as dificuldades de contratar e encontrar oportunidades adequadas.',
  },
  {
    step: '03',
    sectionId: 'sec-solucao',
    question: '3. Como resolve?',
    goal: 'Explicar os três elementos de compatibilidade e os critérios propostos.',
  },
  {
    step: '04',
    sectionId: 'sec-mercado',
    question: '4. Quem utiliza e quem paga?',
    goal: 'Apresentar empresas pagantes, gratuidade para profissionais e cenários de mercado.',
  },
  {
    step: '05',
    sectionId: 'sec-demonstracao',
    question: '5. Como será a experiência?',
    goal: 'Demonstrar o livro interativo e as nove telas previstas com leitura clara.',
  },
  {
    step: '06',
    sectionId: 'sec-tecnologia',
    question: '6. Como será desenvolvida?',
    goal: 'Mostrar transparência, proteção de dados e arquitetura sob demanda.',
  },
  {
    step: '07',
    sectionId: 'sec-viabilidade',
    question: '7. É viável?',
    goal: 'Explicar os custos estimados de desenvolvimento e os próximos passos.',
  },
] as const;

export const OPENING_SPEECH = [
  'Imagine uma empresa que precisa contratar um profissional de tecnologia. Ela recebe diversos currículos, mas nem sempre consegue identificar quem realmente atende às necessidades da vaga.',
  'Agora imagine um profissional qualificado que recebe várias propostas, mas poucas correspondem à sua experiência e às suas expectativas.',
  'Foi a partir desse desafio que desenvolvemos a proposta da Q.I. Match.',
  'Nossa ideia é utilizar a tecnologia para aproximar empresas e profissionais, considerando não apenas os conhecimentos técnicos, mas também as habilidades comportamentais e o interesse de ambas as partes.',
  'Em outras palavras, queremos tornar o recrutamento mais direcionado, transparente e eficiente, sem substituir a importância da decisão humana.',
];

export const PROJECT_CREDITS = {
  company: 'Q.I. Match Tecnologia & Recrutamento',
  tagline: 'O talento certo. A oportunidade certa. Uma conexão mais inteligente.',
  institution: 'Q.I. Match · Startup de Tecnologia',
  course: 'Plataforma B2B de Recrutamento & Hunting Inteligente',
  advisor: 'Conselho Consultivo',
  authors: [
    'Jenifer Jacino Barreto',
    'Flavio dos Santos',
    'Felipe Carvalho Paleari',
    'Maria Eduarda de Freitas Lopes',
  ],
  founders: [
    { name: 'Jenifer Jacino Barreto', role: 'Co-founder & Product Lead' },
    { name: 'Flavio dos Santos', role: 'Co-founder & Tech Lead' },
    { name: 'Felipe Carvalho Paleari', role: 'Co-founder & Operations Lead' },
    { name: 'Maria Eduarda de Freitas Lopes', role: 'Co-founder & Strategy Lead' },
  ],
};

export const VALUE_PROPOSITIONS: AudienceValueProp[] = [
  {
    audience: 'empresas',
    badge: 'Para Empresas Contratantes',
    title: 'Recrutamento técnico assertivo com custo previsível',
    subtitle: 'Reduza em até 70% o tempo de fechamento de posições de engenharia e produto.',
    dores: [
      {
        title: 'Triagem manual exaustiva',
        desc: 'Centenas de currículos com palavras-chave que não comprovam raciocínio prático ou alinhamento real.',
      },
      {
        title: 'Custo abusivo de hunting',
        desc: 'Consultorias tradicionais cobram de 1 a 2 salários integrais sem garantia de aderência ou permanência.',
      },
      {
        title: 'Desistências tardias por salário',
        desc: 'Processos longos que falham no final porque a pretensão salarial e o modelo nunca foram alinhados antes.',
      },
    ],
    ganhos: [
      {
        title: 'Shortlist qualificada em < 24h',
        desc: 'Perfis aderentes pré-qualificados prontos para entrevistas finais com a liderança técnica.',
      },
      {
        title: 'Critérios explicáveis 50/30/20',
        desc: 'Transparência de competências técnicas (50%), comportamentais (30%) e enquadramento financeiro (20%).',
      },
      {
        title: 'Economia e previsibilidade',
        desc: 'Planos a partir de R$ 450/mês por slot de vaga ativa sem fidelidade forçada ou cobrança abusiva.',
      },
    ],
    analgesicos: [
      {
        title: 'Match Express (1º Candidato Grátis)',
        desc: 'Para qualquer nova vaga aberta, o 1º profissional compatível é desbloqueado gratuitamente para a empresa validar a qualidade.',
      },
      {
        title: 'Double Opt-In Garantido',
        desc: 'A empresa só gasta crédito quando o candidato aceita formalmente conversar após conhecer o salário e o desafio.',
      },
      {
        title: 'Síntese auditável com evidências',
        desc: 'Citações textuais literais das respostas do candidato para situações reais de trabalho, eliminando caixas-pretas.',
      },
    ],
    flagshipFeature: {
      name: 'Match Express + Double Opt-In',
      highlight: '1º Perfil Gratuito',
      detail: 'Experimente a plataforma sem custo na sua primeira contratação e pague apenas por conexões autorizadas pelas duas partes.',
    },
  },
  {
    audience: 'profissionais',
    badge: 'Para Profissionais de Tecnologia',
    title: 'Privacidade blindada e oportunidades que respeitam seu momento',
    subtitle: 'Navegue pelo mercado sem expor seu currículo ou sofrer com abordagens invasivas.',
    dores: [
      {
        title: 'Spam de abordagens frias',
        desc: 'Mensagens genéricas de recrutadores sem faixa salarial, detalhes da vaga ou modelo de trabalho.',
      },
      {
        title: 'Risco de exposição pública',
        desc: 'Receio legítimo de cadastrar currículo em plataformas abertas e ser visto pelo gestor da empresa atual.',
      },
      {
        title: 'Testes repetitivos e sem retorno',
        desc: 'Horas investidas em formulários infinitos e testes de código que terminam em e-mails automáticos de rejeição.',
      },
    ],
    ganhos: [
      {
        title: '100% gratuito para sempre',
        desc: 'O profissional de tecnologia nunca paga nenhuma mensalidade, taxa de adesão ou percentual de contratação.',
      },
      {
        title: 'Transparência desde o 1º contato',
        desc: 'Faixa salarial aberta, benefícios, regime (CLT/PJ) e modalidade (remoto/híbrido) visíveis antes de conversar.',
      },
      {
        title: 'Reconhecimento de competências reais',
        desc: 'Avaliação justa por evidências práticas de trabalho e comunicação, sem preconceito algorítmico.',
      },
    ],
    analgesicos: [
      {
        title: 'Modo Discreto com bloqueio de CNPJ',
        desc: 'Oculte automaticamente seu perfil da empresa onde você trabalha atualmente e de empresas parceiras ou concorrentes.',
      },
      {
        title: 'Entrevista estruturada assíncrona única',
        desc: 'Responda no seu ritmo por áudio ou texto (com peso exatamente igual), revise sua síntese e aprove antes de participar de vagas.',
      },
      {
        title: 'Auto-Apply com revogação em 1 clique',
        desc: 'Habilite respostas rápidas em vagas prioritárias e pause ou cancele sua participação a qualquer momento.',
      },
    ],
    flagshipFeature: {
      name: 'Modo Discreto + Transparência Salarial',
      highlight: '100% Gratuito',
      detail: 'Você só aceita conversar com empresas que divulgam a faixa salarial real e seu contato só é liberado com o seu consentimento explícito.',
    },
  },
];

export const PROBLEM_CARDS = [
  {
    id: 'prob-escassez',
    layout: 'wide' as const,
    metric: '84%',
    label: 'Dificuldade de contratação em TI',
    title: 'Volume de currículos não significa aderência real',
    summary:
      'No Brasil, 81% dos empregadores relatam dificuldade para preencher vagas, chegando a 84% em tecnologia — enquanto 39% apontam TI e Dados como as funções mais críticas (ManpowerGroup, 2025).',
    drawerId: 'drawer-problema-mercado',
  },
  {
    id: 'prob-hiato',
    layout: 'wide' as const,
    metric: '30,2%',
    label: 'Déficit acumulado entre demanda e formação',
    title: 'Mais tempo gasto em triagens manuais e repetitivas',
    summary:
      'Entre 2018 e 2024, o setor de tecnologia acumulou defasagem de 30,2% entre a procura por especialistas e a formação disponível no país (Brasscom, 2025).',
    drawerId: 'drawer-problema-mercado',
  },
  {
    id: 'prob-abordagem',
    layout: 'narrow' as const,
    metric: '~14%',
    label: 'Retorno médio em abordagens frias',
    title: 'Propostas desalinhadas desgastam profissionais',
    summary:
      'Convites enviados sem faixa salarial clara ou fora do momento de carreira geram baixo retorno (Gem, 2021) e frustram quem está empregado ou avaliando mudanças com cautela.',
    drawerId: 'drawer-problema-hunting',
  },
  {
    id: 'prob-humano',
    layout: 'broad' as const,
    metric: 'Além do currículo',
    label: 'Competências comportamentais e contexto',
    title: 'Avaliar como a pessoa trabalha e se comunica exige método',
    summary:
      'Pensamento analítico, flexibilidade e comunicação lideram as demandas até 2030 (WEF, 2025), mas raramente aparecem de forma organizada antes das entrevistas.',
    drawerId: 'drawer-problema-hunting',
  },
];

export const SOLUTION_PILLARS = [
  {
    id: 'conhecimento',
    step: '01',
    title: 'Conhecimento',
    shortText: 'O que o profissional sabe fazer.',
    detail:
      'Cadastro objetivo das tecnologias, projetos, nível de experiência e domínio prático exigidos no dia a dia da vaga.',
  },
  {
    id: 'comportamento',
    step: '02',
    title: 'Comportamento',
    shortText: 'Como se comunica e resolve problemas.',
    detail:
      'Perguntas estruturadas respondidas por áudio ou texto, organizadas em síntese clara com trechos reais revisados pelo próprio candidato.',
  },
  {
    id: 'interesse',
    step: '03',
    title: 'Interesse',
    shortText: 'Se a oportunidade faz sentido para ambos.',
    detail:
      'Faixa salarial e modelo de trabalho visíveis desde o início, liberando contato apenas quando empresa e profissional confirmam interesse.',
  },
];

export const SCORING_LENS_NODES = [
  {
    id: 'hub',
    x: 0.2,
    y: 0.5,
    weight: '≥ 75%',
    title: 'Índice proposto',
    caption: 'Critério inicial sugerido para destacar perfis aderentes',
    detail:
      'Os pesos abaixo são critérios propostos no estudo de viabilidade e poderão ser ajustados pela empresa em cada vaga (somando 100%).',
  },
  {
    id: 'tech',
    x: 0.74,
    y: 0.2,
    weight: '50%',
    title: 'Competências técnicas',
    caption: 'Conhecimentos obrigatórios, desejáveis e tempo de prática',
    detail:
      'Compara requisitos essenciais e complementares da vaga com o repertório declarado e contextualizado pelo profissional.',
  },
  {
    id: 'soft',
    x: 0.8,
    y: 0.44,
    weight: '30%',
    title: 'Habilidades comportamentais',
    caption: 'Comunicação, colaboração, autonomia e resolução de problemas',
    detail:
      'Apoia-se exclusivamente no conteúdo textual das respostas estruturadas, apresentando evidências verificáveis para o recrutador.',
  },
  {
    id: 'fit',
    x: 0.76,
    y: 0.68,
    weight: '20%',
    title: 'Senioridade e remuneração',
    caption: 'Alinhamento de experiência, modalidade e expectativa salarial',
    detail:
      'Evita convites incompatíveis com o orçamento da empresa ou abaixo do patamar esperado pelo candidato.',
  },
  {
    id: 'ethics',
    x: 0.62,
    y: 0.86,
    weight: '0%',
    title: 'Voz, imagem ou dados sensíveis',
    caption: ' Excluídos por princípio ético e proteção de dados',
    detail:
      'Timbre vocal, sotaque, vídeo e características pessoais nunca entram no cálculo de compatibilidade.',
  },
];

export const COMMERCIAL_PLANS: CommercialPlanTab[] = [
  {
    id: 'slot1',
    code: '01',
    tabLabel: '1 Slot',
    title: 'Plano 1 Slot',
    badge: 'PILOTO',
    price: 'R$ 450',
    period: '/mês',
    subPrice: 'Consumo de R$ 450 por slot ativo',
    ctaText: 'Ativar 1 Slot',
    targetAudience: 'Startups, projetos pilotos e equipes com demanda pontual de contratação.',
    summary:
      'Contrate slots de vagas ativas com suporte a múltiplos perfis técnicos sem mensalidade abusiva. Pague pelo slot em aberto, substitua ou pause conforme sua demanda de engenharia.',
    features: [
      '1 vaga simultânea aberta',
      'Triagem autorizada via IA',
      'Acesso a critérios de corte e código',
      'Cancelamento configurável no SLA',
    ],
    note: 'Modelo antecipado transparente com zero taxa oculta.',
  },
  {
    id: 'slot3',
    code: '02',
    tabLabel: '3 Slots',
    title: 'Plano 3 Slots',
    badge: 'MAIS ESCOLHIDO • ECONOMIA DE R$ 150',
    highlightTag: 'R$ 400 / SLOT',
    price: 'R$ 1.200',
    period: '/mês',
    subPrice: 'Economia de R$ 150 comparado ao avulso',
    ctaText: 'Contratar 3 Slots',
    isFeatured: true,
    targetAudience: 'Empresas em expansão contínua com múltiplos times de tecnologia.',
    summary:
      'Pacote preferido por times de software: 3 vagas simultâneas ativas com custo reduzido de R$ 400 por slot e reposição ágil em até 48h.',
    features: [
      '3 vagas simultâneas ativas',
      'Reposições de cancelamento em até 48h',
      'Exportação de relatórios e logs auditáveis',
      'Disponibilidade imediata de candidatos verificados',
      'Canal direto com suporte no SLA de 4 horas',
    ],
    note: 'Mais escolhido pelas empresas de engenharia de software.',
  },
  {
    id: 'slot5',
    code: '03',
    tabLabel: '5 Slots',
    title: 'Plano 5 Slots',
    badge: 'ESCALA',
    price: 'R$ 2.200',
    period: '/mês',
    subPrice: 'Economia de R$ 250 comparado ao avulso',
    ctaText: 'Ativar 5 Slots Scaled',
    targetAudience: 'Corporações, scale-ups e operações de alta demanda técnica.',
    summary:
      'Capacidade contínua de atração com suporte executivo VIP, Tech Lead dedicado e integração técnica homologada com ATS.',
    features: [
      '5 vagas simultâneas com rotação',
      'Suporte prioritário VIP com Tech Lead dedicado',
      'Validação de integração ATS (Greenhouse, Lever)',
      'Passe multi-track de novos fechamentos e CTOs',
    ],
    note: 'Escala corporativa com atendimento prioritário e validação de ecossistema ATS.',
  },
  {
    id: 'profissional',
    code: '04',
    tabLabel: 'Profissional',
    title: 'Acesso do Profissional',
    badge: '100% GRATUITO',
    price: 'Gratuito',
    period: 'para quem busca oportunidades',
    subPrice: 'Gratuidade permanente para candidatos',
    ctaText: 'Criar Perfil de Candidato',
    targetAudience: 'Desenvolvedores, engenheiros de dados, especialistas em nuvem, produto, qualidade e segurança.',
    summary:
      'O candidato mantém controle sobre sua visibilidade, revisa sua síntese antes de participar de vagas e só compartilha contato quando aprova a proposta.',
    features: [
      'Modos de privacidade: Ativo, Discreto (oculta da empresa atual) ou Pausado',
      'Visualização prévia de faixa salarial, regime e modalidade',
      'Opção voluntária de resposta rápida para vagas urgentes',
    ],
    note: 'A gratuidade permanente atrai talentos altamente qualificados em modo ativo e discreto.',
  },
];

export const MARKET_SCENARIOS: MarketScenario[] = [
  {
    id: 'tam',
    shortLabel: 'Mercado Nacional (TAM)',
    title: 'Brasil · Empresas de software sob encomenda',
    annualValue: 'R$ 112,08 mi/ano',
    companiesCount: '20.755 estabelecimentos',
    gaugePercent: 94,
    description:
      'Estimativa de potencial anual considerando empresas ativas no CNAE 6203-1/00 no Brasil (Sebrae / Receita Federal, 2026) multiplicadas pela assinatura anual do plano de 1 slot de referência (R$ 450/mês = R$ 5.400/ano).',
  },
  {
    id: 'sam',
    shortLabel: 'Recorte Regional (SAM)',
    title: 'Cidade de São Paulo · Foco inicial de operação',
    annualValue: 'R$ 11,85 mi/ano',
    companiesCount: '2.194 estabelecimentos',
    gaugePercent: 68,
    description:
      'Recorte geográfico inicial na capital paulista, polo com alta concentração de empresas contratantes de tecnologia multiplicadas pela referência anual de R$ 5.400.',
  },
  {
    id: 'som05',
    shortLabel: 'Cenário 0,5% (Conservador)',
    title: 'Meta inicial conservadora em São Paulo',
    annualValue: 'R$ 59.400/ano',
    companiesCount: '11 empresas assinantes',
    gaugePercent: 24,
    description:
      'Simulação de captação de 0,5% do recorte paulistano no plano inicial de referência (11 empresas × R$ 5.400/ano).',
  },
  {
    id: 'som10',
    shortLabel: 'Cenário 1,0% (Base)',
    title: 'Cenário-base de validação comercial',
    annualValue: 'R$ 118.800/ano',
    companiesCount: '22 empresas assinantes',
    gaugePercent: 42,
    description:
      'Projeção intermediária equivalente a 22 empresas ativas no plano de entrada ao longo do primeiro ciclo anual (22 × R$ 5.400/ano).',
  },
  {
    id: 'som20',
    shortLabel: 'Cenário 2,0% (Expansão)',
    title: 'Cenário de tração inicial em São Paulo',
    annualValue: 'R$ 237.600/ano',
    companiesCount: '44 empresas assinantes',
    gaugePercent: 56,
    description:
      'Estimativa de expansão para 2,0% das empresas do recorte local (44 empresas × R$ 5.400/ano), ainda sem contar adesões aos planos de 3 e 5 slots.',
  },
];

export const PERSONA_VOLUMES: PersonaVolume[] = [
  {
    id: 'empresas-expansao',
    volumeNumber: 'VOLUME 01',
    name: 'Startups & Scale-ups de Tecnologia',
    role: 'Empresas ICP · CNAE 6203-1/00',
    age: 'São Paulo/SP · Setor de Software & Dados',
    coverSubtitle: 'Demanda contínua por desenvolvedores e especialistas sem o custo abusivo do hunting tradicional.',
    companyProfile: 'Pequenas e médias empresas de tecnologia com 10 a 100 colaboradores buscando acelerar squads.',
    leftPageTitle: 'Dores e gargalos de contratação das empresas',
    leftPageChallenge:
      'Startups em tração e software houses paulistanas perdem até 45 dias filtrando centenas de candidaturas desconectadas, enquanto consultorias cobram até dois salários integrais por vaga.',
    leftPagePoints: [
      'Custo de hunting tradicional gira entre 1 a 2 salários inteiros da vaga, tornando a escala inviável.',
      'Triagem manual consome horas preciosas de engenharia sênior e fundadores avaliando currículos com palavras-chave vazias.',
      'Desistências frequentes no final do processo por desalinhamento salarial ou falta de interesse real do candidato.',
    ],
    rightPageTitle: 'Como a Q.I. Match transforma o recrutamento corporativo',
    rightPageHowQiHelps:
      'Entrega uma shortlist qualificada em menos de 24h, com critérios explicáveis (50% técnico, 30% comportamental, 20% financeiro) e 1º contato gratuito para teste.',
    rightPagePoints: [
      'Match Express com 1º candidato compatível desbloqueado gratuitamente para experimentar o serviço.',
      'Double Opt-In garantido: a empresa só consome créditos quando o profissional aceita formalmente conversar sobre a oportunidade.',
      'Planos transparentes e pré-pagos: 1 Slot (R$ 450/mês), 3 Slots (R$ 1.200/mês) ou 5 Slots (R$ 2.200/mês).',
    ],
    channels: [
      {
        phase: '1. Conhecimento',
        channel: 'Hubs de inovação (Cubo, Inovabra, Distrito) e campanhas segmentadas em São Paulo.',
        goal: 'Atrair founders, CTOs e gestores de tecnologia que enfrentam escassez de desenvolvedores.',
      },
      {
        phase: '2. Avaliação',
        channel: 'Landing page com simulador de viabilidade, protótipo interativo e degustação Match Express.',
        goal: 'Provar a aderência dos critérios e da plataforma antes de qualquer compromisso financeiro.',
      },
      {
        phase: '3. Compra',
        channel: 'Assinatura digital direta por slots (1, 3 ou 5 slots) sob demanda com modelo antecipado e transparente.',
        goal: 'Permitir adesão ágil sem burocracia contratual ou exigência de fidelidade mínima.',
      },
      {
        phase: '4. Entrega',
        channel: 'Painel corporativo com shortlist explicável, citação de evidências e liberação pós-aceite mútuo.',
        goal: 'Conectar a empresa com profissionais compatíveis e prontos para entrevistas finais em até 72h.',
      },
      {
        phase: '5. Pós-Venda',
        channel: 'Acompanhamento do fechamento da vaga, suporte ágil e métricas de conversão para retenção.',
        goal: 'Garantir alto índice de aprovação e recorrência natural de novas vagas na plataforma.',
      },
    ],
  },
  {
    id: 'lideranca-rh',
    volumeNumber: 'VOLUME 02',
    name: 'Liderança Técnica & Tech Recruiters',
    role: 'Mariana Souza (Recruiter) & Roberto Almeida (CTO)',
    age: '29 e 45 anos · Gestão de Pessoas & Engenharia',
    coverSubtitle: 'Unindo a agilidade do recrutamento à exigência de profundidade técnica e conformidade legal.',
    companyProfile: 'Equipes que precisam de alinhamento estreito entre atração de talentos e requisitos técnicos da squad.',
    leftPageTitle: 'Gargalos entre recrutamento e liderança técnica',
    leftPageChallenge:
      'O RH sofre com triagens manuais exaustivas e falta de insumos técnicos; a liderança de engenharia perde horas em entrevistas com candidatos desalinhados.',
    leftPagePoints: [
      'Mariana gasta dias conduzindo triagens iniciais sem clareza sobre o real domínio prático do desenvolvedor.',
      'Roberto vê entregas críticas atrasarem por vagas abertas há meses e desconfia de algoritmos opacos de triagem.',
      'Ambos exigem total conformidade com a LGPD e relatórios transparentes para a diretoria corporativa.',
    ],
    rightPageTitle: 'O que a Q.I. Match oferece para a gestão',
    rightPageHowQiHelps:
      'Uma plataforma colaborativa onde o RH publica vagas com salários abertos e o gestor técnico customiza os pesos de cada competência com evidências rastreáveis.',
    rightPagePoints: [
      'Pesos configuráveis por oportunidade: equilibre requisitos técnicos e comportamentais de acordo com a squad.',
      'Evidências reais: transcrição textual com citações diretas das respostas dos candidatos, sem análise invasiva de voz ou vídeo.',
      'Painel colaborativo: recrutador e CTO avaliam os mesmos dados objetivos antes de agendar a entrevista final.',
    ],
    channels: [
      {
        phase: '1. Conhecimento',
        channel: 'Comunidades especializadas (Tech Recruiters BR, meetups de CTOs, GitHub sponsors, LinkedIn Tech).',
        goal: 'Construir autoridade técnica e relevância direta com os tomadores de decisão.',
      },
      {
        phase: '2. Avaliação',
        channel: 'Sandbox com casos reais de vagas, validação de rubricas explicáveis e conformidade com a LGPD.',
        goal: 'Demonstrar transparência algorítmica e facilidade de integração no fluxo de recrutamento existente.',
      },
      {
        phase: '3. Compra',
        channel: 'Faturamento corporativo com múltiplos usuários avaliadores e gestão unificada de vagas.',
        goal: 'Atender aos processos de compras, governança e compliance de médias e grandes empresas.',
      },
      {
        phase: '4. Entrega',
        channel: 'Notificações sincronizadas, relatórios de compatibilidade exportáveis e convites de 72h.',
        goal: 'Acelerar o funil de entrevistas técnicas com pessoas realmente interessadas e qualificadas.',
      },
      {
        phase: '5. Pós-Venda',
        channel: 'Pesquisas de NPS por vaga fechada, relatórios de tempo até preenchimento e consultoria técnica.',
        goal: 'Consolidar a Q.I. Match como a ferramenta de seleção padrão da equipe técnica.',
      },
    ],
  },
  {
    id: 'lucas-tech',
    volumeNumber: 'VOLUME 03',
    name: 'Lucas Ferreira',
    role: 'Desenvolvedor Full-Stack Pleno',
    age: '26 anos · São Paulo/SP · CLT',
    coverSubtitle: 'Busca novas oportunidades com segurança, sem expor que está avaliando o mercado e com salário claro.',
    companyProfile: 'Profissionais de tecnologia em atividade que buscam crescimento salarial e desafios de alto impacto.',
    leftPageTitle: 'Frustrações da rotina de quem busca oportunidades',
    leftPageChallenge:
      'Lucas está empregado em regime CLT, mas recebe convites genéricos sem remuneração e teme cadastrar currículo em plataformas onde seu gestor atual possa vê-lo.',
    leftPagePoints: [
      'Recebe mensagens frias de recrutadores que nem leram sua experiência e não informam faixa salarial.',
      'Gasta tempo preenchendo cadastros longos e testes repetitivos para não receber feedback.',
      'Receio de expor sua busca publicamente e sofrer retaliações no emprego atual.',
    ],
    rightPageTitle: 'A experiência do profissional na Q.I. Match',
    rightPageHowQiHelps:
      'Acesso 100% gratuito com Modo Discreto automático, salário e modelo de trabalho visíveis desde o convite e controle total dos dados pessoais.',
    rightPagePoints: [
      'Modo Discreto com bloqueio de CNPJ: seu perfil anonimizado nunca aparece para o seu empregador atual.',
      'Transparência salarial mandatória: avalie remuneração, benefícios e regime antes de autorizar qualquer contato.',
      'Entrevista estruturada assíncrona única por texto ou áudio, revisada e aprovada por você antes de qualquer envio.',
    ],
    channels: [
      {
        phase: '1. Conhecimento',
        channel: 'Comunidades de desenvolvedores (Discord, Reddit r/brdev, fóruns técnicos, podcasts tech, GitHub).',
        goal: 'Apresentar a proposta de recrutamento reverso que respeita a privacidade do profissional.',
      },
      {
        phase: '2. Avaliação',
        channel: 'Página explicativa destacando a gratuidade vitalícia, o Modo Discreto e o direito de revisão LGPD.',
        goal: 'Gerar confiança imediata de que os dados pessoais não serão expostos ou mercantilizados.',
      },
      {
        phase: '3. Adesão',
        channel: 'Cadastro rápido em poucos passos via GitHub ou Google com seleção instantânea de senioridade e pretensão.',
        goal: 'Facilidade máxima para criar o perfil sem burocracia ou formulários infinitos.',
      },
      {
        phase: '4. Entrega',
        channel: 'Convites diretos de empresas compatíveis com janela de 72h e salário aberto para avaliação tranquila.',
        goal: 'Proporcionar uma experiência sem pressão em que o candidato decide se quer conversar.',
      },
      {
        phase: '5. Pós-Venda',
        channel: 'Canal direto para feedback, opção de pausar o perfil em 1 clique e controle permanente de consentimento.',
        goal: 'Manter o profissional acolhido ao longo de toda a sua trajetória e evolução de carreira.',
      },
    ],
  },
];

export const BOOK_SEQUENCE_STEPS = [
  {
    step: '01',
    label: 'A proposta em um volume',
    progress: 0.04,
    description: 'Da visão de negócio às interfaces planejadas para empresas e profissionais.',
  },
  {
    step: '02',
    label: 'Abertura da jornada',
    progress: 0.34,
    description: 'O livro se abre revelando os módulos centrais da experiência de recrutamento.',
  },
  {
    step: '03',
    label: 'Critérios em destaque',
    progress: 0.66,
    description: 'Perfil técnico, entrevista estruturada, vagas transparentes e autorização mútua.',
  },
  {
    step: '04',
    label: 'As nove telas previstas',
    progress: 0.98,
    description: 'Visualize cada tela em tamanho ampliado ou clique para abrir em tela cheia.',
  },
] as const;

export const PLATFORM_SCREENS: PlatformScreenSpec[] = [
  {
    id: 'tela-01',
    number: 'TELA 01',
    title: 'Cadastro de perfil profissional',
    purpose:
      'Onde o candidato registra sua experiência, competências técnicas, pretensão salarial e preferências de privacidade.',
    statusBadge: 'Protótipo em demonstração',
    statusTone: 'mvp-demo',
    actor: 'Visão do Profissional',
    headerRight: 'Privacidade: Modo Discreto',
    metrics: [
      { label: 'Área principal', value: 'Front-end · Pleno', accent: true },
      { label: 'Pretensão mensal', value: 'R$ 9.500' },
      { label: 'Empresa bloqueada', value: '1 CNPJ oculto' },
    ],
    rows: [
      { left: 'React, TypeScript e Testes Automatizados', right: 'Domínio avançado', highlight: true },
      { left: 'Preferência de regime e jornada', right: 'CLT ou PJ · Híbrido/Remoto' },
      { left: 'Autorização automática em vagas urgentes', right: 'Opcional · Desativada' },
    ],
    deepDive: {
      whatVisitorSees:
        'Formulário estruturado em que o profissional informa habilidades padronizadas, nível de senioridade, faixa salarial desejada e quem pode visualizar seu perfil.',
      howItWorksInProject:
        'Evita currículos em formatos dispersos e prepara os dados objetivos para comparação justa com os requisitos das vagas.',
      privacyAndRules:
        'Nome, e-mail, telefone e links externos permanecem ocultos até que o candidato aceite expressamente conversar com uma empresa.',
    },
  },
  {
    id: 'tela-02',
    number: 'TELA 02',
    title: 'Entrevista estruturada por áudio ou texto',
    purpose:
      'Espaço para responder perguntas práticas de trabalho, com opção acessível em texto.',
    statusBadge: 'Protótipo em demonstração',
    statusTone: 'mvp-demo',
    actor: 'Visão do Profissional',
    headerRight: 'Áudio ou Texto equivalente',
    metrics: [
      { label: 'Roteiro base', value: '4 perguntas práticas', accent: true },
      { label: 'Tempo médio', value: 'Até 2 min/resposta' },
      { label: 'Acessibilidade', value: 'Texto liberado' },
    ],
    rows: [
      { left: '1. Como você lida com prazos técnicos conflitantes?', right: 'Respondida', highlight: true },
      { left: '2. Conte um problema complexo resolvido em equipe.', right: 'Em gravação / edição' },
      { left: '3. Como comunica riscos técnicos para outras áreas?', right: 'Pendente' },
    ],
    deepDive: {
      whatVisitorSees:
        'Ambiente calmo e assíncrono em que o profissional responde situações reais de trabalho falando pelo microfone ou digitando em texto.',
      howItWorksInProject:
        'Segue o princípio de entrevistas estruturadas (mesma base de perguntas para a categoria), reduzindo improvisos e subjetividade inicial.',
      privacyAndRules:
        'A resposta escrita tem exatamente o mesmo peso da resposta em áudio, garantindo inclusão e conforto para todos os perfis.',
    },
  },
  {
    id: 'tela-03',
    number: 'TELA 03',
    title: 'Organização das respostas',
    purpose:
      'Transcrição do conteúdo respondido para apoiar a análise por critérios objetivos, sem avaliar voz ou imagem.',
    statusBadge: 'Protótipo em demonstração',
    statusTone: 'mvp-demo',
    actor: 'Processamento Auditável',
    headerRight: 'Sem análise acústica ou facial',
    metrics: [
      { label: 'Entrada analisada', value: 'Somente texto', accent: true },
      { label: 'Voz / vídeo', value: '0% utilizado' },
      { label: 'Retenção do áudio', value: 'Máx. 30 dias' },
    ],
    rows: [
      { left: 'Conversão da fala em texto revisável', right: 'Concluída', highlight: true },
      { left: 'Separação por situação, ação e resultado', right: 'Estruturada' },
      { left: 'Agendamento automático de descarte do áudio bruto', right: 'Ativo (LGPD)' },
    ],
    deepDive: {
      whatVisitorSees:
        'A transformação do áudio em texto limpo e organizado por tópicos, deixando visível o material exato que servirá de base para a síntese.',
      howItWorksInProject:
        'No projeto completo, o áudio é transcrito de forma assíncrona; na demonstração atual, o fluxo exibe exemplos realistas desse processamento.',
      privacyAndRules:
        'Nenhum dado biométrico, entonação ou sotaque é mensurado; a política do projeto prevê exclusão do áudio bruto em até 30 dias.',
    },
  },
  {
    id: 'tela-04',
    number: 'TELA 04',
    title: 'Síntese de competências com evidências',
    purpose:
      'Visão clara dos pontos identificados a partir dos trechos reais informados pelo profissional.',
    statusBadge: 'Protótipo em demonstração',
    statusTone: 'mvp-demo',
    actor: 'Transparência de Critérios',
    headerRight: 'Evidências rastreáveis',
    metrics: [
      { label: 'Comunicação objetiva', value: 'Evidência citada', accent: true },
      { label: 'Colaboração em time', value: 'Evidência citada' },
      { label: 'Resolução de problemas', value: 'Evidência citada' },
    ],
    rows: [
      { left: 'Trecho: "Alinhei prioridades com produto antes do deploy..."', right: 'Comunicação', highlight: true },
      { left: 'Trecho: "Dividimos a revisão de código em pares..."', right: 'Colaboração' },
      { left: 'Nota de apoio à decisão humana (sem reprovação automática)', right: 'Auditável' },
    ],
    deepDive: {
      whatVisitorSees:
        'Painel que associa cada competência comportamental observada ao trecho exato dito ou escrito pelo candidato.',
      howItWorksInProject:
        'Impede "caixas-pretas": tanto o candidato quanto o recrutador compreendem de onde surgiu cada apontamento.',
      privacyAndRules:
        'Alinhado ao direito de explicação e transparência previsto no Art. 20 da Lei Geral de Proteção de Dados.',
    },
  },
  {
    id: 'tela-05',
    number: 'TELA 05',
    title: 'Revisão e complementação pelo candidato',
    purpose:
      'Etapa em que o profissional confere sua síntese, adiciona contexto ou solicita revisão antes de participar das vagas.',
    statusBadge: 'Protótipo em demonstração',
    statusTone: 'mvp-demo',
    actor: 'Controle do Titular',
    headerRight: 'Aprovação prévia do candidato',
    metrics: [
      { label: 'Status da síntese', value: 'Aprovada pelo titular', accent: true },
      { label: 'Observação do autor', value: '1 complemento' },
      { label: 'Regravação livre', value: 'Disponível' },
    ],
    rows: [
      { left: 'Conferir leitura das respostas antes de exibir às empresas', right: 'Confirmado', highlight: true },
      { left: 'Adicionar nota contextual ou reenviar resposta', right: 'Habilitado' },
      { left: 'Pausar participação em novas buscas a qualquer momento', right: '1 clique' },
    ],
    deepDive: {
      whatVisitorSees:
        'Tela dedicada para o profissional validar se o resumo reflete fielmente sua trajetória antes que qualquer perfil anonimizado entre nas listas.',
      howItWorksInProject:
        'Garante protagonismo ao candidato e reduz ruídos de interpretação logo na origem.',
      privacyAndRules:
        'Caso discorde de algum ponto, o profissional pode refazer a resposta, complementar por escrito ou solicitar revisão.',
    },
  },
  {
    id: 'tela-06',
    number: 'TELA 06',
    title: 'Publicação de vaga com transparência',
    purpose:
      'Configuração da oportunidade pela empresa com faixa salarial visível, pesos dos critérios e opção de busca prioritária (Match Express).',
    statusBadge: 'Protótipo em demonstração',
    statusTone: 'mvp-demo',
    actor: 'Visão da Empresa',
    headerRight: 'Faixa salarial obrigatória',
    metrics: [
      { label: 'Remuneração aberta', value: 'R$ 8.500 – R$ 11.000', accent: true },
      { label: 'Pesos da vaga', value: '50% / 30% / 20%' },
      { label: 'Busca prioritária', value: 'Match Express ativo' },
    ],
    rows: [
      { left: 'Requisitos essenciais: React, TypeScript e Git', right: 'Obrigatórios', highlight: true },
      { left: 'Competências humanas priorizadas na equipe', right: 'Comunicação e Colaboração' },
      { left: 'Condições claras: Híbrido (SP) · CLT ou PJ', right: 'Visível no convite' },
    ],
    deepDive: {
      whatVisitorSees:
        'Cadastro objetivo da vaga exigindo divulgação de faixa salarial, modalidade e distribuição transparente dos pesos de avaliação.',
      howItWorksInProject:
        'Ao ativar o Match Express para posições urgentes, a plataforma prioriza convites aos perfis mais compatíveis da base.',
      privacyAndRules:
        'Impede anúncios com "salário a combinar", respeitando o tempo dos profissionais abordados.',
    },
  },
  {
    id: 'tela-07',
    number: 'TELA 07',
    title: 'Profissionais com maior compatibilidade',
    purpose:
      'Apresentação comparativa dos perfis mais aderentes, explicando de forma aberta o porquê de cada indicação.',
    statusBadge: 'Protótipo em demonstração',
    statusTone: 'mvp-demo',
    actor: 'Visão da Empresa',
    headerRight: 'Identidade preservada nesta etapa',
    metrics: [
      { label: 'Candidato #A104', value: '91% compatível', accent: true },
      { label: 'Candidata #B209', value: '87% compatível' },
      { label: 'Corte sugerido', value: 'Acima de 75%' },
    ],
    rows: [
      { left: 'Perfil #A104 · Pleno · Pretensão dentro da faixa da vaga', right: '91% (Téc 94 · Comp 88)', highlight: true },
      { left: 'Justificativa aberta por critério + trechos validados', right: 'Inspecionar' },
      { left: 'Nome, contato atual e empregador permanecem ocultos', right: 'Protegido' },
    ],
    deepDive: {
      whatVisitorSees:
        'Lista comparativa enxuta em que a empresa entende exatamente quais requisitos cada candidato atende e onde existem lacunas.',
      howItWorksInProject:
        'Substitui pilhas de currículos por uma análise lado a lado fundamentada nos três pilares: conhecimento, comportamento e interesse.',
      privacyAndRules:
        'A empresa avalia competências primeiro, reduzindo vieses inconscientes ligados a nome, idade ou endereço.',
    },
  },
  {
    id: 'tela-08',
    number: 'TELA 08',
    title: 'Conexão autorizada pelas duas partes',
    purpose:
      'Convite com condições claras da vaga, mantendo dados pessoais protegidos até a confirmação mútua de interesse.',
    statusBadge: 'Fluxo simulado · Previsto no MVP',
    statusTone: 'mvp-sim',
    actor: 'Empresa ↔ Profissional',
    headerRight: 'Prazo de resposta: 72h',
    metrics: [
      { label: '1. Empresa convida', value: 'Proposta aberta', accent: true },
      { label: '2. Candidato avalia', value: 'Aceita em até 72h' },
      { label: '3. Dados liberados', value: 'Contato direto' },
    ],
    rows: [
      { left: 'Empresa envia convite com salário, regime e escopo visíveis', right: 'Registrado', highlight: true },
      { left: 'Profissional aprova o contato após revisar a oportunidade', right: 'Autorizado' },
      { left: 'Se recusar ou expirar em 72h: nenhum dado é exposto ou cobrado', right: 'Garantido' },
    ],
    deepDive: {
      whatVisitorSees:
        'O momento em que o convite chega ao candidato com todas as informações da vaga e, somente após o aceite, libera nome completo, currículo e contato para a empresa.',
      howItWorksInProject:
        'Materializa o interesse mútuo: a empresa só consome seu crédito comercial quando existe disposição real para a entrevista.',
      privacyAndRules:
        'Toda autorização gera registro auditável de data, hora e finalidade específica para aquela vaga.',
    },
  },
  {
    id: 'tela-09',
    number: 'TELA 09',
    title: 'Comunidade e indicações entre profissionais',
    purpose:
      'Ambiente previsto para troca de conhecimento e indicações voluntárias com recompensas de uso na plataforma.',
    statusBadge: 'Previsto para evolução pós-MVP',
    statusTone: 'post-mvp',
    actor: 'Evolução Planejada (Fase 2)',
    headerRight: 'Não altera a nota de compatibilidade',
    metrics: [
      { label: 'Troca técnica', value: 'Por áreas afins', accent: true },
      { label: 'Indicação validada', value: 'Pontos de uso' },
      { label: 'Efeito no ranking', value: 'Zero interferência' },
    ],
    rows: [
      { left: 'Discussões técnicas e apoio entre profissionais da mesma área', right: 'Planejado', highlight: true },
      { left: 'Link de indicação para convidar colegas a vagas abertas', right: 'Planejado' },
      { left: 'Pontuação simbólica ("Estalecas") separada da avaliação técnica', right: 'Regra ética' },
    ],
    deepDive: {
      whatVisitorSees:
        'Espaço comunitário demonstrado conceitualmente no protótipo para networking técnico e recomendações rastreáveis entre colegas.',
      howItWorksInProject:
        'No cronograma de viabilidade de 1.000 horas, esta frente está separada como evolução pós-MVP para manter o foco inicial no núcleo de recrutamento.',
      privacyAndRules:
        'Regra inegociável do projeto: pontos de comunidade jamais compram posição nem aumentam o percentual de compatibilidade em vagas.',
    },
  },
];

export const TRUST_HEX_ITEMS: TrustHexItem[] = [
  {
    id: 'hex-decisao',
    shortTitle: 'Decisão humana',
    subtitle: 'Apoio, nunca substituição',
    detail: 'A plataforma organiza informações e destaca aderências, mas entrevistas finais e contratações são sempre conduzidas por pessoas.',
    depth: 1,
  },
  {
    id: 'hex-autorizacao',
    shortTitle: 'Interesse mútuo',
    subtitle: 'Contato mediante aceite',
    detail: 'Dados pessoais permanecem protegidos até que empresa e profissional confirmem interesse na mesma oportunidade.',
    depth: 1.2,
  },
  {
    id: 'hex-explicavel',
    shortTitle: 'Critérios abertos',
    subtitle: 'Sem caixa-preta',
    detail: 'Cada indicador vem acompanhado dos pesos configurados na vaga e dos trechos textuais que fundamentam a síntese.',
    depth: 0.9,
  },
  {
    id: 'hex-sem-voz',
    shortTitle: 'Zero biometria',
    subtitle: 'Sem julgar voz ou rosto',
    detail: 'Não há medição de tom de voz, sotaque ou expressões faciais; áudio e texto recebem tratamento equivalente.',
    depth: 1.3,
  },
  {
    id: 'hex-salario',
    shortTitle: 'Salário visível',
    subtitle: 'Clareza desde o convite',
    detail: 'Toda oportunidade informa faixa de remuneração, modalidade e regime antes que o candidato precise se identificar.',
    depth: 1.1,
  },
  {
    id: 'hex-discreto',
    shortTitle: 'Modo Discreto',
    subtitle: 'Bloqueio do empregador atual',
    detail: 'Profissionais empregados podem ocultar seu perfil de empresas específicas por domínio ou CNPJ.',
    depth: 0.85,
  },
  {
    id: 'hex-descarte',
    shortTitle: 'Retenção mínima',
    subtitle: 'Áudio descartado em 30 dias',
    detail: 'Política de minimização de dados com exclusão programada dos arquivos de áudio bruto após transcrição e revisão.',
    depth: 1.25,
  },
  {
    id: 'hex-revisao',
    shortTitle: 'Direito de revisão',
    subtitle: 'Alinhado à LGPD (Art. 20)',
    detail: 'O titular confere sua síntese previamente, pode editar/complementar respostas e revogar consentimentos quando desejar.',
    depth: 1,
  },
];

export const GOVERNANCE_FOLDERS: GovernanceFolderTab[] = [
  {
    id: 'folder-lgpd',
    tabLabel: '01 · Proteção de Dados',
    question: 'Como os dados pessoais são protegidos antes e depois do convite?',
    answer:
      'Seguimos o princípio do mínimo privilégio: durante a busca inicial, a empresa enxerga apenas competências, nível de experiência e aderência salarial, sem nome, e-mail, telefone ou empresa atual.',
    highlights: [
      'Abertura de identidade vinculada exclusivamente à vaga aceita pelo candidato.',
      'Exclusão automática prevista para áudios brutos em até 30 dias após a transcrição.',
      'Possibilidade de exportar ou excluir integralmente a conta a pedido do titular.',
    ],
  },
  {
    id: 'folder-etica',
    tabLabel: '02 · Uso Responsável',
    question: 'Como evitar que a tecnologia reproduza vieses ou tome decisões opacas?',
    answer:
      'O modelo proposto separa claramente organização de dados e julgamento humano. Nenhuma característica pessoal sensível entra no cálculo e toda síntese cita trechos verificáveis.',
    highlights: [
      'Alternativa em texto com peso idêntico ao áudio para plena acessibilidade.',
      'Revisão obrigatória pelo próprio profissional antes da disponibilização do perfil.',
      'Ausência de reprovação automatizada irrecorrível (conformidade com o Art. 20 da LGPD).',
    ],
  },
  {
    id: 'folder-escopo',
    tabLabel: '03 · Escopo do Projeto',
    question: 'O que faz parte da demonstração atual e o que está planejado para o MVP?',
    answer:
      'Separamos com transparência o protótipo navegável apresentado na feira, o escopo técnico orçado para o MVP de 5 meses e as evoluções futuras.',
    highlights: [
      'Em demonstração hoje: navegação interativa entre perfis de candidato, empresa e governança com dados simulados.',
      'Escopo orçado do MVP (1.000h): autenticação real, banco de dados com controle de acesso, fila de transcrição, motor de compatibilidade e fluxo de autorização mútua.',
      'Evolução pós-MVP: comunidade técnica completa, recompensas de indicação com parceiros externos e integrações corporativas avançadas.',
    ],
  },
  {
    id: 'folder-indicadores',
    tabLabel: '04 · Metas de Validação',
    question: 'Quais indicadores serão acompanhados para testar se a proposta funciona na prática?',
    answer:
      'O estudo define métricas operacionais e comerciais para validar a plataforma em um projeto-piloto antes de escalar investimentos.',
    highlights: [
      'Taxa de aceite em convites com interesse mútuo (meta de estudo ≥ 55%) e tempo até a lista inicial (< 24h).',
      'Satisfação dos profissionais com a precisão da sua síntese revisável (meta ≥ 80%).',
      'Conversão de listas compatíveis em entrevistas reais (meta ≥ 40%) e zero incidentes de exposição indevida de contato.',
    ],
  },
  {
    id: 'folder-riscos',
    tabLabel: '05 · Riscos e Mitigações',
    question: 'Quais são os principais riscos mapeados no estudo e como foram tratados?',
    answer:
      'Mapeamos 10 riscos técnicos, jurídicos e mercadológicos, associando travas preventivas de produto e orçamento a cada um deles.',
    highlights: [
      'Falta inicial de liquidez entre vagas e candidatos → foco inicial restrito a perfis de software em São Paulo e acesso gratuito para profissionais.',
      'Oscilação de custo de processamento externo → processamento assíncrono sob demanda com limite de duração por resposta e cache de resultados.',
      'Desconfiança quanto ao uso de automação → transparência de pesos, citação literal de trechos e controle prévio pelo candidato.',
    ],
  },
];

export const TECH_ARCHITECTURE_NODES: TechArchitectureNode[] = [
  {
    id: 'node-web',
    side: 'left',
    title: 'Aplicação Web Responsiva',
    role: 'React + TypeScript + Vite (Cloudflare Pages)',
    codeTitle: 'visibilidade-perfil.ts',
    codeLines: [
      '// Campos públicos na etapa de busca comparativa',
      'export function toAnonymousCard(candidate: Candidate) {',
      '  return {',
      '    code: candidate.publicHash,',
      '    seniority: candidate.seniority,',
      '    skills: candidate.verifiedSkills,',
      '    contact: null // liberado apenas após aceite mútuo',
      '  };',
      '}',
    ],
    terminalLog: [
      '$ verificação de interface: perfis listados sem PII',
      '✓ 0 dados sensíveis expostos antes do consentimento',
      '✓ Tempo de carregamento estimado em borda < 1,2s',
    ],
  },
  {
    id: 'node-api',
    side: 'left',
    title: 'Serviço de Regras e Auditoria',
    role: 'API modular em Node.js / NestJS',
    codeTitle: 'autorizacao-mutua.service.ts',
    codeLines: [
      '// Regra RN02 + RN03: janela de 72h e registro LGPD',
      'async function confirmMutualInterest(inviteId: string) {',
      '  const invite = await repo.findValidWithin72h(inviteId);',
      '  await audit.recordConsent(invite.candidateId, invite.vacancyId);',
      '  return unlockContactForVacancyOnly(invite);',
      '}',
    ],
    terminalLog: [
      '$ testando regra de autorização mútua (janela 72h)',
      '✓ Convite expirado não debita crédito da empresa',
      '✓ Trilha de auditoria gravada com finalidade específica',
    ],
  },
  {
    id: 'node-matching',
    side: 'left',
    title: 'Cálculo Explicável de Aderência',
    role: 'Pesos configuráveis (padrão proposto 50/30/20)',
    codeTitle: 'calculo-compatibilidade.ts',
    codeLines: [
      '// Pesos propostos por vaga (soma = 100%)',
      'export function computeCompatibility(input: MatchInput) {',
      '  return (',
      '    input.technicalScore * 0.50 +',
      '    input.behavioralRubric * 0.30 +',
      '    input.seniorityAndSalaryFit * 0.20',
      '  );',
      '}',
    ],
    terminalLog: [
      '$ simulando vaga Front-end Pleno (corte sugerido >= 75%)',
      '✓ Perfil #A104: 91% (Técnico 94 | Comportamental 88 | Faixa 90)',
      '✓ Justificativa detalhada anexada para leitura humana',
    ],
  },
  {
    id: 'node-queue',
    side: 'right',
    title: 'Fila Assíncrona de Entrevistas',
    role: 'Processamento em segundo plano (pg-boss)',
    codeTitle: 'fila-transcricao.worker.ts',
    codeLines: [
      '// Processa resposta sem travar a navegação do candidato',
      'queue.work("interview-transcription", async (job) => {',
      '  const text = await speechToText(job.data.audioUrl);',
      '  await scheduleRawAudioDeletion(job.data.audioId, 30);',
      '  return generateEvidenceDraft(text);',
      '});',
    ],
    terminalLog: [
      '$ enfileirando resposta estruturada (máx. 120s)',
      '✓ Transcrição textual concluída em segundo plano',
      '✓ Exclusão do áudio bruto agendada para D+30',
    ],
  },
  {
    id: 'node-ai',
    side: 'right',
    title: 'Transcrição e Síntese por Rubrica',
    role: 'API de linguagem aplicada exclusivamente ao texto',
    codeTitle: 'rubrica-evidencias.ts',
    codeLines: [
      '// Extrai trechos literais sem inferir traços pessoais',
      'const rubricPrompt = {',
      '  input: transcriptTextOnly,',
      '  forbidBiometricsAndDemographics: true,',
      '  requireLiteralQuotes: true,',
      '  requireCandidateApprovalBeforePublish: true',
      '};',
    ],
    terminalLog: [
      '$ validando síntese com citações literais',
      '✓ 3 evidências vinculadas às respostas do candidato',
      '✓ Status: aguardando revisão e aprovação do titular',
    ],
  },
  {
    id: 'node-db',
    side: 'right',
    title: 'Banco de Dados e Isolamento',
    role: 'PostgreSQL + Armazenamento Criptografado (Supabase)',
    codeTitle: 'politica-acesso-rls.sql',
    codeLines: [
      '-- Contato visível somente se houver aceite ativo na vaga',
      'CREATE POLICY "select_contact_after_mutual_opt_in"',
      'ON candidate_contacts FOR SELECT USING (',
      '  EXISTS (SELECT 1 FROM mutual_consents mc',
      '          WHERE mc.candidate_id = candidate_contacts.id',
      '            AND mc.company_id = auth.uid() AND mc.accepted = true)',
      ');',
    ],
    terminalLog: [
      '$ verificando isolamento por linha (RLS PostgreSQL)',
      '✓ Consulta direta sem consentimento bloqueada no banco',
      '✓ Custo estimado de infraestrutura inicial: ~US$ 30/mês',
    ],
  },
];

export const COST_SPECIALTIES: CostSpecialty[] = [
  {
    id: 'spec-backend',
    area: 'Desenvolvimento de Regras e Integrações (Backend)',
    hours: 280,
    rateBrl: 110,
    totalBrl: 30800,
    deliverables: 'Autenticação, motor de compatibilidade, janela de 72h, créditos e trilha de auditoria.',
  },
  {
    id: 'spec-frontend',
    area: 'Interfaces Web para Empresas e Profissionais (Frontend)',
    hours: 200,
    rateBrl: 95,
    totalBrl: 19000,
    deliverables: 'Fluxos responsivos de perfil, revisão de síntese, publicação de vagas e lista comparativa.',
  },
  {
    id: 'spec-ia',
    area: 'Transcrição e Síntese Baseada em Critérios (Dados / IA)',
    hours: 160,
    rateBrl: 125,
    totalBrl: 20000,
    deliverables: 'Roteiros estruturados, extração de trechos literais e salvaguardas contra uso de dados sensíveis.',
  },
  {
    id: 'spec-qa',
    area: 'Testes de Qualidade, Acessibilidade e Privacidade (QA / LGPD)',
    hours: 140,
    rateBrl: 90,
    totalBrl: 12600,
    deliverables: 'Testes automatizados de sigilo antes do aceite, fluxos em texto/áudio e validação de descarte.',
  },
  {
    id: 'spec-ux',
    area: 'Experiência do Usuário e Prototipação (UX / UI)',
    hours: 120,
    rateBrl: 85,
    totalBrl: 10200,
    deliverables: 'Arquitetura de informação clara, testes de leitura e consistência visual das telas.',
  },
  {
    id: 'spec-devops',
    area: 'Infraestrutura em Nuvem, Segurança e Monitoramento',
    hours: 100,
    rateBrl: 110,
    totalBrl: 11000,
    deliverables: 'Ambientes isolados, backups, controle de acesso no banco e observabilidade de filas.',
  },
];

export const MVP_MODULES_BREAKDOWN = [
  { code: 'F01', name: 'Cadastro, autenticação e perfis de acesso', hours: 110 },
  { code: 'F02', name: 'Perfil técnico padronizado e modos de visibilidade', hours: 120 },
  { code: 'F03', name: 'Entrevista estruturada assíncrona (áudio e texto)', hours: 140 },
  { code: 'F04', name: 'Transcrição, síntese por rubrica e revisão pelo titular', hours: 170 },
  { code: 'F05', name: 'Publicação de vagas com salários abertos e pesos', hours: 110 },
  { code: 'F06', name: 'Cálculo comparativo de compatibilidade (50/30/20)', hours: 130 },
  { code: 'F07', name: 'Fluxo de autorização mútua (72h) e controle de créditos', hours: 120 },
  { code: 'F08', name: 'Painel de governança, registros LGPD e testes integrados', hours: 100 },
];

export const DEEP_DIVE_DRAWERS: Record<string, DeepDiveItem> = {
  'drawer-problema-mercado': {
    id: 'drawer-problema-mercado',
    badge: 'Fontes & Metodologia de Mercado',
    title: 'Escassez de especialistas e esforço de triagem no Brasil',
    subtitle: 'Dados públicos e pesquisas setoriais de referência.',
    paragraphs: [
      'Segundo o levantamento global de escassez de talentos do ManpowerGroup (2025), 81% dos empregadores brasileiros relatam dificuldade para encontrar profissionais com as qualificações necessárias, índice que alcança 84% nas posições de Tecnologia da Informação. Na mesma pesquisa, 39% das empresas destacam TI e Dados como as áreas mais difíceis de preencher.',
      'De forma convergente, o relatório setorial da Brasscom (2025) aponta um hiato acumulado de 30,2% entre a demanda por profissionais de TIC e o volume de formados no Brasil no período de 2018 a 2024.',
    ],
    bullets: [
      {
        label: 'Impacto prático nas empresas',
        text: 'Muitas candidaturas recebidas por vaga, porém baixa visibilidade inicial sobre domínio prático e alinhamento salarial.',
      },
      {
        label: 'Abordagem da Q.I. Match',
        text: 'Reduzir o ruído inicial organizando critérios técnicos, comportamentais e financeiros antes da primeira conversa.',
      },
    ],
    disclaimer: 'Fontes consolidadas: Relatórios Setoriais ManpowerGroup (2025) e Brasscom (2025).',
  },
  'drawer-problema-hunting': {
    id: 'drawer-problema-hunting',
    badge: 'Experiência de Recrutamento & Seleção',
    title: 'Por que abordagens genéricas e currículos isolados falham',
    subtitle: 'Fricção no contato ativo e importância de entrevistas estruturadas.',
    paragraphs: [
      'Benchmarks internacionais de recrutamento técnico (Gem, 2021) indicam taxa média de resposta próxima de 14% no primeiro contato frio com profissionais de engenharia e tecnologia — frequentemente porque a mensagem chega sem faixa salarial, fora do perfil ou em momento inadequado.',
      'Ao mesmo tempo, o Future of Jobs Report (World Economic Forum, 2025) aponta pensamento analítico, resiliência, flexibilidade e comunicação entre as competências mais críticas até 2030. A literatura clássica de seleção de pessoas (Campion, Palmer & Campion, 1997) demonstra que roteiros estruturados com critérios consistentes elevam a qualidade preditiva da avaliação em comparação a triagens informais.',
    ],
    bullets: [
      {
        label: 'Para quem contrata',
        text: 'Insumos comportamentais organizados por evidências reais antes de agendar entrevistas longas.',
      },
      {
        label: 'Para quem busca vaga',
        text: 'Menos abordagens desalinhadas e transparência total das condições antes de expor sua identidade.',
      },
    ],
    disclaimer: 'Referências: Gem Recruiting Benchmarks (2021); World Economic Forum (2025); Campion et al. (1997).',
  },
  'drawer-solucao-pesos': {
    id: 'drawer-solucao-pesos',
    badge: 'Modelo de Compatibilidade Explicável',
    title: 'Como funcionam os critérios propostos (50% / 30% / 20%)',
    subtitle: 'Transparência matemática e limites éticos da nota de compatibilidade.',
    paragraphs: [
      'Na Q.I. Match, o índice de compatibilidade é apresentado como uma referência inicial configurável (com linha de destaque sugerida a partir de 75%), e nunca como um veredito automático.',
      'A distribuição padrão atribui 50% às competências técnicas obrigatórias e desejáveis, 30% às habilidades comportamentais observadas em respostas estruturadas e 20% à aderência de senioridade, modalidade e expectativa salarial.',
    ],
    bullets: [
      {
        label: 'Configurável por vaga',
        text: 'Uma posição de liderança técnica pode elevar o peso comportamental, enquanto uma vaga altamente especializada pode priorizar requisitos técnicos, mantendo a soma em 100%.',
      },
      {
        label: 'Exclusão explícita de dados sensíveis',
        text: 'Áudio serve apenas como meio opcional de entrada para transcrição textual. Timbre de voz, imagem e dados demográficos têm peso zero.',
      },
    ],
    disclaimer:
      'Parâmetros flexíveis e ajustáveis pela liderança técnica para cada posição aberta.',
  },
  'drawer-mercado-metodologia': {
    id: 'drawer-mercado-metodologia',
    badge: 'Dimensionamento & Potencial de Mercado',
    title: 'Memória de cálculo das estimativas de mercado (TAM, SAM e SOM)',
    subtitle: 'Base pública oficial e projeções de penetração de mercado.',
    paragraphs: [
      'Para dimensionar o mercado endereçável com dados verificáveis, a plataforma mapeou o painel de empresas ativas do Sebrae / Receita Federal (2026) no código CNAE 6203-1/00 (Desenvolvimento e licenciamento de programas de computador não-customizáveis).',
      'Multiplicando o universo nacional de 20.755 estabelecimentos pelo valor anual do Plano 1 Slot de referência (R$ 450/mês = R$ 5.400/ano), obtém-se o potencial de mercado nacional (TAM) de R$ 112,08 milhões/ano. No polo metropolitano de São Paulo (2.194 empresas), o potencial regional (SAM) corresponde a R$ 11,85 milhões/ano.',
    ],
    bullets: [
      {
        label: 'Cenários graduais de penetração (SOM)',
        text: '0,5% (11 empresas) = R$ 59.400/ano · 1,0% (22 empresas) = R$ 118.800/ano · 2,0% (44 empresas) = R$ 237.600/ano.',
      },
      {
        label: 'Alavancas de expansão comercial',
        text: 'Planos de 3 Slots (R$ 1.200/mês) e 5 Slots corporativos (R$ 2.200/mês) aceleram a receita além da base inicial.',
      },
    ],
    disclaimer: 'Base de dados cadastral: Receita Federal / Sebrae (CNAE 6203-1/00, 2026).',
  },
  'drawer-orcamento-detalhado': {
    id: 'drawer-orcamento-detalhado',
    badge: 'Planejamento de Desenvolvimento do MVP',
    title: 'Divisão por módulos de produto (F01–F08) e alocação de engenharia',
    subtitle: 'Investimento previsto de R$ 103.600,00 diretos e R$ 119.140,00 com reserva técnica.',
    paragraphs: [
      'O cronograma do produto mínimo viável foi dimensionado em 1.000 horas produtivas distribuídas ao longo de 5 meses entre seis especialidades de engenharia, produto e conformidade. Os valores-hora foram calibrados pelas faixas medianas de mercado de tecnologia.',
      'Sobre o investimento direto previsto de R$ 103.600,00, inclui-se uma reserva técnica preventiva de 15% (R$ 15.540,00) para absorver testes avançados de segurança, conformidade e homologação, totalizando R$ 119.140,00.',
    ],
    bullets: MVP_MODULES_BREAKDOWN.map((m) => ({
      label: `${m.code} · ${m.hours}h`,
      text: m.name,
    })),
    disclaimer:
      'Planejamento técnico com arquitetura serverless em nuvem estimada em custos operacionais iniciais de cerca de US$ 30/mês.',
  },
};
