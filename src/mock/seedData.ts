import { 
  CandidateProfile, 
  Company, 
  Vacancy, 
  AIInterviewSession, 
  SelectionProcess,
  CommunityProfile,
  CommunityPost,
  PostComment,
  Connection,
  AppNotification,
  AuditLog,
  RewardItem,
  RewardTransaction,
  CompanyInvoice,
  CommercialConfig,
  ModerationReport
} from '../types';

export const SEED_COMPANIES: Company[] = [
  {
    id: 'comp-orion',
    name: 'Orion Tech Solutions',
    cnpj: '45.123.890/0001-99',
    about: 'Empresa especializada no desenvolvimento de produtos digitais escaláveis, arquitetura em nuvem e engenharia de dados aplicada.',
    city: 'São Paulo',
    state: 'SP',
    website: 'https://oriontech.com.br'
  }
];

export const SEED_VACANCIES: Vacancy[] = [
  {
    id: 'vac-frontend-pleno',
    title: 'Desenvolvedor(a) Front-end Pleno',
    companyId: 'comp-orion',
    area: 'Frontend',
    seniority: 'Pleno',
    mandatorySkills: ['React', 'TypeScript', 'Git'],
    desirableSkills: ['Node.js', 'Tailwind CSS', 'Docker'],
    softSkills: ['Comunicação', 'Colaboração', 'Resolução de problemas'],
    contractTypes: ['CLT', 'PJ'],
    modality: 'Híbrido',
    location: 'São Paulo/SP',
    salaryMin: 8500,
    salaryMax: 11000,
    description: 'Atuação na evolução da interface de soluções SaaS B2B de alta performance.',
    conditions: 'Vale Refeição/Alimentação, Plano de Saúde, Auxílio Home Office e Horário Flexível.',
    isUrgentMatchExpress: true,
    createdAt: '2026-09-15T09:00:00Z'
  },
  {
    id: 'vac-dados-senior',
    title: 'Engenheiro(a) de Dados Sênior — Projeto',
    companyId: 'comp-orion',
    area: 'Dados/IA',
    seniority: 'Sênior',
    mandatorySkills: ['Python', 'SQL', 'AWS'],
    desirableSkills: ['Spark', 'Airflow', 'Databricks', 'Docker'],
    softSkills: ['Adaptabilidade', 'Pensamento analítico', 'Liderança'],
    contractTypes: ['PJ', 'Projeto'],
    modality: 'Remoto',
    location: 'Brasil (Remoto)',
    salaryMin: 17000,
    salaryMax: 21000,
    description: 'Estruturação de pipelines analíticos em AWS, migração de dados e orquestração distribuída.',
    conditions: 'Contrato de 12 meses com possibilidade de prorrogação.',
    isUrgentMatchExpress: false,
    createdAt: '2026-09-18T14:30:00Z'
  }
];

