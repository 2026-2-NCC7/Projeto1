import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CandidateProfile, 
  Company, 
  Vacancy, 
  AIInterviewSession, 
  SelectionProcess,
  SelectionStage,
  CommunityProfile,
  CommunityPost,
  PostComment,
  Connection,
  AppNotification,
  AuditLog,
  CandidateSkill,
  RewardItem,
  RewardTransaction,
  CompanyInvoice,
  CommercialConfig,
  ModerationReport,
  Seniority,
  WorkModality,
  WorkContractType,
  RegisteredUser,
  UserSession,
  UserRole,
  ProfessionalOnboardingData
} from '../types';
import { 
  SEED_DEMO_USERS,
  SEED_COMPANIES, 
  SEED_VACANCIES, 
  SEED_CANDIDATE_LUCAS, 
  SEED_CANDIDATE_MARINA,
  SEED_INTERVIEW_LUCAS,
  SEED_INTERVIEW_MARINA,
  SEED_SELECTION_PROCESSES,
  SEED_COMMUNITY_PROFILES,
  SEED_POSTS,
  SEED_COMMENTS,
  SEED_CONNECTIONS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS,
  SEED_REWARD_ITEMS,
  SEED_REWARD_TRANSACTIONS,
  SEED_COMPANY_INVOICES,
  SEED_COMMERCIAL_CONFIG,
  SEED_MODERATION_REPORTS
} from '../mock/seedData';

export type ActivePersona = 
  | 'candidato-lucas'
  | 'candidato-marina'
  | 'empresa-orion'
  | 'comunidade-rafael'
  | 'admin-qitech'
  | string;

export interface RegisterProfessionalInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  technicalArea: string;
  seniority: Seniority;
}

