import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Briefcase,
  Mic,
  User,
  Share2,
  Users,
  Search,
  ShieldCheck,
  Target,
  FileText,
  RotateCcw,
  CreditCard,
  Sliders,
  Database
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ currentTab, setCurrentTab }) => {
  const { activePersona, session, companyCredits } = useApp();

  const isCommunityExternal = activePersona === 'comunidade-rafael';
  const isCompany = session?.role === 'empresa' || activePersona === 'empresa-orion';
  const isAdmin = session?.role === 'admin' || activePersona === 'admin-qitech';
  const isCandidate =
    !isCompany &&
    !isAdmin &&
    !isCommunityExternal &&
    (session?.role === 'profissional' || activePersona === 'candidato-lucas' || activePersona === 'candidato-marina');

  const getItemClass = (tab: string) => `
    w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-medium transition-colors
    ${currentTab === tab 
      ? 'bg-secondary text-primary font-bold shadow-xs' 
      : 'text-muted-foreground hover:bg-background hover:text-foreground'
    }
  `;

  return (
    <aside className="w-full lg:w-[220px] shrink-0 space-y-4">
      <div className="bg-white p-3 rounded-base border border-border shadow-xs space-y-1">
        
        {/* ==================== 1. CANDIDATO (ATÉ 5 ÁREAS PRINCIPAIS) ==================== */}
        {isCandidate && (
          <>
            <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Menu Principal
            </div>

            <button onClick={() => setCurrentTab('candidato-inicio')} className={getItemClass('candidato-inicio')}>
              <span className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-primary" /> Início
              </span>
            </button>

            <button onClick={() => setCurrentTab('candidato-vagas')} className={getItemClass('candidato-vagas')}>
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-primary" /> Oportunidades
              </span>
            </button>

            <button onClick={() => setCurrentTab('candidato-entrevista')} className={getItemClass('candidato-entrevista')}>
              <span className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-brandOrange" /> Entrevistas por IA
              </span>
            </button>

            <button onClick={() => setCurrentTab('candidato-perfil')} className={getItemClass('candidato-perfil')}>
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-primary" /> Meu Perfil
              </span>
            </button>

            <button onClick={() => setCurrentTab('comunidade-feed')} className={getItemClass('comunidade-feed')}>
              <span className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-primary" /> Comunidade
              </span>
            </button>
          </>
        )}

        {/* ==================== 2. EMPRESA (FLUXO CORPORATIVO B2B) ==================== */}
        {isCompany && (
          <>
            <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Painel da Empresa
            </div>

            <button onClick={() => setCurrentTab('empresa-vagas')} className={getItemClass('empresa-vagas')}>
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-primary" /> Vagas & Painel
              </span>
              <span className="text-[10px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                {companyCredits} créd.
              </span>
            </button>

            <button onClick={() => setCurrentTab('empresa-shortlist')} className={getItemClass('empresa-shortlist')}>
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-brandOrange" /> Talentos & Shortlist
              </span>
            </button>

            <button onClick={() => setCurrentTab('empresa-matching-ia')} className={getItemClass('empresa-matching-ia')}>
              <span className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-primary" /> Análise de Matching
              </span>
            </button>

            <button onClick={() => setCurrentTab('empresa-comparacao')} className={getItemClass('empresa-comparacao')}>
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600" /> Comparar Perfis
              </span>
            </button>
          </>
        )}

        {/* ==================== 3. COMUNIDADE EXTERNA ==================== */}
        {isCommunityExternal && (
          <>
            <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Comunidade Técnica
            </div>

            <button onClick={() => setCurrentTab('comunidade-feed')} className={getItemClass('comunidade-feed')}>
              <span className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-primary" /> Feed de Artigos
              </span>
            </button>

            <button onClick={() => setCurrentTab('comunidade-rede')} className={getItemClass('comunidade-rede')}>
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-primary" /> Rede de Afinidade
              </span>
            </button>

            <button onClick={() => setCurrentTab('comunidade-ajuda')} className={getItemClass('comunidade-ajuda')}>
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-primary" /> Mentoria & Dúvidas
              </span>
            </button>
          </>
        )}

        {/* ==================== 4. ADMIN & AUDITORIA TCC ==================== */}
        {isAdmin && (
          <>
            <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Governança
            </div>

            <button onClick={() => setCurrentTab('admin-dashboard')} className={getItemClass('admin-dashboard')}>
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Visão Geral & Preços
              </span>
            </button>

            <button onClick={() => setCurrentTab('admin-revisoes')} className={getItemClass('admin-revisoes')}>
              <span className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-amber-600" /> Fila de Revisões (LGPD)
              </span>
            </button>

            <button onClick={() => setCurrentTab('admin-laboratorio')} className={getItemClass('admin-laboratorio')}>
              <span className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-primary" /> Laboratório TCC (Testes)
              </span>
            </button>
          </>
        )}

      </div>
    </aside>
  );
};
