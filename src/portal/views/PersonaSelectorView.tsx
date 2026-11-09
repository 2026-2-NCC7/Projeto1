import { signInWithGoogle, signInWithGithub, isSupabaseConfigured } from '../../services/supabaseClient';
import React, { useState, useEffect } from 'react';
import { useApp, ActivePersona } from '../context/AppContext';
import { Seniority } from '../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  KeyRound, 
  LogIn, 
  UserPlus, 
  Building2, 
  User, 
  Zap, 
  Award, 
  Users, 
  X, 
  Briefcase, 
  Sparkles, 
  Sun, 
  Moon, 
  AlertCircle, 
  PlayCircle,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Cookie
} from 'lucide-react';
import { 
  evaluatePasswordStrength, 
  getRemainingLockoutSeconds, 
  recordFailedLoginAttempt, 
  clearLoginAttempts,
  preventClickjacking,
  isEmbeddedInIframe
} from '../utils/security';
import { AnimatedIcon } from '../components/common/AnimatedIcon';
import { CookieConsentModal } from '../components/common/CookieConsentModal';

type SignupTab = 'profissional' | 'empresa' | 'admin';

interface DemoAccountOption {
  id: ActivePersona;
  name: string;
  roleLabel: string;
  badge: string;
  email: string;
  description: string;
}

const TECHNICAL_AREAS = [
  'Frontend',
  'Backend / APIs',
  'Full-Stack',
  'Dados / IA',
  'DevOps / Cloud',
  'Mobile',
  'QA / Testes',
  'Segurança da Informação'
];

