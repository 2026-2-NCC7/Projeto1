import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Building2,
  Bot,
  Hexagon,
  Contact,
  Store,
  Share2,
  Users,
  Search,
  ShieldCheck,
  RotateCcw,
  Database,
  Target,
  FileText,
  CreditCard,
  Briefcase,
  Layers,
  Award
} from 'lucide-react';
import { AnimatedIcon } from '../common/AnimatedIcon';

interface SidebarNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ currentTab, setCurrentTab }) => {
  const { activePersona, session, currentUser, companyCredits, vacancies } = useApp();

  const role = session?.role || currentUser?.role;
  const isCompany = role === 'empresa' || activePersona === 'empresa-orion';
  const isAdmin = role === 'admin' || activePersona === 'admin-qitech';
  const isCommunityExternal = activePersona === 'comunidade-rafael';
  const isCandidate = !isCompany && !isAdmin && !isCommunityExternal;

  // Destaque visual padrão Stitch (media_1794223226276_0bb18448.png)
  const getItemClass = (isActive: boolean) => `
    w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all
    ${
      isActive
        ? 'bg-[#282a2e] text-[#facc15] font-bold border border-[#37393e] shadow-lg'
        : 'text-[#d1c6ab] hover:text-white hover:bg-[#1a1c22] border border-transparent'
    }
  `;