export const SEED_CANDIDATE_LUCAS: CandidateProfile = {
  id: 'cand-lucas',
  userId: 'user-lucas',
  name: 'Lucas Almeida',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  headline: 'Desenvolvedor Front-end & Full-stack Pleno | React, TypeScript, Node.js',
  city: 'São Paulo',
  state: 'SP',
  about: 'Engenheiro de software com foco em ecossistema JavaScript/TypeScript, construção de SPAs responsivas, testes automatizados e integração com microsserviços.',
  seniority: 'Pleno',
  experiences: [
    {
      id: 'exp-1',
      role: 'Desenvolvedor Frontend Pleno',
      company: 'Nexus Code Studio',
      period: '2023 - Presente',
      description: 'Liderança de componentes em Design System, migração de aplicações para Next.js e consumo de APIs REST/GraphQL.'
    },
    {
      id: 'exp-2',
      role: 'Desenvolvedor Júnior',
      company: 'Alfa Digital Lab',
      period: '2021 - 2023',
      description: 'Desenvolvimento de telas responsivas, manutenções em React e Node.js e automação de testes unitários.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Design System Headless',
      description: 'Biblioteca de componentes acessíveis compatível com WCAG 2.2 utilizando Radix UI e Tailwind CSS.',
      link: 'https://github.com/lucasalmeida/headless-ds'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bacharelado em Ciência da Computação',
      institution: 'Universidade de São Paulo',
      year: 'Conclusão em 2024'
    }
  ],
  certifications: ['AWS Certified Cloud Practitioner', 'Meta Front-End Developer Professional'],
  languages: [{ language: 'Português', level: 'Nativo' }, { language: 'Inglês', level: 'Avançado' }],
  githubUrl: 'https://github.com/lucasalmeida',
  linkedinUrl: 'https://linkedin.com/in/lucasalmeida',
  portfolioUrl: 'https://lucasalmeida.dev',
  email: 'lucas@qitech.com.br',
  phone: '(11) 98765-4321',
  salaryMin: 8000,
  salaryMax: 10500,
  contractTypes: ['CLT', 'PJ'],
  modalities: ['Remoto', 'Híbrido'],
  locationPreference: 'São Paulo/SP e Grande SP',
  availability: '15 dias',
  visibility: 'Ativo',
  isCommunityMember: false,
  skills: [
    { id: 'sk-1', name: 'React', category: 'Frontend', mastery: 'Avançado', years: 3, months: 4 },
    { id: 'sk-2', name: 'TypeScript', category: 'Linguagens', mastery: 'Avançado', years: 3, months: 2 },
    { id: 'sk-3', name: 'JavaScript', category: 'Linguagens', mastery: 'Avançado', years: 4, months: 0 },
    { id: 'sk-4', name: 'Node.js', category: 'Backend/APIs', mastery: 'Intermediário', years: 2, months: 6 },
    { id: 'sk-5', name: 'PostgreSQL', category: 'Bancos e dados', mastery: 'Intermediário', years: 2, months: 0 },
    { id: 'sk-6', name: 'Git', category: 'DevOps/Infra', mastery: 'Avançado', years: 4, months: 0 },
    { id: 'sk-7', name: 'Docker', category: 'DevOps/Infra', mastery: 'Básico', years: 1, months: 2 },
    { id: 'sk-custom-seed', name: 'Rust WebAssembly', category: 'Especialidade Sugerida', mastery: 'Básico', years: 0, months: 8, isCustom: true, status: 'pendente_revisao' }
  ]
};

export const SEED_CANDIDATE_MARINA: CandidateProfile = {
  id: 'cand-marina',
  userId: 'user-marina',
  name: 'Marina Costa',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  headline: 'Engenheira de Dados Sênior | Python, PySpark, AWS, Airflow',
  city: 'Campinas',
  state: 'SP',
  about: 'Especialista em pipelines analíticos de missão crítica, Data Lakehouse em nuvem AWS, governança de dados e liderança técnica de equipes multidisciplinares.',
  seniority: 'Sênior',
  experiences: [
    {
      id: 'exp-m1',
      role: 'Staff Data Engineer',
      company: 'Horizon Data Cloud',
      period: '2020 - Presente',
      description: 'Arquitetura de ingestão distribuída processando terabytes diários com Apache Spark, AWS EMR e Databricks.'
    }
  ],
  projects: [
    {
      id: 'proj-m1',
      title: 'Lakehouse Modernization Framework',
      description: 'Pipeline open-source para migração contínua de bases relacionais para Delta Lake.',
      link: 'https://github.com/marinacosta/lakehouse-framework'
    }
  ],
  education: [
    {
      id: 'edu-m1',
      degree: 'Engenharia de Software',
      institution: 'UNICAMP',
      year: '2017'
    }
  ],
  certifications: ['AWS Certified Data Analytics - Specialty', 'Databricks Certified Data Engineer Professional'],
  languages: [{ language: 'Português', level: 'Nativo' }, { language: 'Inglês', level: 'Fluente' }],
  githubUrl: 'https://github.com/marinacosta',
  linkedinUrl: 'https://linkedin.com/in/marinacosta',
  portfolioUrl: 'https://marinacosta.dev',
  email: 'marina@qitech.com.br',
  phone: '(19) 99876-5432',
  salaryMin: 16000,
  salaryMax: 20000,
  contractTypes: ['PJ', 'Projeto'],
  modalities: ['Remoto'],
  locationPreference: 'Totalmente Remoto',
  availability: 'A combinar',
  visibility: 'Ativo',
  isCommunityMember: true,
  skills: [
    { id: 'sk-m1', name: 'Python', category: 'Linguagens', mastery: 'Especialista', years: 7, months: 0 },
    { id: 'sk-m2', name: 'SQL', category: 'Bancos e dados', mastery: 'Avançado', years: 8, months: 0 },
    { id: 'sk-m3', name: 'AWS', category: 'Cloud', mastery: 'Avançado', years: 5, months: 6 },
    { id: 'sk-m4', name: 'Spark', category: 'Dados/IA', mastery: 'Avançado', years: 4, months: 0 },
    { id: 'sk-m5', name: 'Airflow', category: 'Dados/IA', mastery: 'Avançado', years: 4, months: 3 },
    { id: 'sk-m6', name: 'Docker', category: 'DevOps/Infra', mastery: 'Avançado', years: 5, months: 0 },
    { id: 'sk-m7', name: 'Kubernetes', category: 'DevOps/Infra', mastery: 'Intermediário', years: 3, months: 0 },
    { id: 'sk-m8', name: 'Databricks', category: 'Dados/IA', mastery: 'Intermediário', years: 3, months: 2 }
  ]
};

