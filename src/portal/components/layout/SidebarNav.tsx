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

  return (
    <aside className="w-full lg:w-[248px] shrink-0 space-y-4">
      <div className="bg-white p-3.5 rounded-base border border-border shadow-xs space-y-1">
        
        {/* ==================== NAVEGAÇÃO PERFIL CANDIDATO ==================== */}
        {isCandidate && (
          <>
            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Perfil & Avaliação por IA
            </div>

            <button
              onClick={() => setCurrentTab('candidato-perfil')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-perfil' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4" /> Meu Perfil Técnico
              </span>
              <span className="text-[9px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                1–5
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('candidato-entrevista')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-entrevista' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-brandOrange" /> Entrevista IA (Áudio/Texto)
              </span>
              <span className="text-[9px] bg-brandOrange/15 text-brandOrange font-bold px-1.5 py-0.5 rounded">
                Whisper
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('candidato-relatorio')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-relatorio' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-primary" /> Relatório de Competências
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Evidências
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('candidato-replica')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-replica' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-amber-600" /> Direito de Réplica (LGPD)
              </span>
              <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                v1→v2
              </span>
            </button>

            <div className="pt-3 mt-3 border-t border-border px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Recrutamento Invertido
            </div>

            <button
              onClick={() => setCurrentTab('candidato-vagas')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-vagas' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" /> Vagas Compatíveis
              </span>
              <span className="text-[9px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                5 Etapas
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('candidato-processos')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-processos' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" /> Meus Processos
              </span>
              <span className="text-[9px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                Opt-In
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('candidato-estalecas')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-estalecas' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-brandOrange" /> Estalecas & Indicações
              </span>
              <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-1.5 py-0.5 rounded">
                {rewardBalance} 🪙
              </span>
            </button>

            <div className="pt-3 mt-3 border-t border-border px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Comunidade Técnica (PF)
            </div>

            <button
              onClick={() => setCurrentTab('comunidade-feed')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-feed' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Share2 className="w-4 h-4" /> Feed Técnico
            </button>

            <button
              onClick={() => setCurrentTab('comunidade-rede')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-rede' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" /> Minha Rede & Afinidade
            </button>

            <button
              onClick={() => setCurrentTab('comunidade-ajuda')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-ajuda' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Search className="w-4 h-4" /> Mentoria & Ajuda
            </button>
          </>
        )}

        {/* ==================== NAVEGAÇÃO PERFIL EMPRESA CLIENTE ==================== */}
        {isCompany && (
          <>
            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Gestão Corporativa B2B
            </div>

            <button
              onClick={() => setCurrentTab('empresa-vagas')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'empresa-vagas' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" /> Vagas & Faturamento
              </span>
              <span className="text-[10px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                {companyCredits} créd.
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('empresa-shortlist')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'empresa-shortlist' || currentTab === 'empresa-vaga-detalhe'
                  ? 'bg-secondary text-primary font-bold'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-brandOrange" /> Shortlist & Double Opt-In
              </span>
              <span className="text-[9px] bg-brandOrange/15 text-brandOrange font-bold px-1.5 py-0.5 rounded">
                Funil
              </span>
            </button>

            <div className="pt-3 mt-3 border-t border-border px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Motor de Matching & IA
            </div>

            <button
              onClick={() => setCurrentTab('empresa-matching-ia')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'empresa-matching-ia' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-primary" /> Ranking IA (5 Etapas)
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Cobertura
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('empresa-comparacao')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'empresa-comparacao' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <GitCompare className="w-4 h-4 text-primary" /> Comparação Lado a Lado
              </span>
              <span className="text-[9px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                Matriz
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('empresa-relatorios-ia')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'empresa-relatorios-ia' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-primary" /> Dossiês de Evidências IA
              </span>
              <span className="text-[9px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                Verbatim
              </span>
            </button>
          </>
        )}

        {/* ==================== NAVEGAÇÃO MEMBRO EXTERNO DA COMUNIDADE ==================== */}
        {isCommunityExternal && (
          <>
            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Comunidade Técnica Q.I.
            </div>

            <button
              onClick={() => setCurrentTab('comunidade-feed')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-feed' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Share2 className="w-4 h-4" /> Feed Técnico
            </button>

            <button
              onClick={() => setCurrentTab('comunidade-rede')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-rede' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" /> Minha Rede & Afinidade
            </button>

            <button
              onClick={() => setCurrentTab('comunidade-ajuda')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-ajuda' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Search className="w-4 h-4" /> Mentoria & Ajuda
            </button>
          </>
        )}

        {/* ==================== NAVEGAÇÃO PERFIL ADMIN & BANCA TCC ==================== */}
        {isAdmin && (
          <>
            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Governança & Operações
            </div>

            <button
              onClick={() => setCurrentTab('admin-dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'admin-dashboard' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" /> Governança & Preços B2B
              </span>
              <span className="text-[9px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                LGPD
              </span>
            </button>

            <div className="pt-3 mt-3 border-t border-border px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Motor IA & Auditoria TCC
            </div>

            <button
              onClick={() => setCurrentTab('admin-motor-ia')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'admin-motor-ia' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Brain className="w-4 h-4 text-primary" /> Motor IA & Cenários (A–G)
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                TCC
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('admin-monitor')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'admin-monitor' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-brandOrange" /> Pipeline IA & Auditoria
              </span>
              <span className="text-[9px] bg-brandOrange/15 text-brandOrange font-bold px-1.5 py-0.5 rounded">
                5 Etapas
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('admin-revisoes')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'admin-revisoes' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-amber-600" /> Relatórios & Réplicas IA
              </span>
              <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                Art. 20
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('admin-laboratorio')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'admin-laboratorio' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-primary" /> Laboratório de Dados (API)
              </span>
              <span className="text-[9px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                SQLite
              </span>
            </button>
          </>
        )}

      </div>
    </aside>
  );
};