const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const pwdEval = evaluatePasswordStrength(password);
  if (!password) return null;

  return (
    <div className="space-y-2 p-3 rounded-xl bg-[#0D111A] border border-[#232D3F] mt-2 text-left">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Classificação de Segurança:</span>
        <span className="font-bold font-mono text-xs" style={{ color: pwdEval.color }}>
          {pwdEval.label}
        </span>
      </div>

      {/* Barra de Progresso Dinâmica */}
      <div className="w-full bg-[#182130] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{ width: `${pwdEval.percentage}%`, backgroundColor: pwdEval.color }}
        />
      </div>

      {/* Checklist de Requisitos Obrigatórios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
        {pwdEval.criteria.map((c) => (
          <span
            key={c.id}
            className={`flex items-center gap-1.5 font-mono ${
              c.met ? 'text-emerald-400 font-medium' : 'text-slate-500'
            }`}
          >
            {c.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
            <span>{c.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export const PersonaSelectorView: React.FC<{ onEnterApp: () => void; initialAuthNotice?: string }> = ({
  onEnterApp,
  initialAuthNotice
}) => {
  const {
    theme,
    toggleTheme,
    login,
    loginWithCredentials,
    registerProfessional,
    registerCompany,
    commercialConfig,
    vacancies,
    companies
  } = useApp();
  const handleGoogleAuth = async () => {
    if (isSupabaseConfigured()) {
      try {
        await signInWithGoogle();
      } catch (err: any) {
        setLoginError(err.message || 'Falha ao conectar com o Google.');
      }
    } else {
      setLoginError('Supabase OAuth não configurado no .env.local. Conecte suas credenciais para usar Google.');
    }
  };

  const handleGithubAuth = async () => {
    if (isSupabaseConfigured()) {
      try {
        await signInWithGithub();
      } catch (err: any) {
        setLoginError(err.message || 'Falha ao conectar com o GitHub.');
      }
    } else {
      setLoginError('Supabase OAuth não configurado no .env.local. Conecte suas credenciais para usar GitHub.');
    }
  };


  const demoAccounts: DemoAccountOption[] = [
    {
      id: 'candidato-lucas',
      name: 'Lucas Almeida',
      roleLabel: 'Desenvolvedor Front-end Pleno',
      badge: 'Profissional',
      email: 'lucas@qitech.com.br',
      description: 'Candidato com match de 91% aguardando confirmação de Double Opt-In no Match Express.'
    },
    {
      id: 'candidato-marina',
      name: 'Marina Costa',
      roleLabel: 'Engenheira de Dados Sênior',
      badge: 'Profissional',
      email: 'marina@qitech.com.br',
      description: 'Candidata sênior com Double Opt-In aceito, entrevista IA concluída e participação ativa na comunidade.'
    },
    {
      id: 'empresa-orion',
      name: 'Orion Tech Solutions',
      roleLabel: 'Cliente Corporativo B2B',
      badge: 'Empresa',
      email: 'recrutamento@oriontech.com.br',
      description: 'Painel corporativo com vagas ativas, Match Express, desbloqueio de perfis e faturamento NFS-e.'
    },
    {
      id: 'admin-qitech',
      name: 'Governança Q.I. Match',
      roleLabel: 'Backoffice & Operações',
      badge: 'Admin',
      email: 'admin@qitech.com.br',
      description: 'Painel administrativo com parâmetros comerciais, curadoria de skills, moderação e trilha LGPD.'
    },
    {
      id: 'comunidade-rafael',
      name: 'Rafael Mendes',
      roleLabel: 'DevOps & Cloud Engineer',
      badge: 'Comunidade',
      email: 'rafael@comunidade.com.br',
      description: 'Membro externo da comunidade técnica com opção de migração voluntária para candidato.'
    }
  ];

  // Modais: 'login' | 'signup' | 'demo' | null
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | 'demo' | null>(null);
  const [authNotice, setAuthNotice] = useState<string>(initialAuthNotice || '');
  const [heroPersonaTab, setHeroPersonaTab] = useState<'dev' | 'empresa'>('dev');

  // Segurança: Trava Progressiva Anti-Força Bruta e Proteção contra Iframe/Clickjacking
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => getRemainingLockoutSeconds());
  const [showPassword, setShowPassword] = useState(false);
  const [isIframeDetected, setIsIframeDetected] = useState(false);

  useEffect(() => {
    // 1. Checagem Anti-Clickjacking & Spoofing
    if (isEmbeddedInIframe()) {
      setIsIframeDetected(true);
      preventClickjacking();
    }

    // 2. Trava Progressiva com Prevenção de Bypass via Reload (Cookie + LocalStorage)
    const initialLock = getRemainingLockoutSeconds();
    if (initialLock > 0) {
      setLockoutSeconds(initialLock);
    }

    const interval = setInterval(() => {
      const remaining = getRemainingLockoutSeconds();
      setLockoutSeconds(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initialAuthNotice) {
      setAuthNotice(initialAuthNotice);
      setActiveModal('login');
    }
  }, [initialAuthNotice]);

  // Estado do Modal de Login ("Entrar")
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estado do Modal de Cadastro ("Criar conta")
  const [signupRole, setSignupRole] = useState<SignupTab>('profissional');
  // Campos Profissional
  const [profName, setProfName] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profPassword, setProfPassword] = useState('');
  const [profConfirmPassword, setProfConfirmPassword] = useState('');
  const [profArea, setProfArea] = useState('Frontend');
  const [profSeniority, setProfSeniority] = useState<Seniority>('Pleno');
  // Campos Empresa
  const [compName, setCompName] = useState('');
  const [compCnpj, setCompCnpj] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compPassword, setCompPassword] = useState('');
  const [compConfirmPassword, setCompConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  // Estado do Modal de Acesso de Demonstração
  const [selectedDemoPersona, setSelectedDemoPersona] = useState<ActivePersona>('candidato-lucas');

  const openLoginModal = () => {
    setLoginError('');
    setActiveModal('login');
  };

  const openSignupModal = (defaultRole: SignupTab = 'profissional') => {
    setSignupRole(defaultRole);
    setSignupError('');
    setActiveModal('signup');
  };

  const openDemoModal = (defaultPersona: ActivePersona = 'candidato-lucas') => {
    setSelectedDemoPersona(defaultPersona);
    setActiveModal('demo');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) {
      setLoginError(`Acesso bloqueado por segurança. Aguarde ${lockoutSeconds}s para tentar novamente.`);
      return;
    }
    setLoginError('');
    const res = loginWithCredentials(loginEmail, loginPassword);
    if (!res.success) {
      const lockoutRes = recordFailedLoginAttempt();
      if (lockoutRes.isLocked) {
        setLockoutSeconds(lockoutRes.lockoutSeconds);
        setLoginError(`Múltiplas tentativas incorretas (${lockoutRes.attempts} falhas consecutivas). Por segurança contra ataques de força bruta, o acesso foi temporariamente travado por ${lockoutRes.lockoutSeconds} segundos. A trava persiste mesmo recarregando a página (F5).`);
      } else {
        const remainingAttempts = 3 - lockoutRes.attempts;
        setLoginError(`${res.error || 'Falha ao autenticar.'} (${remainingAttempts > 0 ? `${remainingAttempts} tentativa(s) restante(s) antes do bloqueio progressivo` : 'Bloqueio iminente'})`);
      }
      return;
    }

    clearLoginAttempts();
    setActiveModal(null);
    setAuthNotice('');
    onEnterApp();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (signupRole === 'admin') {
      setSignupError('O perfil Admin não permite auto-cadastro. Utilize o Acesso de Demonstração para entrar como Governança Q.I. Match.');
      return;
    }

    const currentPwd = signupRole === 'profissional' ? profPassword : compPassword;
    const pwdEval = evaluatePasswordStrength(currentPwd);
    if (!pwdEval.isStrongEnough) {
      setSignupError('Sua senha não atende aos requisitos de segurança. A senha deve ter no mínimo 8 caracteres, letras maiúsculas e minúsculas, ao menos um número e um caractere especial (!@#$...).');
      return;
    }

    if (signupRole === 'profissional') {
      const res = registerProfessional({
        name: profName,
        email: profEmail,
        password: profPassword,
        confirmPassword: profConfirmPassword,
        technicalArea: profArea,
        seniority: profSeniority
      });
      if (!res.success) {
        setSignupError(res.error || 'Erro ao criar conta de profissional.');
        return;
      }
      setActiveModal(null);
      setAuthNotice('');
      onEnterApp();
    } else if (signupRole === 'empresa') {
      const res = registerCompany({
        companyName: compName,
        cnpj: compCnpj,
        email: compEmail,
        password: compPassword,
        confirmPassword: compConfirmPassword
      });
      if (!res.success) {
        setSignupError(res.error || 'Erro ao criar conta corporativa.');
        return;
      }
      setActiveModal(null);
      setAuthNotice('');
      onEnterApp();
    }
  };

  const handleEnterDemo = () => {
    login(selectedDemoPersona);
    setActiveModal(null);
    setAuthNotice('');
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#e2e2e8] flex flex-col justify-between selection:bg-yellow-400 selection:text-black font-sans">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#111318]/90 backdrop-blur-md border-b border-[#262F40]/80">
        <div className="max-w-[1360px] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Logo & Protocol Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-heading font-black text-sm shadow-[0_0_15px_rgba(250,204,21,0.4)]">
              Q
            </div>
            <div>
              <span className="font-heading font-bold text-white text-base tracking-tight leading-none block">
                Q.I. Match
              </span>
              <span className="font-mono text-[9px] text-[#9a9078] block tracking-wider uppercase mt-0.5">
                INVERSE CORE • TALENT PROTOCOL
              </span>
            </div>
          </div>

          {/* Engine Status & Auth Actions */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1a1c20] border border-[#262F40] text-[11px] font-mono text-[#9a9078]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Motor IA Ativo (Whisper + Qwen)</span>
            </div>

            <button
              type="button"
              onClick={openLoginModal}
              className="px-3.5 py-1.5 rounded-lg bg-transparent hover:bg-white/5 border border-[#262F40] text-xs font-bold text-white transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-yellow-400" />
              <span>Entrar</span>
            </button>

            <button
              type="button"
              onClick={() => openSignupModal('profissional')}
              className="px-4 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all"
            >
              Criar Conta
            </button>
          </div>

        </div>
      </header>

      {/* AVISO DE SESSÃO / ROTA PROTEGIDA */}
      {authNotice && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2.5 text-center text-xs font-semibold text-yellow-300 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>{authNotice}</span>
          <button type="button" onClick={openLoginModal} className="underline font-bold text-yellow-400 ml-1">
            Fazer login agora
          </button>
        </div>
      )}

      {/* 2. HERO PRINCIPAL */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#262F40]/60">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-yellow-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          
          {/* Protocol Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 font-mono text-[11px] tracking-wider uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span>PROTOCOLO DE RECRUTAMENTO 3.8 • ELEVAÇÃO DO TAX DE ACERTO SELETIVO</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl">
            O Fim dos Processos Seletivos <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-300 to-yellow-400">
              Cansativos e Sem Retorno
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mt-5 leading-relaxed font-sans">
            Matchmaking de alta precisão técnica com corte mínimo de 75% e recrutamento invertido. A inteligência artificial avalia raciocínio sistêmico, não testes genéricos.
          </p>

          {/* Switcher: Sou Desenvolvedor vs Sou Empresa / RH */}
          <div className="inline-flex p-1 rounded-xl bg-[#161B26] border border-[#262F40] mt-8 shadow-inner">
            <button
              type="button"
              onClick={() => setHeroPersonaTab('dev')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                heroPersonaTab === 'dev'
                  ? 'bg-yellow-400 text-black shadow-[0_0_16px_rgba(250,204,21,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sou Desenvolvedor</span>
            </button>
            <button
              type="button"
              onClick={() => setHeroPersonaTab('empresa')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                heroPersonaTab === 'empresa'
                  ? 'bg-yellow-400 text-black shadow-[0_0_16px_rgba(250,204,21,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Sou Empresa / RH</span>
            </button>
          </div>

          {/* Dynamic Contextual Helper Card */}
          <div className="max-w-2xl w-full mt-4 p-4 rounded-xl bg-[#161B26]/90 border border-[#262F40] flex items-start gap-3 text-left shadow-lg">
            <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-wider block font-bold mb-0.5">
                {heroPersonaTab === 'dev' ? 'Para Talentos Técnicos • Acesso em 24h' : 'Para Lideranças de Engenharia • B2B'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {heroPersonaTab === 'dev'
                  ? 'Faça sua entrevista multimodal por voz ou via I.A. uma única vez. Seu código e raciocínio são avaliados contextualmente, e empresas de elite enviam propostas diretamente para você.'
                  : 'Acesse engenheiros qualificados acima de 75% com fit técnico comprovado. Pague apenas por slots de contratação sem mensalidades abusivas e receba relatórios auditáveis.'}
              </p>
            </div>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-7">
            <button
              type="button"
              onClick={() => openSignupModal(heroPersonaTab === 'dev' ? 'profissional' : 'empresa')}
              className="px-6 py-3.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(250,204,21,0.35)] transition-all transform hover:-translate-y-0.5"
            >
              <span>{heroPersonaTab === 'dev' ? 'Cadastrar como Desenvolvedor' : 'Contratar Talentos Pré-Avaliados'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openDemoModal(heroPersonaTab === 'dev' ? 'candidato-lucas' : 'empresa-orion')}
              className="px-5 py-3.5 rounded-lg bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <PlayCircle className="w-4 h-4 text-yellow-400" />
              <span>Acesso de Demonstração (Contas Seedadas)</span>
            </button>
          </div>

          {/* 4 Telemetry Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl mt-14 pt-8 border-t border-[#262F40]/80">
            <div className="p-4 rounded-xl bg-[#161B26]/50 border border-[#262F40]/60 text-center">
              <span className="font-heading font-black text-2xl sm:text-3xl text-white block">4.2 dias</span>
              <span className="text-[11px] text-slate-400 mt-1 block font-medium">Tempo Médio de Contratação</span>
            </div>
            <div className="p-4 rounded-xl bg-[#161B26]/50 border border-[#262F40]/60 text-center">
              <span className="font-heading font-black text-2xl sm:text-3xl text-emerald-400 block">94.8%</span>
              <span className="text-[11px] text-slate-400 mt-1 block font-medium">Retenção de Engenharia</span>
            </div>
            <div className="p-4 rounded-xl bg-[#161B26]/50 border border-[#262F40]/60 text-center">
              <span className="font-heading font-black text-2xl sm:text-3xl text-yellow-400 block">75.0%</span>
              <span className="text-[11px] text-slate-400 mt-1 block font-medium">Score Mínimo Licenciável</span>
            </div>
            <div className="p-4 rounded-xl bg-[#161B26]/50 border border-[#262F40]/60 text-center">
              <span className="font-heading font-black text-2xl sm:text-3xl text-white block">1.840+</span>
              <span className="text-[11px] text-slate-400 mt-1 block font-medium">Engenheiros Ativos Validados</span>
            </div>
          </div>

          {/* 3. BENTO SHOWCASE (Waveform + Radar de Habilidades) */}
          <div className="w-full max-w-4xl mt-8 bg-[#161B26] rounded-2xl border border-[#262F40] p-5 sm:p-6 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
            {/* Box 1: Waveform Audio Capture */}
            <div className="md:col-span-7 flex flex-col justify-between gap-3 bg-[#0c0e12] p-4 sm:p-5 rounded-xl border border-[#262F40]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-wider font-semibold">
                  Amostra de Entrevista Técnica Multimodal • 01 [FAST-041]
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> IA Validada
                </span>
              </div>

              {/* 28 Animated Waveform Bars */}
              <div className="h-14 flex items-center justify-center gap-1 sm:gap-1.5 px-2 bg-[#12161E]/60 rounded-lg border border-[#262F40]/40 my-1">
                {[45, 60, 25, 80, 95, 30, 70, 85, 40, 100, 65, 30, 90, 75, 50, 85, 60, 40, 95, 70, 35, 80, 55, 40, 65, 90, 50, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full transition-all duration-300"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i % 3 === 0 ? '#4edea3' : '#FACC15',
                      opacity: 0.85
                    }}
                  />
                ))}
              </div>

              <p className="text-[11px] text-slate-300 italic font-sans leading-relaxed border-t border-[#262F40] pt-2.5">
                "Optamos pela adoção de arquitetura orientada a eventos via Kafka para mitigar dead-locks de concorrência no gateway de liquidação. O particionamento por hash de chave assegurou idempotência com zero perdas..."
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                <span>Latência Whisper: 18ms</span>
                <span>Event-Driven: 9.8</span>
                <span className="text-yellow-400 font-bold">Idempotência: 10.0</span>
              </div>
            </div>

            {/* Box 2: Radar Metrics */}
            <div className="md:col-span-5 flex flex-col justify-between gap-3 bg-[#0c0e12] p-4 sm:p-5 rounded-xl border border-[#262F40]">
              <div className="flex items-center justify-between border-b border-[#262F40] pb-2">
                <span className="font-heading text-xs font-bold text-white">Dimensões Auditadas</span>
                <span className="font-mono text-[10px] text-yellow-400 font-bold">92.4 / 100</span>
              </div>

              <div className="space-y-3 font-sans">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Resiliência de Arquitetura</span>
                    <strong className="text-emerald-400 font-mono">95%</strong>
                  </div>
                  <div className="h-1.5 bg-[#262F40] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[95%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Padrão de Concorrência & Latência</span>
                    <strong className="text-yellow-400 font-mono">92%</strong>
                  </div>
                  <div className="h-1.5 bg-[#262F40] rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Clareza de Comunicação Técnica</span>
                    <strong className="text-emerald-400 font-mono">88%</strong>
                  </div>
                  <div className="h-1.5 bg-[#262F40] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Práticas de Segurança & OWASP</span>
                    <strong className="text-yellow-400 font-mono">90%</strong>
                  </div>
                  <div className="h-1.5 bg-[#262F40] rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full w-[90%]" />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-[#262F40] flex items-center justify-between">
                <span>Status da Análise:</span>
                <span className="text-emerald-400 font-bold">QUALIFICADO ≥ 75%</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. OS TRÊS PILARES DA ENGENHARIA REVERSA */}
      <section id="solucoes" className="py-16 max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-widest font-semibold block">
            ARQUITETURA DE AVALIAÇÃO
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Os Três Pilares da Engenharia Reversa de Contratação
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A dinâmica tradicional invertida: Desenvolvedores avaliados uma única vez por evidências de código e engenharia, e empresas abordando ativamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilar 1 */}
          <div className="bg-[#161B26] p-6 rounded-xl border border-[#262F40] hover:border-yellow-400/50 shadow-md space-y-4 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-wider block font-semibold">
                PILAR 01 • ANÁLISE MULTIMODAL
              </span>
              <h3 className="font-heading font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">
                Validação por I.A. & Áudio
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Avaliação contextual de respostas e decisões de código em tempo real. Nada de desafios 'leet-code' anódinos que não refletem incidentes de produção do mundo real.
              </p>
            </div>
            <div className="pt-3 border-t border-[#262F40] flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auditoria de Pensamento & Trade-offs</span>
            </div>
          </div>

          {/* Pilar 2 */}
          <div className="bg-[#161B26] p-6 rounded-xl border border-[#262F40] hover:border-yellow-400/50 shadow-md space-y-4 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-wider block font-semibold">
                PILAR 02 • FLUXO INVERTIDO
              </span>
              <h3 className="font-heading font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">
                Recrutamento Invertido
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Desenvolvedores aprovados não precisam enviar currículos para buracos negros. As empresas visualizam os benchmarks e abordam os talentos com base em afinidade pré-comprovada.
              </p>
            </div>
            <div className="pt-3 border-t border-[#262F40] flex items-center gap-1.5 text-[11px] text-yellow-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Salário e Stack Abertos no Convite</span>
            </div>
          </div>

          {/* Pilar 3 */}
          <div className="bg-[#161B26] p-6 rounded-xl border border-[#262F40] hover:border-yellow-400/50 shadow-md space-y-4 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-wider block font-semibold">
                PILAR 03 • FILTRO DE EXCELÊNCIA
              </span>
              <h3 className="font-heading font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">
                Corte Rigoroso de 75%
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Zero spam e candidaturas desqualificadas. Apenas engenheiros que atingem o score mínimo ingressam no pool ativo, garantindo relevância máxima para os líderes técnicos contratantes.
              </p>
            </div>
            <div className="pt-3 border-t border-[#262F40] flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apenas Top 25% com Fit Real</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLANOS TRANSPARENTES E PRÉ-PAGOS PARA EMPRESAS (RN03/RN04) */}
      <section id="planos" className="py-16 bg-[#0c0e12] border-y border-[#262F40]/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-widest font-semibold block">
              MODELO ANTECIPADO TRANSPARENTE • ZERO TAXA OCULTA
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Planos Transparentes e Pré-pagos para Empresas
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Contrate slots de vagas ativas com suporte a múltiplos perfis técnicos sem mensalidade abusiva. Pague pelo slot em aberto, substitua ou pause conforme sua demanda de engenharia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Plano 1 Slot */}
            <div className="p-6 rounded-2xl bg-[#161B26] border border-[#262F40] flex flex-col justify-between gap-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-white">Plano 1 Slot</h3>
                  <span className="font-mono text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300">PILOTO</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-heading font-black text-white">R$ 450</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Consumo de R$ 450 por slot ativo</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 font-sans border-t border-[#262F40] pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>1 vaga simultânea</strong> aberta</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Triagem autorizada via IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Acesso a critérios de corte e código</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cancelamento configurável no SLA</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openSignupModal('empresa')}
                className="w-full py-2.5 rounded-lg bg-transparent hover:bg-white/5 border border-[#262F40] hover:border-yellow-400/40 text-xs font-bold text-white transition-all text-center"
              >
                Ativar 1 Slot
              </button>
            </div>

            {/* Plano 3 Slots - DESTAQUE */}
            <div className="p-6 rounded-2xl bg-[#161B26] border-2 border-yellow-400 flex flex-col justify-between gap-6 shadow-[0_0_30px_rgba(250,204,21,0.15)] relative transform md:-translate-y-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-yellow-400 text-black font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
                MAIS ESCOLHIDO • ECONOMIA DE R$ 150
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-yellow-400">Plano 3 Slots</h3>
                  <span className="font-mono text-[10px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded font-bold">R$ 400 / SLOT</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-heading font-black text-yellow-400">R$ 1.200</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Economia de R$ 150 comparado ao avulso</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 font-sans border-t border-[#262F40] pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>3 vagas simultâneas</strong> ativas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Reposições de cancelamento em até 48h</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exportação de relatórios e logs auditáveis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Disponibilidade imediata de candidatos verificados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Canal direto com suporte no SLA de 4 horas</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openSignupModal('empresa')}
                className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all text-center"
              >
                Contratar 3 Slots
              </button>
            </div>

            {/* Plano 5 Slots */}
            <div className="p-6 rounded-2xl bg-[#161B26] border border-[#262F40] flex flex-col justify-between gap-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-white">Plano 5 Slots</h3>
                  <span className="font-mono text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300">ESCALA</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-heading font-black text-white">R$ 2.200</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Economia de R$ 250 comparado ao avulso</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 font-sans border-t border-[#262F40] pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>5 vagas simultâneas</strong> com rotação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Suporte prioritário VIP com Tech Lead dedicado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Validação de integração ATS (Greenhouse, Lever)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Passe multi-track de novos fechamentos e CTOs</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openSignupModal('empresa')}
                className="w-full py-2.5 rounded-lg bg-transparent hover:bg-white/5 border border-[#262F40] hover:border-yellow-400/40 text-xs font-bold text-white transition-all text-center"
              >
                Ativar 5 Slots Scaled
              </button>
            </div>
          </div>

          {/* Banner de Garantia & Não Renovação Forçada */}
          <div className="p-3.5 rounded-xl bg-[#161B26]/80 border border-[#262F40] flex items-center gap-3 text-xs text-slate-300 max-w-4xl mx-auto">
            <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>
              <strong>Sem multas de rescisão:</strong> Cada slot permanece ativo até a finalização da contratação ou cancelamento voluntário do usuário sem renovação automática forçada.
            </span>
          </div>

        </div>
      </section>

      {/* 6. TRANSPARÊNCIA ALGORÍTMICA E LGPD (ART. 20) */}
      <section className="py-16 max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="bg-[#161B26] rounded-2xl border border-[#262F40] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-wider block font-bold">
              GOVERNANÇA & ÉTICA EM IA
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Transparência Algorítmica e Conformidade Estrita com a LGPD
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Em conformidade com o <strong>Artigo 20 da LGPD (Lei nº 13.709/2018)</strong>, cada desenvolvedor e empresa possui direito a auditoria completa dos critérios adotados pela inteligência artificial. Sem decisões do tipo "caixa preta".
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#262F40] space-y-1.5">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Direito à Explicação</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Acesso aos relatórios preditivos com breakdown de pesos atribuídos em cada resposta e análise em código.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#262F40] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Isenção de Vieses Pessoais</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Filtro puramente técnico e estatístico, sem análise de dados sensíveis como gênero, idade, raça ou posicionamento.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#262F40] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Art. 20 LGPD Compliant</span>
                <span className="text-[11px] text-slate-400">Modelo e explicabilidade técnica auditável</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#262F40] flex items-center gap-3">
              <Lock className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Criptografia AES-256</span>
                <span className="text-[11px] text-slate-400">Proteção de áudio e dados técnicos confidenciais</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#262F40] flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">ISO/IEC 27001 Certified</span>
                <span className="text-[11px] text-slate-400">Infraestrutura em servidores com auditoria regular</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="py-14 bg-gradient-to-b from-[#0c0e12] via-[#161B26] to-[#0c0e12] border-t border-[#262F40]/80">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Pronto para mudar a dinâmica do recrutamento de engenharia?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Seja avaliado com base no seu real domínio técnico ou encontre engenheiros testados sem intermediários.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => openSignupModal('profissional')}
              className="px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all"
            >
              Iniciar Avaliação Técnica Gratuita
            </button>
            <button
              type="button"
              onClick={() => openSignupModal('empresa')}
              className="px-5 py-3 rounded-lg bg-[#161B26] hover:bg-[#1e2433] border border-[#262F40] text-slate-200 text-xs font-bold transition-all"
            >
              Falar com Especialista B2B
            </button>
          </div>
        </div>
      </section>

      {/* 8. GLOBAL FOOTER */}
      <footer className="bg-[#0A0C10] border-t border-[#262F40] py-6 text-xs text-slate-400">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-yellow-400 text-black font-heading font-bold text-[10px] flex items-center justify-center">
              Q
            </div>
            <span className="font-bold text-white">Q.I. Match v3.4.2-enterprise</span>
            <span className="text-[#9a9078] hidden md:inline">• Conformidade LGPD & ISO 27001</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#9a9078]">
            <span>© 2025 Q.I. Match Engine. Inverse Technical Talent Protocol.</span>
            <button
              type="button"
              onClick={() => openDemoModal('admin-qitech')}
              className="hover:text-yellow-400 text-slate-400 font-semibold transition-colors"
            >
              Acesso Demo Admin
            </button>
          </div>
        </div>
      </footer>


      {/* ===================================================================== */}
      {/* 1. MODAL DE LOGIN ("ENTRAR")                                           */}
      {/* ===================================================================== */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12161E] rounded-base border border-[#262F40] max-w-md w-full p-6 shadow-2xl space-y-5 text-white">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-base bg-primary flex items-center justify-center font-heading font-bold text-white text-sm">
                  Q
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground">Entrar na Q.I. Match</h3>
                  <span className="text-[11px] text-muted-foreground block">
                    Acesso seguro de Profissional, Empresa ou Governança
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selo Visual de Autenticidade e Proteção Anti-Phishing */}
            <div className="p-2.5 rounded-xl bg-[#0D111A] border border-[#232D3F] flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <AnimatedIcon type="shield" size={14} animation="pulse" />
                <span>Ambiente Oficial Autêntico • Q.I. Match</span>
              </span>
              <span className="text-slate-500 font-mono text-[10px]">Criptografia E2E / LGPD</span>
            </div>

            {/* Alerta de Iframe Malicioso / Clickjacking se detectado */}
            {isIframeDetected && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso Anti-Spoofing:</strong> Esta página foi detectada dentro de uma moldura externa. Abra em aba separada para evitar roubo de dados.
                </span>
              </div>
            )}

            {/* Alerta de Trava Progressiva contra Força Bruta */}
            {lockoutSeconds > 0 && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-red-400 block font-semibold">Trava de Segurança Ativa (Anti-Brute Force)</strong>
                  <p className="leading-relaxed">
                    Acesso bloqueado por segurança devido a erros sucessivos de senha. Aguarde <span className="font-mono font-bold text-white px-1.5 py-0.5 rounded bg-red-900/60 border border-red-500/30">{lockoutSeconds}s</span> para tentar novamente.
                  </p>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    * A trava persiste via cookie seguro mesmo ao recarregar a página (F5).
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="email"
                    disabled={lockoutSeconds > 0}
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="seu.email@dominio.com.br"
                    className="w-full h-9 pl-9 pr-3 text-xs bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Senha</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={lockoutSeconds > 0}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="Digite sua senha"
                    className="w-full h-9 pl-9 pr-9 text-xs bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-2.5 rounded-base bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={lockoutSeconds > 0}
                className="w-full h-10 font-bold text-xs rounded-base flex items-center justify-center gap-2 text-black bg-yellow-400 hover:bg-yellow-300 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {lockoutSeconds > 0 ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Aguarde {lockoutSeconds}s para desbloquear</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Entrar na Plataforma</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                Proteção Anti-Phishing: Certifique-se de que a barra de endereços do navegador exibe a URL oficial da Q.I. Match antes de autenticar.
              </p>
            </form>

            {/* Divisor Social OAuth */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#262F40]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#12161E] px-2 text-slate-400 font-semibold">
                  Ou acesse com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="flex items-center justify-center gap-2 h-9 px-3 rounded-base bg-white/5 hover:bg-white/10 border border-[#262F40] text-xs font-semibold text-white transition-all shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={handleGithubAuth}
                className="flex items-center justify-center gap-2 h-9 px-3 rounded-base bg-white/5 hover:bg-white/10 border border-[#262F40] text-xs font-semibold text-white transition-all shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </button>
            </div>


            <div className="pt-3 border-t border-border flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Ainda não possui cadastro?</span>
                <button
                  type="button"
                  onClick={() => openSignupModal('profissional')}
                  className="font-bold text-primary hover:underline"
                >
                  Criar conta gratuita
                </button>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Deseja testar com dados populados?</span>
                <button
                  type="button"
                  onClick={() => openDemoModal('candidato-lucas')}
                  className="font-bold text-brandOrange hover:underline flex items-center gap-1"
                >
                  <PlayCircle className="w-3.5 h-3.5" /> Acesso de demonstração
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. MODAL DE CADASTRO ("CRIAR CONTA")                                   */}
      {/* ===================================================================== */}
      {activeModal === 'signup' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12161E] rounded-base border border-[#262F40] max-w-lg w-full p-6 shadow-2xl space-y-5 text-white max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-base bg-brandOrange flex items-center justify-center font-heading font-bold text-white text-sm">
                  Q
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground">Criar Conta na Q.I. Match</h3>
                  <span className="text-[11px] text-muted-foreground block">
                    Selecione seu perfil para iniciar
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Seletor de Perfil no Cadastro */}
            <div className="grid grid-cols-3 gap-1.5 bg-background p-1 rounded-base border border-border">
              <button
                type="button"
                onClick={() => {
                  setSignupRole('profissional');
                  setSignupError('');
                }}
                className={`py-2 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  signupRole === 'profissional' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Profissional
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignupRole('empresa');
                  setSignupError('');
                }}
                className={`py-2 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  signupRole === 'empresa' ? 'bg-brandOrange text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Empresa
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignupRole('admin');
                  setSignupError('');
                }}
                className={`py-2 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  signupRole === 'admin' ? 'bg-gray-900 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </button>
            </div>

            {signupRole === 'admin' ? (
              <div className="p-4 rounded-base bg-secondary/50 border border-border space-y-3 text-xs">
                <div className="flex items-center gap-2 text-foreground font-heading font-bold">
                  <Lock className="w-4 h-4 text-primary" /> Cadastro Restrito — Governança Q.I. Match
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Contas de <strong>Admin</strong> são exclusivas para a operação de governança e não permitem auto-cadastro público. Para inspecionar o painel administrativo no MVP, utilize a conta seedada de demonstração.
                </p>
                <button
                  type="button"
                  onClick={() => openDemoModal('admin-qitech')}
                  className="w-full h-9 rounded-base bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <PlayCircle className="w-4 h-4" /> Ir para Acesso de Demonstração (Admin)
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
                {signupRole === 'profissional' ? (
                  <>
                    <div>
                      <label className="block font-semibold text-foreground mb-1">Nome Completo *</label>
                      <input
                        type="text"
                        value={profName}
                        onChange={(e) => {
                          setProfName(e.target.value);
                          setSignupError('');
                        }}
                        placeholder="Ex: Ana Beatriz Souza"
                        className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-1">E-mail *</label>
                      <input
                        type="email"
                        value={profEmail}
                        onChange={(e) => {
                          setProfEmail(e.target.value);
                          setSignupError('');
                        }}
                        placeholder="ana.souza@email.com"
                        className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Área / Vertical Técnica *</label>
                        <select
                          value={profArea}
                          onChange={(e) => setProfArea(e.target.value)}
                          className="w-full h-9 px-2.5 bg-background border border-border rounded-base text-foreground font-medium"
                        >
                          {TECHNICAL_AREAS.map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1">Senioridade *</label>
                        <select
                          value={profSeniority}
                          onChange={(e) => setProfSeniority(e.target.value as Seniority)}
                          className="w-full h-9 px-2.5 bg-background border border-border rounded-base text-foreground font-medium"
                        >
                          <option value="Júnior">Júnior</option>
                          <option value="Pleno">Pleno</option>
                          <option value="Sênior">Sênior</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-foreground mb-1">Senha Forte *</label>
                          <input
                            type="password"
                            value={profPassword}
                            onChange={(e) => {
                              setProfPassword(e.target.value);
                              setSignupError('');
                            }}
                            placeholder="Mínimo 8 caracteres"
                            className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-foreground mb-1">Confirmação de Senha *</label>
                          <input
                            type="password"
                            value={profConfirmPassword}
                            onChange={(e) => {
                              setProfConfirmPassword(e.target.value);
                              setSignupError('');
                            }}
                            placeholder="Repita sua senha"
                            className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      {/* Medidor de Força em Tempo Real */}
                      <PasswordStrengthMeter password={profPassword} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block font-semibold text-foreground mb-1">Nome da Empresa *</label>
                      <input
                        type="text"
                        value={compName}
                        onChange={(e) => {
                          setCompName(e.target.value);
                          setSignupError('');
                        }}
                        placeholder="Ex: NovaCloud Tecnologia S.A."
                        className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">CNPJ *</label>
                        <input
                          type="text"
                          value={compCnpj}
                          onChange={(e) => {
                            setCompCnpj(e.target.value);
                            setSignupError('');
                          }}
                          placeholder="00.000.000/0001-00"
                          className="w-full h-9 px-3 bg-background border border-border rounded-base font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1">E-mail Corporativo *</label>
                        <input
                          type="email"
                          value={compEmail}
                          onChange={(e) => {
                            setCompEmail(e.target.value);
                            setSignupError('');
                          }}
                          placeholder="talentos@empresa.com.br"
                          className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-foreground mb-1">Senha Forte *</label>
                          <input
                            type="password"
                            value={compPassword}
                            onChange={(e) => {
                              setCompPassword(e.target.value);
                              setSignupError('');
                            }}
                            placeholder="Mínimo 8 caracteres"
                            className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-foreground mb-1">Confirmação de Senha *</label>
                          <input
                            type="password"
                            value={compConfirmPassword}
                            onChange={(e) => {
                              setCompConfirmPassword(e.target.value);
                              setSignupError('');
                            }}
                            placeholder="Repita sua senha"
                            className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      {/* Medidor de Força em Tempo Real para Empresa */}
                      <PasswordStrengthMeter password={compPassword} />
                    </div>
                  </>
                )}

                {signupError && (
                  <div className="p-2.5 rounded-base bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-10 font-bold text-xs rounded-base flex items-center justify-center gap-2 text-black bg-yellow-400 hover:bg-yellow-300 shadow-md transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  {signupRole === 'empresa'
                    ? 'Criar Conta Corporativa e Acessar Painel'
                    : 'Criar Conta Profissional e Configurar Perfil'}
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Já possui uma conta?</span>
              <button
                type="button"
                onClick={openLoginModal}
                className="font-bold text-primary hover:underline"
              >
                Entrar agora
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. MODAL DE ACESSO DE DEMONSTRAÇÃO (CONTAS SEEDADAS)                   */}
      {/* ===================================================================== */}
      {activeModal === 'demo' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12161E] rounded-base border border-[#262F40] max-w-lg w-full p-6 shadow-2xl space-y-5 text-white max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-base bg-secondary text-primary flex items-center justify-center font-heading font-bold text-sm">
                  <PlayCircle className="w-5 h-5 text-brandOrange" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground">Acesso de Demonstração</h3>
                  <span className="text-[11px] text-muted-foreground block">
                    Selecione uma persona pré-configurada para explorar os fluxos do MVP
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {demoAccounts.map((acc) => {
                const isSelected = selectedDemoPersona === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedDemoPersona(acc.id)}
                    className={`p-3.5 rounded-base border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-yellow-400 bg-yellow-400/10 shadow-sm'
                        : 'border-[#262F40] bg-[#161B26] hover:border-yellow-400/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-xs font-bold text-foreground">{acc.name}</strong>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          acc.badge === 'Empresa'
                            ? 'bg-brandOrange/15 text-brandOrange'
                            : acc.badge === 'Admin'
                            ? 'bg-gray-900 text-white'
                            : 'bg-secondary text-primary'
                        }`}>
                          {acc.badge}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          • {acc.roleLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {acc.description}
                      </p>
                      <span className="text-[10px] text-primary font-mono block">
                        Conta seedada: {acc.email}
                      </span>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-yellow-400 bg-yellow-400 text-black' : 'border-muted-foreground'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleEnterDemo}
              className="w-full h-10 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-base flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <LogIn className="w-4 h-4" /> Entrar com Persona Selecionada
            </button>

          </div>
        </div>
      )}

      {/* Banner & Modal de Consentimento de Cookies e Termos de Privacidade LGPD */}
      <CookieConsentModal />

    </div>
  );
};