export const SEED_INTERVIEW_LUCAS: AIInterviewSession = {
  id: 'int-lucas-1',
  candidateId: 'cand-lucas',
  status: 'concluida',
  completedAt: '2026-09-20T11:20:00Z',
  version: 1,
  answers: [
    {
      questionId: 1,
      question: 'Descreva uma situação em que você precisou alinhar uma decisão técnica complexa com pessoas de produto ou design que não tinham formação técnica.',
      competency: 'Comunicação',
      answer: 'Utilizei diagramas funcionais e protótipos de tela interativos em vez de jargões técnicos para explicar o impacto da renderização assíncrona na percepção de velocidade do usuário.'
    },
    {
      questionId: 2,
      question: 'Conte como você lidou com um desentendimento ou divergência de implementação em um pull request com outro desenvolvedor.',
      competency: 'Colaboração',
      answer: 'Propus uma rápida chamada síncrona de 10 minutos para analisar os pontos de discordância com testes comparativos de benchmark, chegando a um consenso sem atritos.'
    },
    {
      questionId: 3,
      question: 'Descreva um bug ou incidente crítico em produção que exigiu diagnóstico rápido e qual método você aplicou para isolar a causa.',
      competency: 'Resolução de problemas',
      answer: 'A aplicação começou a retornar erro 504. Isolei o serviço analisando logs de latência no CloudWatch, identifiquei um pool de conexões saturado no PostgreSQL e implementei limitação preventiva com cache Redis temporário.'
    },
    {
      questionId: 4,
      question: 'Como você organiza a documentação e os testes do que produz para que outros desenvolvedores da squad possam dar manutenção sem gargalos?',
      competency: 'Comunicação & Colaboração',
      answer: 'Mantenho Storybook atualizado para todos os componentes de UI, especificações em OpenAPI e testes unitários cobrindo fluxos críticos com mais de 80% de cobertura funcional.'
    },
    {
      questionId: 5,
      question: 'Quando os prazos de entrega estão sob pressão e requisitos mudam no meio da sprint, como você reavalia as prioridades com a equipe?',
      competency: 'Resolução de problemas',
      answer: 'Alinho imediatamente com a liderança técnica e product manager quais são as histórias essenciais do MVP da sprint, documentando débitos técnicos para resolução em refatorações agendadas.'
    }
  ],
  summary: [
    {
      competency: 'Comunicação',
      level: 'Avançado',
      evidence: 'Demonstrou facilidade em traduzir requisitos de engenharia para interfaces de produto através de recursos visuais e alinhamento síncrono.',
      confidence: 'Alta'
    },
    {
      competency: 'Colaboração',
      level: 'Avançado',
      evidence: 'Apresentou práticas de resolução proativa em code review baseadas em evidências empíricas e empatia técnica.',
      confidence: 'Alta'
    },
    {
      competency: 'Resolução de problemas',
      level: 'Avançado',
      evidence: 'Isolamento metódico de gargalos de I/O em produção utilizando telemetria estruturada e mitigação por camadas de contingência.',
      confidence: 'Alta'
    }
  ]
};

