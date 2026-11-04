export type Seniority = 'Júnior' | 'Pleno' | 'Sênior';
export type SkillMastery = 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado' | 'Especialista';
export type WorkContractType = 'CLT' | 'PJ' | 'Projeto';
export type WorkModality = 'Remoto' | 'Híbrido' | 'Presencial';
export type Availability = 'Imediata' | '15 dias' | '30 dias' | 'A combinar';
export type VisibilityState = 'Ativo' | 'Discreto' | 'Pausado';
export type UserRole = 'profissional' | 'empresa' | 'admin';

export interface RegisteredUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  status: 'ativo' | 'onboarding_pendente';
  // Campos exclusivos de Empresa
  companyName?: string;
  cnpj?: string;
  companyId?: string;
  // Campos exclusivos de Profissional
  technicalArea?: string;
  seniority?: Seniority;
  candidateId?: string;
  onboardingCompleted?: boolean;
  // Vínculo opcional com persona demo
  isDemo?: boolean;
  personaId?: string;
}

export interface UserSession {
  userId: string;
  role: UserRole;
  email: string;
  loginAt: string;
}

export interface ProfessionalOnboardingData {
  headline: string;
  seniority: Seniority;
  hardSkills: string[];
  salaryMin: number;
  salaryMax: number;
  modality: WorkModality;
  city: string;
  state: string;
  availability: Availability;
}


export interface CandidateSkill {
  id: string;
  name: string;
  category: string;
  mastery: SkillMastery;
  years: number;
  months: number;
  isCustom?: boolean;
  status?: 'aprovada' | 'pendente_revisao';
}

export interface CandidateProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  headline: string;
  city: string;
  state: string;
  about: string;
  seniority: Seniority;
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    link?: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications: string[];
  languages: Array<{ language: string; level: string }>;
  githubUrl: string;
  gitlabUrl?: string;
  linkedinUrl: string;
  portfolioUrl?: string;
  email: string;
  phone: string;
  salaryMin: number;
  salaryMax: number;
  contractTypes: WorkContractType[];
  modalities: WorkModality[];
  locationPreference: string;
  availability: Availability;
  visibility: VisibilityState;
  skills: CandidateSkill[];
  isCommunityMember: boolean;
}

export interface AIInterviewAnswer {
  questionId: number;
  question: string;
  competency: string;
  answer: string;
}

export interface AIInterviewSession {
  id: string;
  candidateId: string;
  status: 'nao_iniciada' | 'concluida' | 'contestada';
  completedAt?: string;
  answers: AIInterviewAnswer[];
  summary: Array<{
    competency: string;
    level: string;
    evidence: string;
    confidence: 'Alta' | 'Média' | 'Insuficiente';
    insufficientEvidence?: boolean;
  }>;
  version: number;
}

export interface Vacancy {
  id: string;
  title: string;
  companyId: string;
  area: string;
  seniority: Seniority;
  mandatorySkills: string[];
  desirableSkills: string[];
  softSkills: string[];
  contractTypes: WorkContractType[];
  modality: WorkModality;
  location: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  conditions: string;
  isUrgentMatchExpress: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  about: string;
  city: string;
  state: string;
  website: string;
}

export type SelectionStage = 
  | 'match_identificado'
  | 'convite_enviado'
  | 'candidato_aceitou'
  | 'dados_liberados'
  | 'entrevista_agendada'
  | 'entrevista_realizada'
  | 'em_avaliacao'
  | 'aprovado'
  | 'recusado';

export interface SelectionProcess {
  id: string;
  vacancyId: string;
  candidateId: string;
  currentStage: SelectionStage;
  doubleOptInStatus: 'aguardando' | 'aceito' | 'recusado';
  doubleOptInDate?: string;
  accessGranted: boolean;
  demonstrativeScore: number;
  matchExplanation: string;
  internalNotes?: string;
  updatedAt: string;
  unlockedFreeGrant?: boolean;
  feedbackGiven?: boolean;
}

export interface CommunityProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  headline: string;
  bio: string;
  city: string;
  state: string;
  skills: string[];
  interests: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  publicFields: {
    bio: boolean;
    location: boolean;
    skills: boolean;
    experiences: boolean;
    links: boolean;
  };
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  type: 'post' | 'pergunta';
  content: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  commentsCount: number;
  savedBy: string[];
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Connection {
  id: string;
  userAId: string;
  userBId: string;
  degree: '1º grau' | '2º grau' | '3º grau';
  status: 'pendente' | 'conectado';
}

export interface AppNotification {
  id: string;
  recipientUserId: string;
  title: string;
  message: string;
  type: 'vaga' | 'processo' | 'comunidade' | 'sistema';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  actor: string;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'Certificação' | 'Curso' | 'Evento' | 'Parceiro';
  costEstalecas: number;
  partner: string;
  description: string;
}

export interface RewardTransaction {
  id: string;
  candidateId: string;
  description: string;
  amount: number;
  type: 'credito' | 'resgate';
  createdAt: string;
}

export interface CompanyInvoice {
  id: string;
  companyId: string;
  description: string;
  amountBrl: number;
  creditsAdded: number;
  status: 'Pago (NFS-e Emitida)' | 'Cortesia Match Express';
  nfseNumber: string;
  createdAt: string;
}

export interface CommercialConfig {
  singleUnlockPriceBrl: number;
  package5PriceBrl: number;
  matchExpressTopN: number;
  referralBonusEstalecas: number;
  maxReferralsPerVacancy: number;
}

export interface ModerationReport {
  id: string;
  postId: string;
  postSnippet: string;
  authorName: string;
  reporterName: string;
  reason: string;
  status: 'pendente' | 'resolvido';
  createdAt: string;
}