  return (
    <aside className="w-full lg:w-[248px] shrink-0 space-y-4">
      <div className="bg-[#111318] p-3 rounded-2xl border border-[#262F40] shadow-xl space-y-2">
        
        {/* Identificação da Plataforma e Tipo de Usuário Ativo */}
        <div className="px-2.5 py-2.5 mb-2 border-b border-[#262F40]/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow font-black font-heading text-xs shadow-inner">
              Q.I.
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-white block leading-tight">
                Q.I. Tech
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-yellow block mt-0.5">
                {isCandidate && 'DESENVOLVEDOR'}
                {isCompany && 'EMPRESA B2B'}
                {isAdmin && 'GOVERNANÇA TCC'}
                {isCommunityExternal && 'COMUNIDADE'}
              </span>
            </div>
          </div>
        </div>

        {/* ==================== 1. MENU EXCLUSIVO DO CANDIDATO ==================== */}
        {isCandidate && (
          <div className="space-y-1">
            <div className="px-2 pt-1 pb-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Área do Desenvolvedor
            </div>

            {/* Dashboard Dev */}
            <button
              type="button"
              onClick={() => setCurrentTab('candidato-inicio')}
              className={getItemClass(currentTab === 'candidato-inicio')}
            >
              <span className="flex items-center gap-3">
                <Smartphone className={`w-5 h-5 shrink-0 ${currentTab === 'candidato-inicio' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Dashboard Dev</span>
              </span>
            </button>

            {/* Entrevista IA */}
            <button
              type="button"
              onClick={() => setCurrentTab('candidato-entrevista')}
              className={getItemClass(currentTab === 'candidato-entrevista')}
            >
              <span className="flex items-center gap-3">
                <Bot className={`w-5 h-5 shrink-0 ${currentTab === 'candidato-entrevista' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Entrevista IA</span>
              </span>
            </button>

            {/* Onboarding Dev */}
            <button
              type="button"
              onClick={() => setCurrentTab('candidato-perfil')}
              className={getItemClass(currentTab === 'candidato-perfil')}
            >
              <span className="flex items-center gap-3">
                <Contact className={`w-5 h-5 shrink-0 ${currentTab === 'candidato-perfil' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Onboarding Dev</span>
              </span>
            </button>

            {/* Oportunidades & Vagas */}
            <button
              type="button"
              onClick={() => setCurrentTab('candidato-vagas')}
              className={getItemClass(currentTab === 'candidato-vagas')}
            >
              <span className="flex items-center gap-3">
                <Briefcase className={`w-5 h-5 shrink-0 ${currentTab === 'candidato-vagas' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Oportunidades</span>
              </span>
            </button>

            {/* Processos Seletivos */}
            <button
              type="button"
              onClick={() => setCurrentTab('candidato-processos')}
              className={getItemClass(currentTab === 'candidato-processos')}
            >
              <span className="flex items-center gap-3">
                <FileText className={`w-5 h-5 shrink-0 ${currentTab === 'candidato-processos' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Meus Processos</span>
              </span>
            </button>

            {/* Tech Points & Indicações */}
            <button
              type="button"
              onClick={() => setCurrentTab('candidato-estalecas')}
              className={getItemClass(currentTab === 'candidato-estalecas')}
            >
              <span className="flex items-center gap-3">
                <Hexagon className={`w-5 h-5 shrink-0 ${currentTab === 'candidato-estalecas' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Tech Points</span>
              </span>
            </button>

            {/* Laudo de Competências */}
            <button
              type="button"
              onClick={() => setCurrentTab('candidato-relatorio')}
              className={getItemClass(currentTab === 'candidato-relatorio')}
            >
              <span className="flex items-center gap-3">
                <ShieldCheck className={`w-5 h-5 shrink-0 ${currentTab === 'candidato-relatorio' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Laudo da IA</span>
              </span>
            </button>
          </div>
        )}

        {/* ==================== 2. MENU EXCLUSIVO DA EMPRESA B2B ==================== */}
        {isCompany && (
          <div className="space-y-1">
            <div className="px-2 pt-1 pb-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Painel Corporativo B2B
            </div>

            {/* Painel de Vagas (Kanban) */}
            <button
              type="button"
              onClick={() => setCurrentTab('empresa-vagas')}
              className={getItemClass(currentTab === 'empresa-vagas')}
            >
              <span className="flex items-center gap-3">
                <Building2 className={`w-5 h-5 shrink-0 ${currentTab === 'empresa-vagas' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Painel de Vagas</span>
              </span>
              <span className="text-[10px] bg-brand-yellow/20 text-brand-yellow font-bold px-1.5 py-0.5 rounded border border-brand-yellow/30 font-mono">
                {companyCredits} slots
              </span>
            </button>

            {/* Análise de Matching IA */}
            <button
              type="button"
              onClick={() => setCurrentTab('empresa-matching-ia')}
              className={getItemClass(currentTab === 'empresa-matching-ia')}
            >
              <span className="flex items-center gap-3">
                <Target className={`w-5 h-5 shrink-0 ${currentTab === 'empresa-matching-ia' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Análise de Matching</span>
              </span>
            </button>

            {/* Comparador de Perfis */}
            <button
              type="button"
              onClick={() => setCurrentTab('empresa-comparacao')}
              className={getItemClass(currentTab === 'empresa-comparacao')}
            >
              <span className="flex items-center gap-3">
                <FileText className={`w-5 h-5 shrink-0 ${currentTab === 'empresa-comparacao' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Comparar Perfis</span>
              </span>
            </button>

            {/* Planos & Gestão de Slots (Opção 1) */}
            <button
              type="button"
              onClick={() => setCurrentTab('vitrine-planos')}
              className={getItemClass(currentTab === 'vitrine-planos')}
            >
              <span className="flex items-center gap-3">
                <CreditCard className={`w-5 h-5 shrink-0 ${currentTab === 'vitrine-planos' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Planos & Slots B2B</span>
              </span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                Gestão
              </span>
            </button>
          </div>
        )}

        {/* ==================== 3. MENU EXCLUSIVO DO ADMIN & TCC ==================== */}
        {isAdmin && (
          <div className="space-y-1">
            <div className="px-2 pt-1 pb-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Governança & TCC
            </div>

            {/* Visão Geral & Preços */}
            <button
              type="button"
              onClick={() => setCurrentTab('admin-dashboard')}
              className={getItemClass(currentTab === 'admin-dashboard')}
            >
              <span className="flex items-center gap-3">
                <ShieldCheck className={`w-5 h-5 shrink-0 ${currentTab === 'admin-dashboard' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Governança & Dados</span>
              </span>
            </button>

            {/* Gestão de Planos & Slots B2B */}
            <button
              type="button"
              onClick={() => setCurrentTab('vitrine-planos')}
              className={getItemClass(currentTab === 'vitrine-planos')}
            >
              <span className="flex items-center gap-3">
                <Store className={`w-5 h-5 shrink-0 ${currentTab === 'vitrine-planos' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Planos & Slots B2B</span>
              </span>
            </button>

            {/* Revisões Humanas (Art. 20 LGPD) */}
            <button
              type="button"
              onClick={() => setCurrentTab('admin-revisoes')}
              className={getItemClass(currentTab === 'admin-revisoes')}
            >
              <span className="flex items-center gap-3">
                <RotateCcw className={`w-5 h-5 shrink-0 ${currentTab === 'admin-revisoes' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Revisões (Art. 20)</span>
              </span>
            </button>

            {/* Laboratório TCC & SQLite */}
            <button
              type="button"
              onClick={() => setCurrentTab('admin-laboratorio')}
              className={getItemClass(currentTab === 'admin-laboratorio')}
            >
              <span className="flex items-center gap-3">
                <Database className={`w-5 h-5 shrink-0 ${currentTab === 'admin-laboratorio' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Laboratório TCC</span>
              </span>
            </button>

            {/* Monitor IA */}
            <button
              type="button"
              onClick={() => setCurrentTab('admin-monitor')}
              className={getItemClass(currentTab === 'admin-monitor')}
            >
              <span className="flex items-center gap-3">
                <Bot className={`w-5 h-5 shrink-0 ${currentTab === 'admin-monitor' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Pipeline & Logs IA</span>
              </span>
            </button>
          </div>
        )}

        {/* ==================== 4. MENU DA COMUNIDADE ==================== */}
        {isCommunityExternal && (
          <div className="space-y-1">
            <div className="px-2 pt-1 pb-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Comunidade Externa
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab('comunidade-feed')}
              className={getItemClass(currentTab === 'comunidade-feed')}
            >
              <span className="flex items-center gap-3">
                <Share2 className={`w-5 h-5 shrink-0 ${currentTab === 'comunidade-feed' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Feed de Artigos</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('comunidade-rede')}
              className={getItemClass(currentTab === 'comunidade-rede')}
            >
              <span className="flex items-center gap-3">
                <Users className={`w-5 h-5 shrink-0 ${currentTab === 'comunidade-rede' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Rede de Afinidade</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('comunidade-ajuda')}
              className={getItemClass(currentTab === 'comunidade-ajuda')}
            >
              <span className="flex items-center gap-3">
                <Search className={`w-5 h-5 shrink-0 ${currentTab === 'comunidade-ajuda' ? 'text-[#facc15]' : 'text-[#d1c6ab]'}`} />
                <span className="text-sm">Mentoria & Dúvidas</span>
              </span>
            </button>
          </div>
        )}

        {/* ==================== RODAPÉ DA SIDEBAR ==================== */}
        <div className="pt-3 border-t border-[#262F40]/60 px-2 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <AnimatedIcon type="activity" size={13} animation="pulse" className="text-emerald-400" />
            <span>Whisper + Qwen Online</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <AnimatedIcon type="shield" size={11} animation="pulse" className="text-amber-400" />
            <span>LGPD Art. 20 Audit Ready</span>
          </div>
        </div>

      </div>
    </aside>
  );
};