export interface RegisterCompanyInput {
  companyName: string;
  cnpj: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: RegisteredUser;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activePersona: ActivePersona;
  setActivePersona: (persona: ActivePersona) => void;
  isAuthenticated: boolean;
  session: UserSession | null;
  currentUser: RegisteredUser | null;
  registeredUsers: RegisteredUser[];
  demoUsers: RegisteredUser[];
  currentCandidateId: string;
  currentCompany: Company;
  needsOnboarding: boolean;
  login: (persona: ActivePersona) => void;
  loginWithCredentials: (email: string, password: string, expectedRole?: UserRole) => AuthResult;
  registerProfessional: (input: RegisterProfessionalInput) => AuthResult;
  registerCompany: (input: RegisterCompanyInput) => AuthResult;
  completeProfessionalOnboarding: (data: ProfessionalOnboardingData) => void;
  logout: () => void;
  // Dados
  candidates: Record<string, CandidateProfile>;
  companies: Company[];
  vacancies: Vacancy[];
  interviews: Record<string, AIInterviewSession>;
  selectionProcesses: SelectionProcess[];
  communityProfiles: Record<string, CommunityProfile>;
  posts: CommunityPost[];
  comments: PostComment[];
  connections: Connection[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  customSkillsPending: string[];
  referrals: Array<{ id: string; candidateId: string; vacancyId: string; link: string; status?: 'aguardando' | 'aprovada' }>;
  rewardBalance: number;
  rewardItems: RewardItem[];
  rewardTransactions: RewardTransaction[];
  companyCredits: number;
  companyInvoices: CompanyInvoice[];
  commercialConfig: CommercialConfig;
  moderationReports: ModerationReport[];
  
  // Ações Candidato
  updateCandidateProfile: (candidateId: string, updated: Partial<CandidateProfile>) => void;
  addCandidateSkill: (candidateId: string, skill: CandidateSkill) => void;
  removeCandidateSkill: (candidateId: string, skillId: string) => void;
  suggestNewSkill: (skillName: string) => void;
  submitInterviewAnswers: (candidateId: string, answers: any[], summary: any[]) => void;
  contestInterview: (candidateId: string) => void;
  retakeInterview: (candidateId: string) => void;
  acceptOpportunity: (processId: string) => void;
  rejectOpportunity: (processId: string) => void;
  createReferralLink: (candidateId: string, vacancyId: string) => string;
  redeemReward: (candidateId: string, rewardId: string) => boolean;
  simulateReferralConversion: (candidateId: string, vacancyTitle: string) => void;
  joinCommunity: (candidateId: string, publicFields: any) => void;

  // Ações Empresa
  createVacancy: (newVacancy: Omit<Vacancy, 'id' | 'companyId' | 'createdAt'>) => void;
  unlockCandidateProfile: (processId: string, method: 'credit' | 'single_purchase') => boolean;
  buyCompanyCreditPackage: (creditsCount: number, priceBrl: number, packageLabel: string) => void;
  updateProcessStage: (processId: string, nextStage: SelectionStage) => void;
  approveCandidate: (processId: string) => void;
  rejectCandidate: (processId: string) => void;
  updateInternalNotes: (processId: string, notes: string) => void;
  giveFeedback: (processId: string) => void;

  // Ações Comunidade
  createPost: (content: string, type: 'post' | 'pergunta', tags: string[]) => void;
  createComment: (postId: string, content: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  connectToUser: (targetUserId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  migrateExternalToCandidate: (salaryMin: number, salaryMax: number, seniority: Seniority, modality: WorkModality, contracts: WorkContractType[]) => void;

  // Ações Admin
  approveCustomSkill: (skillEntry: string) => void;
  rejectCustomSkill: (skillEntry: string) => void;
  updateCommercialConfig: (newConfig: CommercialConfig) => void;
  resolveModerationReport: (reportId: string, deletePost?: boolean) => void;

  // Sistema
  markNotificationAsRead: (notificationId: string) => void;
  resetAllData: () => void;
}

const STORAGE_KEY = 'QITECH_PROD_STATE_V3';
const USERS_STORAGE_KEY = 'QITECH_USERS_V1';
const SESSION_STORAGE_KEY = 'QITECH_SESSION_V1';
const THEME_STORAGE_KEY = 'QITECH_THEME';

const normalizeCnpj = (cnpj: string) => cnpj.replace(/\D/g, '');
const isValidEmailFormat = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Coleção separada de usuários cadastrados: QITECH_USERS_V1
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error('Falha ao carregar QITECH_USERS_V1:', err);
    }
    return [];
  });

  // Sessão separada: QITECH_SESSION_V1
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.userId && parsed.role && parsed.email) {
          return {
            userId: parsed.userId,
            role: parsed.role,
            email: parsed.email,
            loginAt: parsed.loginAt || new Date().toISOString()
          };
        }
      }
    } catch (err) {
      console.error('Falha ao carregar QITECH_SESSION_V1:', err);
    }
    return null;
  });

  const allKnownUsers = [...SEED_DEMO_USERS, ...registeredUsers];
  const currentUser = session
    ? allKnownUsers.find(u => u.id === session.userId || u.email.toLowerCase() === session.email.toLowerCase()) || null
    : null;

  const isAuthenticated = Boolean(session && currentUser);

  const [activePersona, setActivePersonaState] = useState<ActivePersona>(() => {
    if (currentUser?.personaId) return currentUser.personaId;
    if (currentUser?.role === 'empresa') return 'empresa-orion';
    if (currentUser?.role === 'admin') return 'admin-qitech';
    return 'candidato-lucas';
  });

  useEffect(() => {
    if (currentUser) {
      if (currentUser.personaId) {
        setActivePersonaState(currentUser.personaId);
      } else if (currentUser.role === 'empresa') {
        setActivePersonaState('empresa-orion');
      } else if (currentUser.role === 'admin') {
        setActivePersonaState('admin-qitech');
      } else {
        setActivePersonaState(`candidato-${currentUser.id}`);
      }
    }
  }, [currentUser?.id, currentUser?.role, currentUser?.personaId]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Persistir QITECH_USERS_V1 separadamente
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Estados mockados de negócio (QITECH_PROD_STATE_V3)
  const [candidates, setCandidates] = useState<Record<string, CandidateProfile>>({
    'cand-lucas': SEED_CANDIDATE_LUCAS,
    'cand-marina': SEED_CANDIDATE_MARINA
  });
  const [companies, setCompanies] = useState<Company[]>(SEED_COMPANIES);
  const [vacancies, setVacancies] = useState<Vacancy[]>(SEED_VACANCIES);
  const [interviews, setInterviews] = useState<Record<string, AIInterviewSession>>({
    'cand-lucas': SEED_INTERVIEW_LUCAS,
    'cand-marina': SEED_INTERVIEW_MARINA
  });
  const [selectionProcesses, setSelectionProcesses] = useState<SelectionProcess[]>(SEED_SELECTION_PROCESSES);
  const [communityProfiles, setCommunityProfiles] = useState<Record<string, CommunityProfile>>({
    'user-lucas': SEED_COMMUNITY_PROFILES[0],
    'user-marina': SEED_COMMUNITY_PROFILES[1],
    'user-rafael-externo': SEED_COMMUNITY_PROFILES[2]
  });
  const [posts, setPosts] = useState<CommunityPost[]>(SEED_POSTS);
  const [comments, setComments] = useState<PostComment[]>(SEED_COMMENTS);
  const [connections, setConnections] = useState<Connection[]>(SEED_CONNECTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [customSkillsPending, setCustomSkillsPending] = useState<string[]>(['Rust WebAssembly (sugerida por Lucas)']);
  const [referrals, setReferrals] = useState<Array<{ id: string; candidateId: string; vacancyId: string; link: string; status?: 'aguardando' | 'aprovada' }>>([]);
  const [rewardItems] = useState<RewardItem[]>(SEED_REWARD_ITEMS);
  const [rewardTransactions, setRewardTransactions] = useState<RewardTransaction[]>(SEED_REWARD_TRANSACTIONS);
  const [companyCredits, setCompanyCredits] = useState<number>(2);
  const [companyInvoices, setCompanyInvoices] = useState<CompanyInvoice[]>(SEED_COMPANY_INVOICES);
  const [commercialConfig, setCommercialConfig] = useState<CommercialConfig>(SEED_COMMERCIAL_CONFIG);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(SEED_MODERATION_REPORTS);

  // Identifica o candidato ativo (suporta contas demo e novos profissionais cadastrados)
  const currentCandidateId =
    currentUser?.candidateId ||
    (activePersona === 'candidato-marina'
      ? 'cand-marina'
      : activePersona === 'comunidade-rafael' && candidates['cand-rafael']
      ? 'cand-rafael'
      : 'cand-lucas');

  // Identifica a empresa ativa (suporta Orion Tech demo e novas empresas cadastradas)
  const currentCompany: Company =
    (currentUser?.companyId ? companies.find(c => c.id === currentUser.companyId) : undefined) ||
    (currentUser?.role === 'empresa'
      ? {
          id: currentUser.companyId || `comp-${currentUser.id}`,
          name: currentUser.companyName || currentUser.name,
          cnpj: currentUser.cnpj || '00.000.000/0001-00',
          about: 'Empresa parceira registrada na plataforma Q.I. Tech.',
          city: 'São Paulo',
          state: 'SP',
          website: 'https://empresa.com.br'
        }
      : SEED_COMPANIES[0]);

  const needsOnboarding = Boolean(
    isAuthenticated &&
    currentUser?.role === 'profissional' &&
    currentUser.onboardingCompleted === false
  );

  // Calcula o saldo de Estalecas Q.I. do candidato ativo
  const rewardBalance = rewardTransactions
    .filter(t => t.candidateId === currentCandidateId)
    .reduce((acc, tx) => (tx.type === 'credito' ? acc + tx.amount : acc - tx.amount), 0);

  const saveSession = (user: RegisteredUser) => {
    const newSession: UserSession = {
      userId: user.id,
      role: user.role,
      email: user.email,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
    if (user.personaId) {
      setActivePersonaState(user.personaId);
    } else if (user.role === 'empresa') {
      setActivePersonaState('empresa-orion');
    } else if (user.role === 'admin') {
      setActivePersonaState('admin-qitech');
    } else {
      setActivePersonaState(`candidato-${user.id}`);
    }
  };

  const setActivePersona = (persona: ActivePersona) => {
    const demoTarget = SEED_DEMO_USERS.find(u => u.personaId === persona);
    if (demoTarget) {
      saveSession(demoTarget);
    } else {
      setActivePersonaState(persona);
    }
  };

  const login = (persona: ActivePersona) => {
    const demoTarget = SEED_DEMO_USERS.find(u => u.personaId === persona);
    if (demoTarget) {
      saveSession(demoTarget);
    }
  };

  const loginWithCredentials = (email: string, password: string, _expectedRole?: UserRole): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Informe seu endereço de e-mail.' };
    }
    if (!isValidEmailFormat(cleanEmail)) {
      return { success: false, error: 'Informe um endereço de e-mail válido.' };
    }
    if (!password) {
      return { success: false, error: 'Informe sua senha para continuar.' };
    }

    const matchedUser = [...SEED_DEMO_USERS, ...registeredUsers].find(
      u => u.email.trim().toLowerCase() === cleanEmail
    );

    if (!matchedUser) {
      return { success: false, error: 'Nenhuma conta encontrada com este e-mail.' };
    }

    if (matchedUser.password !== password) {
      return { success: false, error: 'Senha incorreta. Verifique suas credenciais e tente novamente.' };
    }

    saveSession(matchedUser);
    return { success: true, user: matchedUser };
  };

  const registerProfessional = (input: RegisterProfessionalInput): AuthResult => {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const { password, confirmPassword, technicalArea, seniority } = input;

    if (!name || !email || !password || !confirmPassword || !technicalArea.trim() || !seniority) {
      return { success: false, error: 'Preencha todos os campos obrigatórios para criar sua conta profissional.' };
    }
    if (!isValidEmailFormat(email)) {
      return { success: false, error: 'Formato de e-mail inválido. Digite um e-mail válido (ex: nome@dominio.com).' };
    }
    if (password.length < 6) {
      return { success: false, error: 'A senha deve possuir no mínimo 6 caracteres.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'A confirmação de senha não coincide com a senha informada.' };
    }

    const emailExists = [...SEED_DEMO_USERS, ...registeredUsers].some(
      u => u.email.trim().toLowerCase() === email
    );
    if (emailExists) {
      return { success: false, error: 'Este endereço de e-mail já está cadastrado na plataforma.' };
    }

    const userId = `user-${Date.now()}`;
    const candidateId = `cand-${userId}`;

    const newUser: RegisteredUser = {
      id: userId,
      role: 'profissional',
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      status: 'onboarding_pendente',
      technicalArea: technicalArea.trim(),
      seniority,
      candidateId,
      onboardingCompleted: false
    };

    const initialProfile: CandidateProfile = {
      id: candidateId,
      userId,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=006A7A&color=fff&bold=true`,
      headline: `Especialista em ${technicalArea.trim()} (${seniority})`,
      city: 'São Paulo',
      state: 'SP',
      about: `Profissional de tecnologia com atuação na vertical de ${technicalArea.trim()} e senioridade ${seniority}.`,
      seniority,
      experiences: [],
      projects: [],
      education: [],
      certifications: [],
      languages: [{ language: 'Português', level: 'Nativo' }],
      githubUrl: '',
      linkedinUrl: '',
      email,
      phone: '',
      salaryMin: seniority === 'Sênior' ? 14000 : seniority === 'Pleno' ? 8500 : 4500,
      salaryMax: seniority === 'Sênior' ? 19000 : seniority === 'Pleno' ? 11500 : 6500,
      contractTypes: ['CLT', 'PJ'],
      modalities: ['Remoto', 'Híbrido'],
      locationPreference: 'Remoto ou Híbrido',
      availability: 'Imediata',
      visibility: 'Ativo',
      isCommunityMember: false,
      skills: []
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setCandidates(prev => ({ ...prev, [candidateId]: initialProfile }));
    saveSession(newUser);

    return { success: true, user: newUser };
  };

  const registerCompany = (input: RegisterCompanyInput): AuthResult => {
    const companyName = input.companyName.trim();
    const cnpj = input.cnpj.trim();
    const email = input.email.trim().toLowerCase();
    const { password, confirmPassword } = input;

    if (!companyName || !cnpj || !email || !password || !confirmPassword) {
      return { success: false, error: 'Preencha todos os campos obrigatórios para cadastrar a empresa.' };
    }
    if (!isValidEmailFormat(email)) {
      return { success: false, error: 'Formato de e-mail corporativo inválido.' };
    }
    const cleanCnpj = normalizeCnpj(cnpj);
    if (cleanCnpj.length < 14) {
      return { success: false, error: 'Informe um CNPJ válido com 14 dígitos.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'A senha deve possuir no mínimo 6 caracteres.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'A confirmação de senha não coincide com a senha informada.' };
    }

    const emailExists = [...SEED_DEMO_USERS, ...registeredUsers].some(
      u => u.email.trim().toLowerCase() === email
    );
    if (emailExists) {
      return { success: false, error: 'Este e-mail corporativo já está cadastrado na plataforma.' };
    }

    const cnpjExistsInUsers = [...SEED_DEMO_USERS, ...registeredUsers].some(
      u => u.cnpj && normalizeCnpj(u.cnpj) === cleanCnpj
    );
    const cnpjExistsInCompanies = companies.some(
      c => normalizeCnpj(c.cnpj) === cleanCnpj
    );
    if (cnpjExistsInUsers || cnpjExistsInCompanies) {
      return { success: false, error: 'Este CNPJ já está cadastrado em outra conta corporativa.' };
    }

    const userId = `user-comp-${Date.now()}`;
    const companyId = `comp-${Date.now()}`;

    const newUser: RegisteredUser = {
      id: userId,
      role: 'empresa',
      name: companyName,
      companyName,
      cnpj,
      email,
      password,
      createdAt: new Date().toISOString(),
      status: 'ativo',
      companyId
    };

    const newCompany: Company = {
      id: companyId,
      name: companyName,
      cnpj,
      about: `${companyName} — conta corporativa registrada na Q.I. Tech.`,
      city: 'São Paulo',
      state: 'SP',
      website: ''
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setCompanies(prev => [...prev, newCompany]);
    saveSession(newUser);

    return { success: true, user: newUser };
  };

  const completeProfessionalOnboarding = (data: ProfessionalOnboardingData) => {
    if (!currentUser || !currentUser.candidateId) return;
    const candidateId = currentUser.candidateId;

    const mappedSkills: CandidateSkill[] = data.hardSkills.map((skName, idx) => ({
      id: `sk-onb-${Date.now()}-${idx}`,
      name: skName,
      category: currentUser.technicalArea || 'Tecnologia',
      mastery: data.seniority === 'Sênior' ? 'Avançado' : data.seniority === 'Pleno' ? 'Intermediário' : 'Básico',
      years: data.seniority === 'Sênior' ? 5 : data.seniority === 'Pleno' ? 3 : 1,
      months: 0
    }));

    setCandidates(prev => {
      const existing = prev[candidateId];
      if (!existing) return prev;
      return {
        ...prev,
        [candidateId]: {
          ...existing,
          headline: data.headline.trim(),
          seniority: data.seniority,
          skills: mappedSkills,
          salaryMin: data.salaryMin,
          salaryMax: data.salaryMax,
          modalities: [data.modality],
          city: data.city.trim() || 'São Paulo',
          state: data.state.trim().toUpperCase() || 'SP',
          locationPreference: `${data.city.trim() || 'São Paulo'}/${data.state.trim().toUpperCase() || 'SP'} (${data.modality})`,
          availability: data.availability
        }
      };
    });

    setRegisteredUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? { ...u, seniority: data.seniority, status: 'ativo', onboardingCompleted: true }
          : u
      )
    );

    // Gera matches iniciais com as vagas abertas para que o novo profissional já visualize oportunidades
    const hasExistingProcs = selectionProcesses.some(p => p.candidateId === candidateId);
    if (!hasExistingProcs && vacancies.length > 0) {
      const candSkillsLower = data.hardSkills.map(s => s.toLowerCase());
      const generatedProcs: SelectionProcess[] = vacancies.map((vac) => {
        const matched = vac.mandatorySkills.filter(req =>
          candSkillsLower.some(cs => cs.includes(req.toLowerCase()) || req.toLowerCase().includes(cs))
        );
        const ratio = vac.mandatorySkills.length > 0 ? matched.length / vac.mandatorySkills.length : 0.7;
        const score = Math.min(96, Math.max(74, Math.round(75 + ratio * 20)));
        return {
          id: `proc-onb-${vac.id}-${candidateId}`,
          vacancyId: vac.id,
          candidateId,
          currentStage: 'convite_enviado',
          doubleOptInStatus: 'aguardando',
          accessGranted: false,
          demonstrativeScore: score,
          matchExplanation: `Match identificado após seu onboarding para "${vac.title}": alinhamento com senioridade (${data.seniority}), modalidade (${data.modality}), pretensão salarial (R$ ${data.salaryMin.toLocaleString('pt-BR')} - R$ ${data.salaryMax.toLocaleString('pt-BR')}) e hard skills informadas (${data.hardSkills.join(', ')}).`,
          updatedAt: new Date().toISOString(),
          unlockedFreeGrant: false
        };
      });
      setSelectionProcesses(prev => [...generatedProcs, ...prev]);
    }

    // Concede bônus inicial de onboarding em Estalecas Q.I.
    const bonusTx: RewardTransaction = {
      id: `tx-onb-${Date.now()}`,
      candidateId,
      description: 'Bônus de Boas-Vindas — Onboarding Profissional Concluído',
      amount: 50,
      type: 'credito',
      createdAt: new Date().toISOString()
    };
    setRewardTransactions(prev => [bonusTx, ...prev]);

    addNotification(
      currentUser.id,
      'Perfil Técnico Configurado com Sucesso!',
      'Seu onboarding foi concluído e você recebeu +50 Estalecas Q.I. de boas-vindas. Confira as vagas compatíveis!',
      'sistema'
    );
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  };

  // Carregar do localStorage e sincronizar entre abas
  useEffect(() => {
    const loadFromStorage = (raw: string | null) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.candidates) setCandidates(parsed.candidates);
        if (parsed.companies) setCompanies(parsed.companies);
        if (parsed.vacancies) setVacancies(parsed.vacancies);
        if (parsed.interviews) setInterviews(parsed.interviews);
        if (parsed.selectionProcesses) setSelectionProcesses(parsed.selectionProcesses);
        if (parsed.communityProfiles) setCommunityProfiles(parsed.communityProfiles);
        if (parsed.posts) setPosts(parsed.posts);
        if (parsed.comments) setComments(parsed.comments);
        if (parsed.connections) setConnections(parsed.connections);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.customSkillsPending) setCustomSkillsPending(parsed.customSkillsPending);
        if (parsed.referrals) setReferrals(parsed.referrals);
        if (parsed.rewardTransactions) setRewardTransactions(parsed.rewardTransactions);
        if (typeof parsed.companyCredits === 'number') setCompanyCredits(parsed.companyCredits);
        if (parsed.companyInvoices) setCompanyInvoices(parsed.companyInvoices);
        if (parsed.commercialConfig) setCommercialConfig(parsed.commercialConfig);
        if (parsed.moderationReports) setModerationReports(parsed.moderationReports);
      } catch (err) {
        console.error('Falha ao restaurar dados salvos no MVP:', err);
      }
    };

    loadFromStorage(localStorage.getItem(STORAGE_KEY));

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        loadFromStorage(e.newValue);
      }
      if (e.key === USERS_STORAGE_KEY && e.newValue) {
        try {
          setRegisteredUsers(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === SESSION_STORAGE_KEY) {
        if (e.newValue) {
          try {
            setSession(JSON.parse(e.newValue));
          } catch (err) {
            console.error(err);
          }
        } else {
          setSession(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Salvar no localStorage a cada alteração
  useEffect(() => {
    const dataToSave = {
      candidates,
      companies,
      vacancies,
      interviews,
      selectionProcesses,
      communityProfiles,
      posts,
      comments,
      connections,
      notifications,
      auditLogs,
      customSkillsPending,
      referrals,
      rewardTransactions,
      companyCredits,
      companyInvoices,
      commercialConfig,
      moderationReports
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [candidates, companies, vacancies, interviews, selectionProcesses, communityProfiles, posts, comments, connections, notifications, auditLogs, customSkillsPending, referrals, rewardTransactions, companyCredits, companyInvoices, commercialConfig, moderationReports]);

  const addAudit = (action: string, details: string, actor: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      actor
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (recipientUserId: string, title: string, message: string, type: 'vaga' | 'processo' | 'comunidade' | 'sistema') => {
    const notif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recipientUserId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Funções Candidato
  const updateCandidateProfile = (candidateId: string, updated: Partial<CandidateProfile>) => {
    setCandidates(prev => {
      const current = prev[candidateId];
      if (!current) return prev;
      return {
        ...prev,
        [candidateId]: { ...current, ...updated }
      };
    });
    addAudit('CANDIDATE_PROFILE_UPDATED', `Perfil do candidato ${candidateId} atualizado`, candidates[candidateId]?.name || candidateId);
  };

  const addCandidateSkill = (candidateId: string, skill: CandidateSkill) => {
    setCandidates(prev => {
      const current = prev[candidateId];
      if (!current) return prev;
      return {
        ...prev,
        [candidateId]: {
          ...current,
          skills: [...current.skills, skill]
        }
      };
    });
  };

  const removeCandidateSkill = (candidateId: string, skillId: string) => {
    setCandidates(prev => {
      const current = prev[candidateId];
      if (!current) return prev;
      return {
        ...prev,
        [candidateId]: {
          ...current,
          skills: current.skills.filter(s => s.id !== skillId)
        }
      };
    });
  };

  const suggestNewSkill = (skillName: string) => {
    if (!skillName.trim()) return;
    const candName = currentUser?.name || (activePersona === 'candidato-marina' ? 'Marina' : 'Lucas');
    const label = `${skillName.trim()} (sugerida por ${candName})`;
    setCustomSkillsPending(prev => [...prev, label]);
    addAudit('NEW_SKILL_SUGGESTED', `Nova habilidade sugerida para revisão: "${skillName.trim()}"`, candName);
    addNotification('user-admin', 'Nova Habilidade Sugerida', `${candName} sugeriu a tecnologia "${skillName.trim()}" para curadoria do catálogo.`, 'sistema');
  };

  const submitInterviewAnswers = (candidateId: string, answers: any[], summary: any[]) => {
    setInterviews(prev => ({
      ...prev,
      [candidateId]: {
        id: `int-${candidateId}-${Date.now()}`,
        candidateId,
        status: 'concluida',
        completedAt: new Date().toISOString(),
        version: (prev[candidateId]?.version || 0) + 1,
        answers,
        summary
      }
    }));
    addAudit('AI_INTERVIEW_COMPLETED', `Entrevista textual de IA concluída para ${candidateId}`, candidates[candidateId]?.name || candidateId);
    addNotification(candidates[candidateId]?.userId || '', 'Entrevista de Competências Concluída', 'Seu perfil agora conta com resumo comportamental gerado por IA.', 'sistema');
  };

  const contestInterview = (candidateId: string) => {
    setInterviews(prev => {
      const cur = prev[candidateId];
      if (!cur) return prev;
      return {
        ...prev,
        [candidateId]: {
          ...cur,
          status: 'contestada'
        }
      };
    });
    addAudit('AI_INTERVIEW_CONTESTED', `Candidato ${candidateId} contestou a síntese comportamental automatizada`, candidates[candidateId]?.name || candidateId);
    addNotification(candidates[candidateId]?.userId || '', 'Contestação Registrada', 'Sua solicitação de revisão foi protocolada e aguarda análise da equipe.', 'sistema');
    addNotification('user-admin', 'Revisão de IA Solicitada (Art. 20 LGPD)', `O candidato ${candidates[candidateId]?.name} solicitou revisão da síntese comportamental de IA.`, 'sistema');
  };

  const retakeInterview = (candidateId: string) => {
    setInterviews(prev => {
      const cur = prev[candidateId];
      if (!cur) return prev;
      return {
        ...prev,
        [candidateId]: {
          ...cur,
          status: 'nao_iniciada'
        }
      };
    });
  };

  const acceptOpportunity = (processId: string) => {
    const proc = selectionProcesses.find(p => p.id === processId);
    if (!proc) return;

    const cand = candidates[proc.candidateId];
    const vac = vacancies.find(v => v.id === proc.vacancyId);

    // Verifica se é o 1º candidato com cortesia gratuita na vaga ou se já houve cortesia consumida
    const isFreeCourtesy = Boolean(proc.unlockedFreeGrant);

    setSelectionProcesses(prev => prev.map(p => {
      if (p.id === processId) {
        return {
          ...p,
          doubleOptInStatus: 'aceito',
          doubleOptInDate: new Date().toISOString(),
          accessGranted: isFreeCourtesy ? true : p.accessGranted,
          currentStage: isFreeCourtesy ? 'dados_liberados' : 'candidato_aceitou',
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    if (isFreeCourtesy) {
      const courtesyInvoice: CompanyInvoice = {
        id: `inv-free-${Date.now()}`,
        companyId: vac?.companyId || 'comp-orion',
        description: `1º Candidato Grátis no Match Express — ${cand?.name} (${vac?.title})`,
        amountBrl: 0,
        creditsAdded: 0,
        status: 'Cortesia Match Express',
        nfseNumber: 'Isento (Cortesia Comercial RN03)',
        createdAt: new Date().toISOString()
      };
      setCompanyInvoices(prev => [courtesyInvoice, ...prev]);
    }

    addAudit('DOUBLE_OPT_IN_ACCEPTED', `Candidato aceitou a oportunidade na vaga ${vac?.title || proc.vacancyId} (${isFreeCourtesy ? '1º Perfil Liberado como Cortesia Match Express' : 'Consentimento registrado'})`, cand?.name || 'Candidato');
    addNotification(cand?.userId || '', 'Double Opt-In Confirmado', `Você autorizou o envio dos seus contatos para a empresa referente à vaga ${vac?.title}.`, 'processo');
    addNotification('user-orion', `Double Opt-In Confirmado — ${cand?.name?.replace(' (fictício)', '').replace(' (fictícia)', '')}`, `O candidato aceitou o convite para a vaga "${vac?.title}". ${isFreeCourtesy ? 'Como 1º perfil do Match Express, os contatos foram liberados gratuitamente!' : 'Perfil disponível para desbloqueio comercial.'}`, 'processo');
  };

  const rejectOpportunity = (processId: string) => {
    const proc = selectionProcesses.find(p => p.id === processId);
    if (!proc) return;

    const cand = candidates[proc.candidateId];
    const vac = vacancies.find(v => v.id === proc.vacancyId);

    setSelectionProcesses(prev => prev.map(p => {
      if (p.id === processId) {
        return {
          ...p,
          doubleOptInStatus: 'recusado',
          accessGranted: false,
          currentStage: 'recusado',
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    addAudit('DOUBLE_OPT_IN_REJECTED', `Candidato recusou a oportunidade para ${vac?.title || proc.vacancyId}`, cand?.name || 'Candidato');
    addNotification(cand?.userId || '', 'Oportunidade Recusada', `Você recusou o convite para a vaga ${vac?.title}. Seus dados permaneceram privados.`, 'processo');
    addNotification('user-orion', 'Convite Recusado (Double Opt-In)', `Um candidato da shortlist recusou o convite para a vaga "${vac?.title}". Os dados pessoais permaneceram protegidos.`, 'processo');
  };

  const createReferralLink = (candidateId: string, vacancyId: string) => {
    const existingForVacancy = referrals.filter(r => r.candidateId === candidateId && r.vacancyId === vacancyId);
    if (existingForVacancy.length >= commercialConfig.maxReferralsPerVacancy) {
      return `LIMITE_ATINGIDO`;
    }
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const link = `https://qitech.com.br/convite?vaga=${vacancyId}&ind=${candidateId}-${code}`;
    setReferrals(prev => [...prev, { id: `ref-${Date.now()}`, candidateId, vacancyId, link, status: 'aguardando' }]);
    addAudit('REFERRAL_LINK_CREATED', `Link único de indicação gerado para vaga ${vacancyId} (Regra RN12/RN16)`, candidates[candidateId]?.name || candidateId);
    return link;
  };

  const simulateReferralConversion = (candidateId: string, vacancyTitle: string) => {
    const bonus = commercialConfig.referralBonusEstalecas;
    const newTx: RewardTransaction = {
      id: `tx-${Date.now()}`,
      candidateId,
      description: `Bônus por Indicação Contratada (Vaga: ${vacancyTitle})`,
      amount: bonus,
      type: 'credito',
      createdAt: new Date().toISOString()
    };
    setRewardTransactions(prev => [newTx, ...prev]);
    setReferrals(prev => prev.map((r, idx) => idx === prev.length - 1 ? { ...r, status: 'aprovada' } : r));
    addAudit('ESTALECAS_REWARD_GRANTED', `Crédito de +${bonus} Estalecas Q.I. concedido após aprovação validada de indicado (RN14)`, 'Motor de Recompensas Q.I.');
    addNotification(candidates[candidateId]?.userId || '', `🪙 +${bonus} Estalecas Q.I. Recebidas!`, `Sua indicação para "${vacancyTitle}" foi aprovada pela empresa! Seus créditos já estão disponíveis para resgate.`, 'sistema');
  };

  const redeemReward = (candidateId: string, rewardId: string): boolean => {
    const item = rewardItems.find(r => r.id === rewardId);
    if (!item) return false;

    const currentBalance = rewardTransactions
      .filter(t => t.candidateId === candidateId)
      .reduce((acc, tx) => (tx.type === 'credito' ? acc + tx.amount : acc - tx.amount), 0);

    if (currentBalance < item.costEstalecas) return false;

    const newTx: RewardTransaction = {
      id: `tx-red-${Date.now()}`,
      candidateId,
      description: `Resgate: ${item.title} (${item.partner})`,
      amount: item.costEstalecas,
      type: 'resgate',
      createdAt: new Date().toISOString()
    };
    setRewardTransactions(prev => [newTx, ...prev]);
    addAudit('REWARD_REDEEMED', `Resgate de benefício "${item.title}" por ${item.costEstalecas} Estalecas Q.I.`, candidates[candidateId]?.name || candidateId);
    addNotification(candidates[candidateId]?.userId || '', '🎁 Benefício Resgatado com Sucesso!', `Seu voucher para "${item.title}" foi emitido e enviado ao seu e-mail cadastrado.`, 'sistema');
    return true;
  };

  const joinCommunity = (candidateId: string, publicFields: any) => {
    const cand = candidates[candidateId];
    if (!cand) return;

    const newProfile: CommunityProfile = {
      id: `comm-${candidateId}`,
      userId: cand.userId,
      name: cand.name.replace(' (fictício)', '').replace(' (fictícia)', ''),
      avatar: cand.avatar,
      headline: cand.headline,
      bio: cand.about,
      city: cand.city,
      state: cand.state,
      skills: cand.skills.map(s => s.name),
      interests: ['Frontend', 'React', 'Boas práticas', 'TypeScript'],
      githubUrl: cand.githubUrl,
      linkedinUrl: cand.linkedinUrl,
      publicFields: publicFields || {
        bio: true,
        location: true,
        skills: true,
        experiences: true,
        links: true
      }
    };

    setCommunityProfiles(prev => ({ ...prev, [cand.userId]: newProfile }));
    setCandidates(prev => ({
      ...prev,
      [candidateId]: { ...prev[candidateId], isCommunityMember: true }
    }));

    addAudit('COMMUNITY_JOINED', `Candidato ${cand.name} aderiu à comunidade técnica como pessoa física`, cand.name);
    addNotification(cand.userId, 'Bem-vindo à Comunidade Q.I. Tech!', 'Seu perfil comunitário público foi criado respeitando suas preferências de privacidade.', 'comunidade');
  };

  // Funções Empresa
  const createVacancy = (newVacancy: Omit<Vacancy, 'id' | 'companyId' | 'createdAt'>) => {
    const vacId = `vac-${Date.now()}`;
    const activeCompId = currentCompany?.id || 'comp-orion';
    const activeCompName = currentCompany?.name || 'Orion Tech Solutions';
    const created: Vacancy = {
      ...newVacancy,
      id: vacId,
      companyId: activeCompId,
      createdAt: new Date().toISOString()
    };
    setVacancies(prev => [created, ...prev]);

    // Executa o Match Engine automaticamente sobre os candidatos ativos da base
    const allCands = Object.values(candidates).filter(c => c.visibility !== 'Pausado');
    const newProcesses: SelectionProcess[] = allCands.map((cand, index) => {
      const candSkillsLower = cand.skills.map(s => s.name.toLowerCase());
      const matchedSkills = created.mandatorySkills.filter(req =>
        candSkillsLower.some(cs => cs.includes(req.toLowerCase()) || req.toLowerCase().includes(cs))
      );
      const ratio = created.mandatorySkills.length > 0 ? matchedSkills.length / created.mandatorySkills.length : 0.75;
      const computedScore = Math.min(98, Math.max(72, Math.round(74 + ratio * 22)));

      return {
        id: `proc-${vacId}-${cand.id}`,
        vacancyId: vacId,
        candidateId: cand.id,
        currentStage: 'convite_enviado',
        doubleOptInStatus: 'aguardando',
        accessGranted: false,
        demonstrativeScore: computedScore,
        matchExplanation: `Match calculado automaticamente para "${created.title}": compatibilidade de senioridade (${cand.seniority}), sobreposição técnica (${matchedSkills.length ? matchedSkills.join(', ') : 'stacks correlatas'}), faixa salarial transparente (R$ ${created.salaryMin.toLocaleString('pt-BR')} - R$ ${created.salaryMax.toLocaleString('pt-BR')}) e evidências de soft skills validadas.`,
        updatedAt: new Date().toISOString(),
        unlockedFreeGrant: created.isUrgentMatchExpress && index === 0
      };
    });

    setSelectionProcesses(prev => [...newProcesses, ...prev]);
    addAudit('VACANCY_CREATED', `Nova vaga publicada: "${created.title}" (${created.isUrgentMatchExpress ? 'Match Express Ativo' : 'Vaga Padrão'}) com faixa salarial transparente R$ ${created.salaryMin} - R$ ${created.salaryMax}`, activeCompName);

    allCands.forEach(c => {
      addNotification(c.userId, `Novo Convite de Vaga (${created.isUrgentMatchExpress ? 'Match Express' : 'Match Compatível'})`, `A ${activeCompName} publicou a vaga "${created.title}" compatível com seu perfil. Confirme o Double Opt-In se desejar liberar seu contato.`, 'vaga');
    });
  };

  const unlockCandidateProfile = (processId: string, method: 'credit' | 'single_purchase'): boolean => {
    const proc = selectionProcesses.find(p => p.id === processId);
    if (!proc || proc.doubleOptInStatus !== 'aceito') return false;

    const cand = candidates[proc.candidateId];
    const vac = vacancies.find(v => v.id === proc.vacancyId);
    const activeCompName = currentCompany?.name || 'Orion Tech Solutions';

    if (method === 'credit') {
      if (companyCredits <= 0) return false;
      setCompanyCredits(prev => prev - 1);
      const newInv: CompanyInvoice = {
        id: `inv-${Date.now()}`,
        companyId: currentCompany?.id || 'comp-orion',
        description: `Desbloqueio de Perfil Adicional (1 Crédito) — ${cand?.name} (${vac?.title})`,
        amountBrl: 0,
        creditsAdded: -1,
        status: 'Pago (NFS-e Emitida)',
        nfseNumber: 'Consumo de Crédito Corporativo',
        createdAt: new Date().toISOString()
      };
      setCompanyInvoices(prev => [newInv, ...prev]);
    } else {
      const nfseNum = `NFS-e 2026/00${Math.floor(1000 + Math.random() * 8999)}-SP`;
      const newInv: CompanyInvoice = {
        id: `inv-${Date.now()}`,
        companyId: currentCompany?.id || 'comp-orion',
        description: `Compra Avulsa de Desbloqueio — ${cand?.name} (${vac?.title})`,
        amountBrl: commercialConfig.singleUnlockPriceBrl,
        creditsAdded: 0,
        status: 'Pago (NFS-e Emitida)',
        nfseNumber: nfseNum,
        createdAt: new Date().toISOString()
      };
      setCompanyInvoices(prev => [newInv, ...prev]);
    }

    setSelectionProcesses(prev => prev.map(p => {
      if (p.id === processId) {
        return {
          ...p,
          accessGranted: true,
          currentStage: 'dados_liberados',
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    addAudit('CANDIDATE_ACCESS_GRANTED_PAID', `Empresa desbloqueou perfil de ${cand?.name} na vaga "${vac?.title}" (${method === 'credit' ? '1 Crédito Consumido' : `Compra Avulsa R$ ${commercialConfig.singleUnlockPriceBrl}`})`, activeCompName);
    addNotification(cand?.userId || '', 'Empresa Acessou Seus Contatos', `A ${activeCompName} desbloqueou seus canais de contato para a vaga "${vac?.title}".`, 'processo');
    return true;
  };

  const buyCompanyCreditPackage = (creditsCount: number, priceBrl: number, packageLabel: string) => {
    setCompanyCredits(prev => prev + creditsCount);
    const nfseNum = `NFS-e 2026/00${Math.floor(1000 + Math.random() * 8999)}-SP`;
    const activeCompName = currentCompany?.name || 'Orion Tech Solutions';
    const newInv: CompanyInvoice = {
      id: `inv-pkg-${Date.now()}`,
      companyId: currentCompany?.id || 'comp-orion',
      description: `${packageLabel} (+${creditsCount} Créditos de Desbloqueio)`,
      amountBrl: priceBrl,
      creditsAdded: creditsCount,
      status: 'Pago (NFS-e Emitida)',
      nfseNumber: nfseNum,
      createdAt: new Date().toISOString()
    };
    setCompanyInvoices(prev => [newInv, ...prev]);
    addAudit('COMPANY_PACKAGE_PURCHASED', `Aquisição de ${packageLabel} (R$ ${priceBrl}) com emissão assíncrona da ${nfseNum}`, activeCompName);
    addNotification(currentUser?.id || 'user-orion', 'Pacote de Créditos Ativado + NFS-e Emitida', `Foram adicionados +${creditsCount} créditos corporativos. Nota fiscal ${nfseNum} disponível no painel.`, 'sistema');
  };

  const updateProcessStage = (processId: string, nextStage: SelectionStage) => {
    const proc = selectionProcesses.find(p => p.id === processId);
    if (!proc) return;
    const cand = candidates[proc.candidateId];
    const vac = vacancies.find(v => v.id === proc.vacancyId);
    const activeCompName = currentCompany?.name || 'Orion Tech Solutions';

    setSelectionProcesses(prev => prev.map(p => {
      if (p.id === processId) {
        return {
          ...p,
          currentStage: nextStage,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    addAudit('SELECTION_STAGE_UPDATED', `Etapa do processo alterada para: ${nextStage} (Vaga: ${vac?.title})`, activeCompName);
    
    const stageTitles: Record<SelectionStage, string> = {
      match_identificado: 'Match identificado',
      convite_enviado: 'Convite enviado',
      candidato_aceitou: 'Você aceitou a oportunidade',
      dados_liberados: 'Dados liberados',
      entrevista_agendada: 'Entrevista de seleção agendada com a empresa',
      entrevista_realizada: 'Entrevista de seleção realizada',
      em_avaliacao: 'Processo em avaliação técnica interna',
      aprovado: 'Aprovado no processo seletivo',
      recusado: 'Processo seletivo encerrado'
    };

    if (cand?.userId) {
      addNotification(cand.userId, `Atualização de Etapa — ${vac?.title}`, `Sua candidatura agora está na etapa: "${stageTitles[nextStage]}".`, 'processo');
    }
  };

  const approveCandidate = (processId: string) => {
    updateProcessStage(processId, 'aprovado');
    const proc = selectionProcesses.find(p => p.id === processId);
    const cand = proc ? candidates[proc.candidateId] : null;
    const vac = proc ? vacancies.find(v => v.id === proc.vacancyId) : null;
    const activeCompName = currentCompany?.name || 'Orion Tech Solutions';
    
    if (cand?.userId && vac) {
      addNotification(cand.userId, '🎉 Parabéns! Você foi aprovado no processo seletivo', `A empresa ${activeCompName} marcou você como aprovado para a vaga de ${vac.title}.`, 'processo');
    }
  };

  const rejectCandidate = (processId: string) => {
    updateProcessStage(processId, 'recusado');
    const proc = selectionProcesses.find(p => p.id === processId);
    const cand = proc ? candidates[proc.candidateId] : null;
    const vac = proc ? vacancies.find(v => v.id === proc.vacancyId) : null;
    
    if (cand?.userId && vac) {
      addNotification(cand.userId, 'Processo Seletivo Concluído', `O processo para a vaga de ${vac.title} foi encerrado. Agradecemos sua participação.`, 'processo');
    }
  };

  const updateInternalNotes = (processId: string, notes: string) => {
    setSelectionProcesses(prev => prev.map(p => {
      if (p.id === processId) {
        return { ...p, internalNotes: notes };
      }
      return p;
    }));
  };

  const giveFeedback = (processId: string) => {
    setSelectionProcesses(prev => prev.map(p => {
      if (p.id === processId) {
        return { ...p, feedbackGiven: true };
      }
      return p;
    }));
    addAudit('MATCH_FEEDBACK_LOGGED', `Feedback positivo de aderência registrado para auditoria interna`, currentCompany?.name || 'Orion Tech Solutions');
  };

  // Funções Comunidade
  const getActiveCommunityAuthor = () => {
    if (activePersona === 'comunidade-rafael') {
      return {
        id: 'user-rafael-externo',
        name: 'Rafael Mendes (Membro Externo)',
        headline: 'DevOps & Cloud Practitioner',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      };
    }
    if (activePersona === 'candidato-marina') {
      return {
        id: 'user-marina',
        name: 'Marina Costa',
        headline: 'Senior Data Engineer',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      };
    }
    if (currentUser && !currentUser.isDemo) {
      const cand = candidates[currentCandidateId];
      return {
        id: currentUser.id,
        name: currentUser.name,
        headline: cand?.headline || `${currentUser.technicalArea || 'Tecnologia'} (${currentUser.seniority || 'Pleno'})`,
        avatar: cand?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=006A7A&color=fff&bold=true`
      };
    }
    return {
      id: 'user-lucas',
      name: 'Lucas Almeida',
      headline: 'Front-end Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  };

  const createPost = (content: string, type: 'post' | 'pergunta', tags: string[]) => {
    const author = getActiveCommunityAuthor();

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: author.id,
      authorName: author.name,
      authorHeadline: author.headline,
      authorAvatar: author.avatar,
      type,
      content,
      tags: tags.length ? tags : ['Tecnologia'],
      likes: 0,
      likedBy: [],
      commentsCount: 0,
      savedBy: [],
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [newPost, ...prev]);
    addAudit('COMMUNITY_POST_CREATED', `Publicação técnica criada por ${author.name}`, author.name);
  };

  const createComment = (postId: string, content: string) => {
    const author = getActiveCommunityAuthor();

    const newComment: PostComment = {
      id: `comm-c-${Date.now()}`,
      postId,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      content,
      createdAt: new Date().toISOString()
    };

    setComments(prev => [...prev, newComment]);
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, commentsCount: p.commentsCount + 1 };
      }
      return p;
    }));
  };

  const toggleLikePost = (postId: string) => {
    const currentUserId = getActiveCommunityAuthor().id;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likedBy.includes(currentUserId);
        return {
          ...p,
          likes: hasLiked ? p.likes - 1 : p.likes + 1,
          likedBy: hasLiked ? p.likedBy.filter(id => id !== currentUserId) : [...p.likedBy, currentUserId]
        };
      }
      return p;
    }));
  };

  const toggleSavePost = (postId: string) => {
    const currentUserId = getActiveCommunityAuthor().id;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasSaved = p.savedBy.includes(currentUserId);
        return {
          ...p,
          savedBy: hasSaved ? p.savedBy.filter(id => id !== currentUserId) : [...p.savedBy, currentUserId]
        };
      }
      return p;
    }));
  };

  const connectToUser = (targetUserId: string) => {
    const currentUserId = getActiveCommunityAuthor().id;
    const exists = connections.some(c => 
      (c.userAId === currentUserId && c.userBId === targetUserId) ||
      (c.userAId === targetUserId && c.userBId === currentUserId)
    );
    if (!exists) {
      const newConn: Connection = {
        id: `conn-${Date.now()}`,
        userAId: currentUserId,
        userBId: targetUserId,
        degree: '1º grau',
        status: 'conectado'
      };
      setConnections(prev => [...prev, newConn]);
      addAudit('CONNECTION_ESTABLISHED', `Conexão profissional estabelecida entre ${currentUserId} e ${targetUserId}`, 'Comunidade');
      addNotification(targetUserId, 'Nova conexão profissional', 'Um membro da comunidade conectou-se com você.', 'comunidade');
    }
  };

  const reportPost = (postId: string, reason: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const reporter = getActiveCommunityAuthor().name;
    const newReport: ModerationReport = {
      id: `rep-${Date.now()}`,
      postId: post.id,
      postSnippet: post.content.slice(0, 90) + '...',
      authorName: post.authorName,
      reporterName: reporter,
      reason,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };
    setModerationReports(prev => [newReport, ...prev]);
    addAudit('COMMUNITY_POST_REPORTED', `Publicação ${post.id} sinalizada para moderação por ${reporter}: "${reason}"`, reporter);
    addNotification('user-admin', 'Nova Denúncia na Comunidade', `${reporter} reportou uma publicação de ${post.authorName} para revisão.`, 'sistema');
  };

  const migrateExternalToCandidate = (salaryMin: number, salaryMax: number, seniority: Seniority, modality: WorkModality, contracts: WorkContractType[]) => {
    const rafaelComm = communityProfiles['user-rafael-externo'];
    if (!rafaelComm) return;

    const newCand: CandidateProfile = {
      id: 'cand-rafael',
      userId: 'user-rafael-externo',
      name: 'Rafael Mendes',
      avatar: rafaelComm.avatar,
      headline: rafaelComm.headline,
      city: rafaelComm.city,
      state: rafaelComm.state,
      about: rafaelComm.bio,
      seniority,
      experiences: [
        {
          id: 'exp-raf-1',
          role: 'DevOps & Cloud Engineer',
          company: 'CloudScale Systems',
          period: '2022 - Presente',
          description: 'Automação de clusters Kubernetes, pipelines CI/CD e infraestrutura como código na AWS com Terraform.'
        }
      ],
      projects: [],
      education: [{ id: 'edu-raf', degree: 'Tecnólogo em Redes e Cloud Computing', institution: 'FATEC', year: '2022' }],
      certifications: ['AWS Certified Solutions Architect'],
      languages: [{ language: 'Português', level: 'Nativo' }, { language: 'Inglês', level: 'Intermediário' }],
      githubUrl: rafaelComm.githubUrl || 'https://github.com/rafaelmendes-mock',
      linkedinUrl: rafaelComm.linkedinUrl || 'https://linkedin.com/in/rafaelmendes-mock',
      email: 'rafael.mendes@comunidade.com.br',
      phone: '(31) 99123-4567',
      salaryMin,
      salaryMax,
      contractTypes: contracts,
      modalities: [modality],
      locationPreference: 'Belo Horizonte/MG ou Remoto',
      availability: '15 dias',
      visibility: 'Ativo',
      isCommunityMember: true,
      skills: rafaelComm.skills.map((s, idx) => ({
        id: `sk-raf-${idx}`,
        name: s,
        category: 'DevOps/Cloud',
        mastery: 'Avançado',
        years: 3,
        months: 0
      }))
    };

    setCandidates(prev => ({ ...prev, 'cand-rafael': newCand }));

    // Vincula Rafael como candidato compatível na vaga de Dados/Cloud para demonstrar na empresa!
    const newProc: SelectionProcess = {
      id: `proc-rafael-${Date.now()}`,
      vacancyId: 'vac-dados-senior',
      candidateId: 'cand-rafael',
      currentStage: 'candidato_aceitou',
      doubleOptInStatus: 'aceito',
      doubleOptInDate: new Date().toISOString(),
      accessGranted: false,
      demonstrativeScore: 88,
      matchExplanation: 'Membro da comunidade técnica que ativou voluntariamente o perfil de candidato (Regra CM05). Forte aderência em infraestrutura AWS, Docker e automação de pipelines.',
      updatedAt: new Date().toISOString(),
      unlockedFreeGrant: false
    };
    setSelectionProcesses(prev => [...prev, newProc]);

    addAudit('COMMUNITY_MEMBER_MIGRATED_TO_CANDIDATE', 'Rafael Mendes converteu voluntariamente seu perfil comunitário para candidato elegível ao matchmaking (CM05/RM06)', 'Rafael Mendes');
    addNotification('user-orion', 'Novo Talento da Comunidade no Matchmaking!', 'Rafael Mendes (DevOps & AWS) habilitou o perfil para recrutamento e confirmou interesse na vaga.', 'vaga');
  };

  // Funções Admin
  const approveCustomSkill = (skillEntry: string) => {
    const cleanName = skillEntry.replace(/\s*\(sugerida por .*\)$/i, '').trim();
    setCustomSkillsPending(prev => prev.filter(s => s !== skillEntry));

    setCandidates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(candId => {
        const cand = updated[candId];
        const hasSkill = cand.skills.some(sk => sk.name.toLowerCase() === cleanName.toLowerCase());
        if (hasSkill) {
          updated[candId] = {
            ...cand,
            skills: cand.skills.map(sk =>
              sk.name.toLowerCase() === cleanName.toLowerCase()
                ? { ...sk, status: 'aprovada', category: sk.category === 'Especialidade Sugerida' ? 'Catálogo Oficial (Curadoria)' : sk.category }
                : sk
            )
          };
        }
      });
      return updated;
    });

    addAudit('SKILL_CURATION_APPROVED', `Habilidade "${cleanName}" aprovada e incorporada ao catálogo normalizado`, 'Admin Q.I. Tech');
    const targetUser = skillEntry.toLowerCase().includes('marina') ? 'user-marina' : 'user-lucas';
    addNotification(targetUser, 'Habilidade Aprovada pela Curadoria!', `A tecnologia "${cleanName}" que você sugeriu foi revisada e aprovada no catálogo oficial da Q.I. Tech.`, 'sistema');
  };

  const rejectCustomSkill = (skillEntry: string) => {
    const cleanName = skillEntry.replace(/\s*\(sugerida por .*\)$/i, '').trim();
    setCustomSkillsPending(prev => prev.filter(s => s !== skillEntry));

    setCandidates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(candId => {
        const cand = updated[candId];
        updated[candId] = {
          ...cand,
          skills: cand.skills.filter(sk => !(sk.isCustom && sk.name.toLowerCase() === cleanName.toLowerCase()))
        };
      });
      return updated;
    });

    addAudit('SKILL_CURATION_REJECTED', `Sugestão de habilidade "${cleanName}" recusada pela curadoria`, 'Admin Q.I. Tech');
    const targetUser = skillEntry.toLowerCase().includes('marina') ? 'user-marina' : 'user-lucas';
    addNotification(targetUser, 'Sugestão de Habilidade Revisada', `A sugestão "${cleanName}" não foi incorporada ao catálogo padronizado.`, 'sistema');
  };

  const updateCommercialConfig = (newConfig: CommercialConfig) => {
    setCommercialConfig(newConfig);
    addAudit('COMMERCIAL_PARAMS_UPDATED', `Parâmetros comerciais atualizados pelo Admin: Desbloqueio avulso R$ ${newConfig.singleUnlockPriceBrl}, Pacote R$ ${newConfig.package5PriceBrl}, Top N=${newConfig.matchExpressTopN}, Bônus Indicação=${newConfig.referralBonusEstalecas} Estalecas (RN05)`, 'Admin Q.I. Tech');
  };

  const resolveModerationReport = (reportId: string, deletePost?: boolean) => {
    const rep = moderationReports.find(r => r.id === reportId);
    setModerationReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolvido' } : r));
    if (deletePost && rep) {
      setPosts(prev => prev.filter(p => p.id !== rep.postId));
    }
    addAudit('MODERATION_ACTION_TAKEN', `Denúncia ${reportId} tratada pela governança (${deletePost ? 'Conteúdo removido' : 'Arquivada após análise'})`, 'Admin Q.I. Tech');
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCandidates({
      'cand-lucas': SEED_CANDIDATE_LUCAS,
      'cand-marina': SEED_CANDIDATE_MARINA
    });
    setCompanies(SEED_COMPANIES);
    setVacancies(SEED_VACANCIES);
    setInterviews({
      'cand-lucas': SEED_INTERVIEW_LUCAS,
      'cand-marina': SEED_INTERVIEW_MARINA
    });
    setSelectionProcesses(SEED_SELECTION_PROCESSES);
    setCommunityProfiles({
      'user-lucas': SEED_COMMUNITY_PROFILES[0],
      'user-marina': SEED_COMMUNITY_PROFILES[1],
      'user-rafael-externo': SEED_COMMUNITY_PROFILES[2]
    });
    setPosts(SEED_POSTS);
    setComments(SEED_COMMENTS);
    setConnections(SEED_CONNECTIONS);
    setNotifications(SEED_NOTIFICATIONS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setCustomSkillsPending(['Rust WebAssembly (sugerida por Lucas)']);
    setReferrals([]);
    setRewardTransactions(SEED_REWARD_TRANSACTIONS);
    setCompanyCredits(2);
    setCompanyInvoices(SEED_COMPANY_INVOICES);
    setCommercialConfig(SEED_COMMERCIAL_CONFIG);
    setModerationReports(SEED_MODERATION_REPORTS);
    addNotification('user-lucas', 'Sistema Reiniciado', 'Dados mock reinicializados com sucesso para o estado original.', 'sistema');
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      activePersona,
      setActivePersona,
      isAuthenticated,
      session,
      currentUser,
      registeredUsers,
      demoUsers: SEED_DEMO_USERS,
      currentCandidateId,
      currentCompany,
      needsOnboarding,
      login,
      loginWithCredentials,
      registerProfessional,
      registerCompany,
      completeProfessionalOnboarding,
      logout,
      candidates,
      companies,
      vacancies,
      interviews,
      selectionProcesses,
      communityProfiles,
      posts,
      comments,
      connections,
      notifications,
      auditLogs,
      customSkillsPending,
      referrals,
      rewardBalance,
      rewardItems,
      rewardTransactions,
      companyCredits,
      companyInvoices,
      commercialConfig,
      moderationReports,
      updateCandidateProfile,
      addCandidateSkill,
      removeCandidateSkill,
      suggestNewSkill,
      submitInterviewAnswers,
      contestInterview,
      retakeInterview,
      acceptOpportunity,
      rejectOpportunity,
      createReferralLink,
      redeemReward,
      simulateReferralConversion,
      joinCommunity,
      createVacancy,
      unlockCandidateProfile,
      buyCompanyCreditPackage,
      updateProcessStage,
      approveCandidate,
      rejectCandidate,
      updateInternalNotes,
      giveFeedback,
      createPost,
      createComment,
      toggleLikePost,
      toggleSavePost,
      connectToUser,
      reportPost,
      migrateExternalToCandidate,
      approveCustomSkill,
      rejectCustomSkill,
      updateCommercialConfig,
      resolveModerationReport,
      markNotificationAsRead,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};