export const SEED_INTERVIEW_MARINA: AIInterviewSession = {
  id: 'int-marina-1',
  candidateId: 'cand-marina',
  status: 'concluida',
  completedAt: '2026-09-21T16:45:00Z',
  version: 1,
  answers: [
    {
      questionId: 1,
      question: 'Como você atuou quando uma tecnologia consolidada na empresa precisou ser substituída emergencialmente devido a custos ou limitações técnicas?',
      competency: 'Adaptabilidade',
      answer: 'Conduzi a migração de um pipeline em Redshift legado para Databricks Delta Lake em 6 semanas, garantindo compatibilidade regressiva de todas as visões analíticas de negócio.'
    },
    {
      questionId: 2,
      question: 'Descreva um cenário em que foi necessário auditar dados divergentes entre sistemas corporativos e definir a raiz analítica do problema.',
      competency: 'Pensamento analítico',
      answer: 'Analisei divergências de métricas de faturamento entre CRM e ERP; rastreei o log de eventos do Kafka e descobri um dessincronismo no tratamento de fusos horários UTC nas agregações.'
    },
    {
      questionId: 3,
      question: 'Conte como você exerceu liderança técnica informal orientando desenvolvedores júnior ou pleno em boas práticas de engenharia de dados.',
      competency: 'Liderança',
      answer: 'Criei o comitê semanal de arquitetura de dados, instituí padrões de CI/CD para repositórios PySpark e atuei como mentora direta de dois engenheiros pleno da equipe.'
    },
    {
      questionId: 4,
      question: 'Diante de cenários de escassez de infraestrutura de dados sob alta carga, quais métricas você prioriza para manter resiliência?',
      competency: 'Pensamento analítico',
      answer: 'Priorizo taxa de perda de pacotes, tempo de retenção nos workers Spark e escalabilidade horizontal orientada a consumo de fila, evitando nós ociosos.'
    },
    {
      questionId: 5,
      question: 'Como você equilibra a cobrança de entregas rápidas de análises pela diretoria com a qualidade dos testes e governança de dados?',
      competency: 'Adaptabilidade & Liderança',
      answer: 'Estabeleço acordos claros de SLA com camadas Bronze/Silver/Gold bem delineadas: dados crus rápidos com disclaimer para decisões pontuais, e dados homologados para relatórios executivos.'
    }
  ],
  summary: [
    {
      competency: 'Adaptabilidade',
      level: 'Especialista',
      evidence: 'Transição estratégica de stacks distribuídas com mitigação total de downtime e validação contínua de paridade de dados.',
      confidence: 'Alta'
    },
    {
      competency: 'Pensamento analítico',
      level: 'Especialista',
      evidence: 'Capacidade apurada de decomposição de eventos assíncronos e detecção de anomalias em agregados temporais complexos.',
      confidence: 'Alta'
    },
    {
      competency: 'Liderança',
      level: 'Avançado',
      evidence: 'Mentoria ativa, criação de fóruns técnicos estruturados e disseminação de padrões de engenharia entre pares.',
      confidence: 'Alta'
    }
  ]
};

