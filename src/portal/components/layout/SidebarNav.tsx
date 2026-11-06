import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Briefcase,
  Sparkles,
  Layers,
  Award,
  Share2,
  ShieldCheck,
  Users,
  Search,
  Brain,
  FileText,
  RotateCcw,
  Target,
  GitCompare,
  Activity,
  Database,
  Mic
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ currentTab, setCurrentTab }) => {
  const { activePersona, session, rewardBalance, companyCredits } = useApp();

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
    <aside className="w-full lg:w-[240px] shrink-0 space-y-4">
      <div className="bg-white p-3 rounded-base border border-border shadow-xs space-y-1">
        
        {/* ==================== CANDIDATO ==================== */}
        {isCandidate && (
          <>
            <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Meu Perfil & IA
            </div>

            <button onClick={() => setCurrentTab('candidato-perfil')} className={getItemClass('candidato-perfil')}>
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-primary" /> Meu Perfil Técnico
              </span>
            </button>

            <button onClick={() => setCurrentTab('candidato-entrevista')} className={getItemClass('candidato-entrevista')}>
              <span className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-brandOrange" /> Entrevista por IA
              </span>
            </button>

            <button onClick={() => setCurrentTab('candidato-relatorio')} className={getItemClass('candidato-relatorio')}>
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600" /> Relatório de Evidências
              </span>
            </button>

            <button onClick={() => setCurrentTab('candidato-replica')} className={getItemClass('candidato-replica')}>
              <span className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-amber-600" /> Direito de Réplica
              </span>
            </button>

            <div className="pt-2.5 mt-2.5 border-t border-border px-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Oportunidades
            </div>

            <button onClick={() => setCurrentTab('candidato-vagas')} className={getItemClass('candidato-vagas')}>
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-primary" /> Vagas Compatíveis
              </span>
            </button>

            <button onClick={() => setCurrentTab('candidato-processos')} className={getItemClass('candidato-processos')}>
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-primary" /> Meus Processos
              </span>
            </button>

            <button onClick={() => setCurrentTab('candidato-estalecas')} className={getItemClass('candidato-estalecas')}>
              <span className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-brandOrange" /> Estalecas & Indicações
              </span>
              <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-1.5 py-0.5 rounded">
                {rewardBalance} 🪙
              </span>
            </button>

            <div className="pt-2.5 mt-2.5 border-t border-border px-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Comunidade
            </div>

            <button onClick={() => setCurrentTab('comunidade-feed')} className={getItemClass('comunidade-feed')}>
              <span className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-primary" /> Feed Técnico
              </span>
            </button>

            <button onClick={() => setCurrentTab('comunidade-rede')} className={getItemClass('comunidade-rede')}>
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-primary" /> Rede de Contatos
              </span>
            </button>

            <button onClick={() => setCurrentTab('comunidade-ajuda')} className={getItemClass('comunidade-ajuda')}>
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-primary" /> Ajuda & Mentoria
              </span>
            </button>
          </>
        )}

        {/* ==================== EMPRESA ==================== */}
        {isCompany && (
          <>
            <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Gestão da Empresa
            </div>

            <button onClick={() => setCurrentTab('empresa-vagas')} className={getItemClass('empresa-vagas')}>
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-primary" /> Vagas Abertas
              </span>
              <span className="text-[10px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                {companyCredits} créditos
              </span>
            </button>

            <button onClick={() => setCurrentTab('empresa-shortlist')} className={getItemClass('empresa-shortlist')}>
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-brandOrange" /> Shortlist de Talentos
              </span>
            </button>

            <div className="pt-2.5 mt-2.5 border-t border-border px-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Análise & Matching
            </div>

            <button onClick={() => setCurrentTab('empresa-matching-ia')} className={getItemClass('empresa-matching-ia')}>
              <span className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-primary" /> Ranking 5 Etapas
              </span>
            </button>

            <button onClick={() => setCurrentTab('empresa-comparacao')} className={getItemClass('empresa-comparacao')}>
              <span className="flex items-center gap-2.5">
                <GitCompare className="w-4 h-4 text-primary" /> Comparar Candidatos
              </span>
            </button>

            <button onClick={() => setCurrentTab('empresa-relatorios-ia')} className={getItemClass('empresa-relatorios-ia')}>
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600" /> Dossiês de Evidências
              </span>
            </button>
          </>
        )}

        {/* ==================== COMUNIDADE EXTERNA ==================== */}
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
                <Users className="w-4 h-4 text-primary" /> Minha Rede
              </span>
            </button>

            <button onClick={() => setCurrentTab('comunidade-ajuda')} className={getItemClass('comunidade-ajuda')}>
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-primary" /> Mentoria
              </span>
            </button>
          </>
        )}

        {/* ==================== ADMIN & BANCA ==================== */}
        {isAdmin && (
          <>
            <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Governança & Operação
            </div>

            <button onClick={() => setCurrentTab('admin-dashboard')} className={getItemClass('admin-dashboard')}>
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Painel de Governança
              </span>
            </button>

            <div className="pt-2.5 mt-2.5 border-t border-border px-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Auditoria de IA
            </div>

            <button onClick={() => setCurrentTab('admin-motor-ia')} className={getItemClass('admin-motor-ia')}>
              <span className="flex items-center gap-2.5">
                <Brain className="w-4 h-4 text-primary" /> Cenários TCC (A–G)
              </span>
            </button>

            <button onClick={() => setCurrentTab('admin-monitor')} className={getItemClass('admin-monitor')}>
              <span className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-brandOrange" /> Trilha de Extração
              </span>
            </button>

            <button onClick={() => setCurrentTab('admin-revisoes')} className={getItemClass('admin-revisoes')}>
              <span className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-amber-600" /> Relatórios & Réplicas
              </span>
            </button>

            <button onClick={() => setCurrentTab('admin-laboratorio')} className={getItemClass('admin-laboratorio')}>
              <span className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-primary" /> Catálogo de Dados
              </span>
            </button>
          </>
        )}

      </div>
    </aside>
  );
};
