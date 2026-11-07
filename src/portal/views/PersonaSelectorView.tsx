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
  PlayCircle
} from 'lucide-react';

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
      name: 'Governança Q.I. Tech',
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
    setLoginError('');
    const res = loginWithCredentials(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Falha ao autenticar.');
      return;
    }
    setActiveModal(null);
    setAuthNotice('');
    onEnterApp();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (signupRole === 'admin') {
      setSignupError('O perfil Admin não permite auto-cadastro. Utilize o Acesso de Demonstração para entrar como Governança Q.I. Tech.');
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
    <div className="min-h-screen bg-background flex flex-col justify-between">
      
      {/* BARRA DE NAVEGAÇÃO COMERCIAL */}
      <header className="sticky top-0 z-40 bg-brandNavy text-white border-b border-white/10">
        <div className="max-w-[1320px] mx-auto h-16 px-4 sm:px-8 flex items-center justify-between gap-3">
          
          {/* Logo Comercial */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-base bg-yellow-400 flex items-center justify-center font-heading font-bold text-black text-lg shadow-xs">
              Q
            </div>
            <div>
              <span className="font-heading font-bold text-white text-lg tracking-tight block leading-none">
                Q.I. Tech
              </span>
              <span className="text-[10px] text-brandNavySub block mt-0.5">
                Talent & Community Cloud
              </span>
            </div>
          </div>

          {/* Links de Navegação do Site */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-brandNavySub">
            <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
            <a href="#vagas" className="hover:text-white transition-colors">Vagas Abertas</a>
            <a href="#para-empresas" className="hover:text-white transition-colors">Para Empresas</a>
          </nav>

          {/* AÇÕES DE AUTENTICAÇÃO: ACESSO DE DEMONSTRAÇÃO | ENTRAR | CRIAR CONTA */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-base bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition-all"
              title={theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
              aria-label="Alternar tema claro/escuro"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-brandOrange" />
              ) : (
                <Moon className="w-4 h-4 text-brandNavySub" />
              )}
            </button>

            <button
              type="button"
              onClick={() => openDemoModal('candidato-lucas')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-base bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-semibold text-brandNavySub hover:text-white transition-all"
              title="Acessar contas seedadas de demonstração"
            >
              <PlayCircle className="w-3.5 h-3.5 text-brandOrange" />
              <span>Acesso de demonstração</span>
            </button>

            <button
              type="button"
              onClick={openLoginModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-base bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-[#4AD6E8]" />
              <span>Entrar</span>
            </button>

            <button
              type="button"
              onClick={() => openSignupModal('profissional')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-base bg-yellow-400 hover:bg-yellow-300 text-xs font-bold text-black shadow-xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar conta</span>
            </button>
          </div>

        </div>
      </header>

      {/* AVISO DE ROTA PROTEGIDA SE REDIRECIONADO */}
      {authNotice && (
        <div className="bg-brandOrange/15 border-b border-brandOrange/30 px-4 py-2.5 text-center text-xs font-semibold text-foreground flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-brandOrange shrink-0" />
          <span>{authNotice}</span>
          <button
            type="button"
            onClick={openLoginModal}
            className="underline font-bold text-primary ml-1"
          >
            Fazer login agora
          </button>
        </div>
      )}

      {/* HERO COMERCIAL */}
      <section className="bg-brandNavy text-white py-14 sm:py-20 border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-yellow-400 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" /> Plataforma de Recrutamento Invertido & Comunidade Tech
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight text-white">
              Contratação técnica em dias, não meses — com <span className="text-yellow-400">1º Match Grátis</span> e Privacidade Total.
            </h1>

            <p className="text-sm sm:text-base text-brandNavySub max-w-2xl leading-relaxed">
              Conectamos empresas a talentos de tecnologia pré-validados por IA com proteção de dados via Double Opt-In e indicações recompensadas na comunidade.
            </p>

            {/* Ações Principais + Acesso de Demonstração Separado Visualmente */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openSignupModal('profissional')}
                  className="px-5 py-3 rounded-base bg-yellow-400 hover:bg-yellow-300 text-black text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <UserPlus className="w-4 h-4" /> Criar conta <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={openLoginModal}
                  className="px-5 py-3 rounded-base bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <LogIn className="w-4 h-4 text-[#4AD6E8]" /> Entrar na minha conta
                </button>
              </div>

              <div className="pt-1 flex items-center gap-2 text-xs text-brandNavySub">
                <span>Avaliando o MVP?</span>
                <button
                  type="button"
                  onClick={() => openDemoModal('candidato-lucas')}
                  className="inline-flex items-center gap-1.5 font-bold text-[#4AD6E8] hover:underline"
                >
                  <PlayCircle className="w-3.5 h-3.5" /> Acesso de demonstração (Contas Seedadas)
                </button>
              </div>
            </div>
          </div>

          {/* Métricas de Impacto Comercial */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="p-5 rounded-base bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-yellow-400 block">R$ 0</span>
              <span className="text-xs font-bold text-white mt-1 block">no 1º Candidato Aceito</span>
              <span className="text-[11px] text-brandNavySub">Cortesia imediata no Match Express</span>
            </div>

            <div className="p-5 rounded-base bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-[#4AD6E8] block">100%</span>
              <span className="text-xs font-bold text-white mt-1 block">Double Opt-In LGPD</span>
              <span className="text-[11px] text-brandNavySub">Dados liberados só após aceite</span>
            </div>

            <div className="p-5 rounded-base bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-emerald-400 block">
                +{commercialConfig.referralBonusEstalecas} 🪙
              </span>
              <span className="text-xs font-bold text-white mt-1 block">Estalecas Q.I.</span>
              <span className="text-[11px] text-brandNavySub">Por indicação aprovada na vaga</span>
            </div>

            <div className="p-5 rounded-base bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-white block">NFS-e</span>
              <span className="text-xs font-bold text-white mt-1 block">Faturamento Automático</span>
              <span className="text-[11px] text-brandNavySub">Desbloqueio avulso ou pacotes B2B</span>
            </div>
          </div>

        </div>
      </section>

      {/* OS 3 PILARES DO ECOSSISTEMA */}
      <section id="solucoes" className="py-14 max-w-[1320px] mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
            Como funciona o ecossistema Q.I. Tech
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Três motores integrados para acelerar contratações e recompensar a comunidade técnica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilar 1 */}
          <div className="bg-[#12161E] p-6 rounded-base border border-[#262F40] hover:border-yellow-400/50 shadow-md space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-base bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-white group-hover:text-yellow-400 transition-colors">
                1. Motor Comercial B2B & Match Express
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Empresas publicam vagas com transparência salarial e recebem o <strong className="text-yellow-400 font-semibold">1º candidato com Double Opt-In gratuitamente</strong>. Perfis adicionais são desbloqueados sob demanda (R$ {commercialConfig.singleUnlockPriceBrl} ou pacotes de créditos com emissão automática de NFS-e).
              </p>
            </div>
            <button
              type="button"
              onClick={() => openSignupModal('empresa')}
              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 hover:underline flex items-center gap-1.5 pt-2"
            >
              Criar Conta Corporativa <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pilar 2 */}
          <div className="bg-[#12161E] p-6 rounded-base border border-[#262F40] hover:border-yellow-400/50 shadow-md space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-base bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-white group-hover:text-yellow-400 transition-colors">
                2. "Quem Indica" Gamificado (Estalecas Q.I.)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Profissionais que indicam colegas por link rastreável ganham <strong className="text-yellow-400 font-semibold">+{commercialConfig.referralBonusEstalecas} Estalecas Q.I.</strong> na aprovação, resgatáveis por vouchers de certificação AWS, cursos e eventos (sem alterar o score técnico).
              </p>
            </div>
            <button
              type="button"
              onClick={() => openSignupModal('profissional')}
              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 hover:underline flex items-center gap-1.5 pt-2"
            >
              Cadastrar Perfil Profissional <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pilar 3 */}
          <div className="bg-[#12161E] p-6 rounded-base border border-[#262F40] hover:border-yellow-400/50 shadow-md space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-base bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-white group-hover:text-yellow-400 transition-colors">
                3. Comunidade por Grau de Afinidade & IA Explicável
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conexões recomendadas pelo <strong className="text-yellow-400 font-semibold">grau de sobreposição de habilidades</strong> (1º, 2º e 3º grau) para destravar dúvidas técnicas, com entrevista opcional por IA auditável conforme o Art. 20 da LGPD.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openDemoModal('comunidade-rafael')}
              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 hover:underline flex items-center gap-1.5 pt-2"
            >
              Explorar Comunidade Técnica <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* VITRINE DE VAGAS COM TRANSPARÊNCIA SALARIAL */}
      <section id="vagas" className="py-12 bg-[#0D1017] border-y border-[#262F40]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
                Oportunidades em Destaque com Faixa Salarial Transparente
              </h2>
              <p className="text-xs text-slate-400">
                Todas as empresas parceiras divulgam remuneração aberta antes do seu aceite.
              </p>
            </div>
            <button
              type="button"
              onClick={openLoginModal}
              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 hover:underline flex items-center gap-1"
            >
              Entrar como candidato <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.slice(0, 4).map((vac) => {
              const comp = companies.find(c => c.id === vac.companyId);
              return (
                <div key={vac.id} className="p-5 rounded-base bg-[#141824] border border-[#262F40] hover:border-yellow-400/40 flex flex-col justify-between gap-4 transition-all shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-0.5 rounded">
                        {vac.area} • {vac.seniority}
                      </span>
                      {vac.isUrgentMatchExpress && (
                        <span className="text-[10px] bg-yellow-400 text-black font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Match Express
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-sm text-white">{vac.title}</h3>
                    <p className="text-xs text-slate-400">
                      {comp?.name} • {vac.modality} ({vac.location})
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {vac.mandatorySkills.map((sk, idx) => (
                        <span key={idx} className="text-[10px] bg-[#1E2536] border border-[#2D374D] px-2 py-0.5 rounded text-slate-200 font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#262F40]">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Faixa Salarial Mensal</span>
                      <strong className="text-xs sm:text-sm font-bold text-white">
                        R$ {vac.salaryMin.toLocaleString('pt-BR')} — R$ {vac.salaryMax.toLocaleString('pt-BR')}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={openLoginModal}
                      className="px-3.5 py-1.5 rounded-base bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold transition-all shadow-xs"
                    >
                      Ver Compatibilidade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLANOS COMERCIAIS PARA EMPRESAS */}
      <section id="para-empresas" className="py-12 max-w-[1320px] mx-auto px-4 sm:px-8">
        <div className="bg-[#12161E] border border-[#262F40] text-white rounded-base p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
              Recrutamento B2B sem mensalidade fixa obrigatória
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Publique sua vaga com Match Express, receba o 1º candidato confirmado gratuitamente e desbloqueie novos perfis apenas quando quiser (R$ {commercialConfig.singleUnlockPriceBrl} avulso ou pacote de 5 créditos por R$ {commercialConfig.package5PriceBrl}).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openSignupModal('empresa')}
              className="px-5 py-3 rounded-base bg-yellow-400 hover:bg-yellow-300 text-black text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <Building2 className="w-4 h-4" /> Criar Conta Empresa
            </button>
            <button
              type="button"
              onClick={() => openDemoModal('empresa-orion')}
              className="px-4 py-3 rounded-base bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <PlayCircle className="w-4 h-4 text-yellow-400" /> Ver Demo Empresa
            </button>
          </div>
        </div>
      </section>

      {/* RODAPÉ COMERCIAL */}
      <footer className="bg-[#0A0C10] border-t border-[#262F40] py-6 text-xs text-slate-400">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-400 text-black font-heading font-bold text-xs flex items-center justify-center">
              Q
            </div>
            <span className="font-bold text-white">Q.I. Tech</span>
            <span>© 2026 Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-slate-300 cursor-pointer">Privacidade & LGPD</span>
            <span className="hover:text-slate-300 cursor-pointer">Termos Corporativos</span>
            <button
              type="button"
              onClick={() => openDemoModal('admin-qitech')}
              className="hover:text-yellow-400 text-slate-400 font-semibold transition-colors"
            >
              Acesso de Demonstração
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
                  <h3 className="font-heading font-bold text-sm text-foreground">Entrar na Q.I. Tech</h3>
                  <span className="text-[11px] text-muted-foreground block">
                    Acesse sua conta de Profissional, Empresa ou Governança
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

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="seu.email@dominio.com.br"
                    className="w-full h-9 pl-9 pr-3 text-xs bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Senha</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="Digite sua senha"
                    className="w-full h-9 pl-9 pr-3 text-xs bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
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
                className="w-full h-10 font-bold text-xs rounded-base flex items-center justify-center gap-2 text-black bg-yellow-400 hover:bg-yellow-300 shadow-md transition-all"
              >
                <LogIn className="w-4 h-4" /> Entrar na Plataforma
              </button>
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
                  <h3 className="font-heading font-bold text-sm text-foreground">Criar Conta na Q.I. Tech</h3>
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
                  <Lock className="w-4 h-4 text-primary" /> Cadastro Restrito — Governança Q.I. Tech
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Senha (mín. 6 caracteres) *</label>
                        <input
                          type="password"
                          value={profPassword}
                          onChange={(e) => {
                            setProfPassword(e.target.value);
                            setSignupError('');
                          }}
                          placeholder="Mínimo 6 caracteres"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Senha (mín. 6 caracteres) *</label>
                        <input
                          type="password"
                          value={compPassword}
                          onChange={(e) => {
                            setCompPassword(e.target.value);
                            setSignupError('');
                          }}
                          placeholder="Mínimo 6 caracteres"
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

    </div>
  );
};