export const SEED_SELECTION_PROCESSES: SelectionProcess[] = [
  {
    id: 'proc-lucas-frontend',
    vacancyId: 'vac-frontend-pleno',
    candidateId: 'cand-lucas',
    currentStage: 'match_identificado',
    doubleOptInStatus: 'aguardando',
    accessGranted: false,
    demonstrativeScore: 91,
    matchExplanation: 'Boa aderência técnica por sólida experiência em React, TypeScript e ecossistema moderno de frontend, senioridade compatível (Pleno), pretensão salarial e preferência por trabalho híbrido em São Paulo/SP alinhadas. A entrevista comportamental evidenciou comunicação técnica clara e postura colaborativa em resolução de incidentes.',
    internalNotes: 'Perfil com forte aderência técnica às demandas do Design System interno.',
    updatedAt: '2026-09-22T10:00:00Z',
    unlockedFreeGrant: true
  },
  {
    id: 'proc-marina-frontend',
    vacancyId: 'vac-frontend-pleno',
    candidateId: 'cand-marina',
    currentStage: 'candidato_aceitou',
    doubleOptInStatus: 'aceito',
    doubleOptInDate: '2026-09-23T11:30:00Z',
    accessGranted: false,
    demonstrativeScore: 84,
    matchExplanation: 'Forte domínio de arquitetura de software, Python, AWS e Docker desejáveis para integração de pipelines full-stack. Candidata confirmou Double Opt-In para atuar em regime PJ; como 2º perfil da fila Match Express, aguarda desbloqueio comercial pela empresa.',
    internalNotes: 'Segunda candidata com interesse confirmado no Match Express.',
    updatedAt: '2026-09-23T11:30:00Z',
    unlockedFreeGrant: false
  },
  {
    id: 'proc-marina-dados',
    vacancyId: 'vac-dados-senior',
    candidateId: 'cand-marina',
    currentStage: 'dados_liberados',
    doubleOptInStatus: 'aceito',
    doubleOptInDate: '2026-09-23T14:15:00Z',
    accessGranted: true,
    demonstrativeScore: 94,
    matchExplanation: 'Excelente alinhamento sênior com as stacks mandatárias de Python, SQL e nuvem AWS, além de flexibilidade contratual PJ/Projeto com disponibilidade remota total. A entrevista destacou histórico de liderança técnica, pensamento analítico apurado e adaptabilidade a mudanças de arquitetura.',
    internalNotes: 'Candidata validada para condução de entrevista técnica com o Head de Dados.',
    updatedAt: '2026-09-23T14:15:00Z',
    unlockedFreeGrant: false
  }
];

export const SEED_COMMUNITY_PROFILES: CommunityProfile[] = [
  {
    id: 'comm-lucas',
    userId: 'user-lucas',
    name: 'Lucas Almeida',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    headline: 'Front-end Engineer | React, TypeScript & Design Systems',
    bio: 'Apaixonado por acessibilidade web, performance de renderização no navegador e interfaces limpas.',
    city: 'São Paulo',
    state: 'SP',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Git'],
    interests: ['Design Systems', 'Acessibilidade (WCAG)', 'Micro-frontends', 'Clean Code'],
    githubUrl: 'https://github.com/lucasalmeida-mock',
    linkedinUrl: 'https://linkedin.com/in/lucasalmeida-mock',
    publicFields: {
      bio: true,
      location: true,
      skills: true,
      experiences: true,
      links: true
    }
  },
  {
    id: 'comm-marina',
    userId: 'user-marina',
    name: 'Marina Costa',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    headline: 'Senior Data Engineer | PySpark, Cloud Data Architecture & Data Governance',
    bio: 'Construindo pipelines distribuídos e fortalecendo comunidades técnicas de dados.',
    city: 'Campinas',
    state: 'SP',
    skills: ['Python', 'SQL', 'AWS', 'Spark', 'Airflow', 'Databricks'],
    interests: ['Data Lakehouse', 'Data Governance', 'LLM Infrastructure', 'Streaming Data'],
    githubUrl: 'https://github.com/marinacosta-mock',
    linkedinUrl: 'https://linkedin.com/in/marinacosta-mock',
    publicFields: {
      bio: true,
      location: true,
      skills: true,
      experiences: true,
      links: true
    }
  },
  {
    id: 'comm-rafael',
    userId: 'user-rafael-externo',
    name: 'Rafael Mendes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    headline: 'DevOps & Cloud Engineer | Linux, Docker, Terraform',
    bio: 'Especialista em automação de infraestrutura como código, observabilidade e confiabilidade de sistemas em nuvem.',
    city: 'Belo Horizonte',
    state: 'MG',
    skills: ['AWS', 'Docker', 'Terraform', 'Linux', 'GitHub Actions'],
    interests: ['Cloud Security', 'DevOps', 'CI/CD Pipelines', 'Kubernetes'],
    githubUrl: 'https://github.com/rafaelmendes',
    linkedinUrl: 'https://linkedin.com/in/rafaelmendes',
    publicFields: {
      bio: true,
      location: true,
      skills: true,
      experiences: true,
      links: true
    }
  }
];

export const SEED_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'user-marina',
    authorName: 'Marina Costa',
    authorHeadline: 'Senior Data Engineer | PySpark, AWS',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    type: 'post',
    content: 'Compartilhando uma lição aprendida em produção: quando estiverem orquestrando jobs com Apache Airflow e Spark na AWS, certifiquem-se de isolar a limpeza de metadados temporários em buckets S3 de lifecycle rules curtas. Reduzimos custos de armazenamento em 28% com essa política simples.',
    tags: ['AWS', 'Spark', 'Airflow', 'DataEngineering'],
    likes: 14,
    likedBy: ['user-lucas', 'user-rafael-externo'],
    commentsCount: 2,
    savedBy: ['user-lucas'],
    createdAt: '2026-09-24T18:00:00Z'
  },
  {
    id: 'post-2',
    authorId: 'user-rafael-externo',
    authorName: 'Rafael Mendes',
    authorHeadline: 'DevOps & Cloud Engineer | Linux, Docker',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'pergunta',
    content: 'Pessoal de Frontend e Backend: para testes end-to-end em pipelines com GitHub Actions, vocês têm preferido Playwright ou Cypress rodando em containers Docker isolados? Quais dores encontraram de concorrência?',
    tags: ['QA/Testes', 'Docker', 'DevOps', 'CI/CD'],
    likes: 8,
    likedBy: ['user-lucas'],
    commentsCount: 1,
    savedBy: [],
    createdAt: '2026-09-25T10:30:00Z'
  }
];

export const SEED_COMMENTS: PostComment[] = [
  {
    id: 'comm-c1',
    postId: 'post-1',
    authorId: 'user-lucas',
    authorName: 'Lucas Almeida',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'Excelente insight, Marina! No frontend costumamos ter esse cuidado com artefatos de build intermediários no CI/CD.',
    createdAt: '2026-09-24T19:15:00Z'
  },
  {
    id: 'comm-c2',
    postId: 'post-2',
    authorId: 'user-lucas',
    authorName: 'Lucas Almeida',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'Por aqui migramos para Playwright recentemente pela execução nativa e paralela rápida em Chromium e WebKit sem dores de memória.',
    createdAt: '2026-09-25T11:00:00Z'
  }
];

export const SEED_CONNECTIONS: Connection[] = [
  {
    id: 'conn-1',
    userAId: 'user-lucas',
    userBId: 'user-marina',
    degree: '1º grau',
    status: 'conectado'
  },
  {
    id: 'conn-2',
    userAId: 'user-lucas',
    userBId: 'user-rafael-externo',
    degree: '2º grau',
    status: 'conectado'
  }
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipientUserId: 'user-lucas',
    title: 'Nova oportunidade compatível identificada',
    message: 'A vaga de Desenvolvedor(a) Front-end Pleno na Orion Tech Solutions é altamente compatível com seu perfil (91% de compatibilidade).',
    type: 'vaga',
    read: false,
    createdAt: '2026-09-22T10:05:00Z'
  },
  {
    id: 'notif-2',
    recipientUserId: 'user-orion',
    title: 'Double Opt-In Confirmado — Marina Costa',
    message: 'Marina Costa aceitou o convite da vaga Engenheiro(a) de Dados Sênior e liberou seus dados de contato.',
    type: 'processo',
    read: false,
    createdAt: '2026-09-23T14:15:00Z'
  },
  {
    id: 'notif-3',
    recipientUserId: 'user-admin',
    title: 'Nova habilidade sugerida para revisão',
    message: 'Lucas Almeida sugeriu a tecnologia "Rust WebAssembly" para curadoria do catálogo.',
    type: 'sistema',
    read: false,
    createdAt: '2026-09-24T09:30:00Z'
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-09-20T11:20:00Z',
    actor: 'Lucas Almeida',
    action: 'AI_INTERVIEW_COMPLETED',
    details: 'Entrevista textual comportamental concluída com sucesso (versão 1).'
  },
  {
    id: 'aud-2',
    timestamp: '2026-09-23T14:15:00Z',
    actor: 'Marina Costa',
    action: 'DOUBLE_OPT_IN_ACCEPTED',
    details: 'Candidata autorizou formalmente a liberação de contatos para a vaga Engenheiro de Dados Sênior da empresa Orion Tech Solutions.'
  }
];

export const SEED_REWARD_ITEMS: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'Voucher 50% Exame AWS Cloud Practitioner / Associate',
    category: 'Certificação',
    costEstalecas: 120,
    partner: 'AWS Training Partner',
    description: 'Código promocional oficial para agendamento de exame de certificação AWS via Pearson VUE.'
  },
  {
    id: 'rew-2',
    title: 'Ingresso VIP — QCon São Paulo / TDC Summit 2026',
    category: 'Evento',
    costEstalecas: 150,
    partner: 'Comunidade Tech Brasil',
    description: 'Credencial presencial ou online com acesso às trilhas de Arquitetura, IA e Engenharia de Dados.'
  },
  {
    id: 'rew-3',
    title: 'Assinatura Trimestral — Formação Full-Stack & IA',
    category: 'Curso',
    costEstalecas: 90,
    partner: 'Alura / Rocketseat Partner',
    description: 'Acesso irrestrito por 90 dias a laboratórios práticos de React, Node.js, Rust e Engenharia de Prompt.'
  },
  {
    id: 'rew-4',
    title: 'Créditos de API Cloud & GPU (US$ 25)',
    category: 'Parceiro',
    costEstalecas: 80,
    partner: 'Cloud Lab Credits',
    description: 'Saldo para deploy de projetos de portfólio, bancos PostgreSQL e testes de inferência LLM.'
  }
];

export const SEED_REWARD_TRANSACTIONS: RewardTransaction[] = [
  {
    id: 'tx-1',
    candidateId: 'cand-lucas',
    description: 'Bônus de Onboarding Completo + Entrevista Estruturada IA',
    amount: 50,
    type: 'credito',
    createdAt: '2026-09-19T15:00:00Z'
  },
  {
    id: 'tx-2',
    candidateId: 'cand-lucas',
    description: 'Indicação Aprovada (Programa Quem Indica — Vaga Backend Pleno)',
    amount: 100,
    type: 'credito',
    createdAt: '2026-09-21T18:20:00Z'
  },
  {
    id: 'tx-3',
    candidateId: 'cand-marina',
    description: 'Indicação Aprovada (Programa Quem Indica — Vaga Analytics)',
    amount: 100,
    type: 'credito',
    createdAt: '2026-09-22T11:10:00Z'
  },
  {
    id: 'tx-4',
    candidateId: 'cand-marina',
    description: 'Contribuição Técnica Destacada na Comunidade Q.I.',
    amount: 80,
    type: 'credito',
    createdAt: '2026-09-24T19:00:00Z'
  }
];

export const SEED_COMPANY_INVOICES: CompanyInvoice[] = [
  {
    id: 'inv-1',
    companyId: 'comp-orion',
    description: 'Pacote Corporativo Inicial (3 Créditos de Desbloqueio de Perfis)',
    amountBrl: 790,
    creditsAdded: 3,
    status: 'Pago (NFS-e Emitida)',
    nfseNumber: 'NFS-e 2026/000482-SP',
    createdAt: '2026-09-14T10:00:00Z'
  },
  {
    id: 'inv-2',
    companyId: 'comp-orion',
    description: 'Desbloqueio Vaga Padrão — Marina Costa (Eng. Dados Sênior)',
    amountBrl: 0,
    creditsAdded: -1,
    status: 'Pago (NFS-e Emitida)',
    nfseNumber: 'Consumo de 1 Crédito do Pacote',
    createdAt: '2026-09-23T14:16:00Z'
  }
];

export const SEED_COMMERCIAL_CONFIG: CommercialConfig = {
  singleUnlockPriceBrl: 290,
  package5PriceBrl: 1190,
  matchExpressTopN: 5,
  referralBonusEstalecas: 100,
  maxReferralsPerVacancy: 3
};

export const SEED_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    postId: 'post-ext-spam',
    postSnippet: 'Vendo planilha de contatos de recrutadores sem consentimento LGPD — chame no inbox...',
    authorName: 'Conta Externa Sinalizada',
    reporterName: 'Marina Costa',
    reason: 'Violação de Privacidade / Spam Comercial',
    status: 'pendente',
    createdAt: '2026-09-25T16:40:00Z'
  }
];