import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getCandidateLevelInfo } from '../../utils/candidateRanking';
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
  PanelLeftClose,
  PanelLeft,
  Zap,
  Lock,
  Flame,
  Award,
  Plus,
  LifeBuoy,
  Mail
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ currentTab, setCurrentTab }) => {
  const { activePersona, session, currentUser, companyCredits, candidates, currentCandidateId } = useApp();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('QITECH_SIDEBAR_COLLAPSED') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('QITECH_SIDEBAR_COLLAPSED', String(next));
      } catch (_) {}
      return next;
    });
  };

  const role = session?.role || currentUser?.role;
  const isCompany = role === 'empresa' || activePersona === 'empresa-orion';
  const isAdmin = role === 'admin' || activePersona === 'admin-qitech';
  const isCommunityExternal = activePersona === 'comunidade-rafael';
  const isCandidate = !isCompany && !isAdmin && !isCommunityExternal;

  const currentProfile = candidates[currentCandidateId];
  const levelInfo = getCandidateLevelInfo(currentProfile, currentUser?.seniority);
  const { lvl, seniority, tier, xpPercentage } = levelInfo;

  // Itens Minimalistas e Mais Encorpados com Ícones Lucide 20px (w-5 h-5)
  const candidateItems: NavItem[] = [
    { id: 'candidato-inicio', label: 'Dashboard Dev', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'candidato-entrevista', label: 'Entrevista IA', icon: <Bot className="w-5 h-5" /> },
    { id: 'candidato-perfil', label: 'Meu Perfil Técnico', icon: <Contact className="w-5 h-5" /> },
    { id: 'candidato-vagas', label: 'Oportunidades', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'candidato-processos', label: 'Meus Processos', icon: <FileText className="w-5 h-5" /> },
    { id: 'candidato-estalecas', label: 'Tech Points', icon: <Hexagon className="w-5 h-5" /> },
    { id: 'candidato-relatorio', label: 'Laudo da IA', icon: <ShieldCheck className="w-5 h-5" /> }
  ];

  const companyItems: NavItem[] = [
    { 
      id: 'empresa-vagas', 
      label: 'Painel de Vagas', 
      icon: <Building2 className="w-5 h-5" />,
      badge: `${companyCredits} slots`,
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30'
    },
    { id: 'empresa-matching-ia', label: 'Análise de Matching', icon: <Target className="w-5 h-5" /> },
    { id: 'empresa-comparacao', label: 'Comparar Perfis', icon: <FileText className="w-5 h-5" /> },
    { 
      id: 'vitrine-planos', 
      label: 'Planos & Slots B2B', 
      icon: <CreditCard className="w-5 h-5" />,
      badge: 'Gestão',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
    }
  ];

  const adminItems: NavItem[] = [
    { id: 'admin-dashboard', label: 'Governança & Dados', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'vitrine-planos', label: 'Planos & Slots B2B', icon: <Store className="w-5 h-5" /> },
    { id: 'admin-revisoes', label: 'Revisões (Art. 20)', icon: <RotateCcw className="w-5 h-5" /> },
    { id: 'admin-laboratorio', label: 'Laboratório TCC', icon: <Database className="w-5 h-5" /> },
    { id: 'admin-monitor', label: 'Pipeline & Logs IA', icon: <Bot className="w-5 h-5" /> }
  ];

  const communityItems: NavItem[] = [
    { id: 'comunidade-feed', label: 'Feed de Artigos', icon: <Share2 className="w-5 h-5" /> },
    { id: 'comunidade-rede', label: 'Rede de Conexões', icon: <Users className="w-5 h-5" /> },
    { id: 'comunidade-ajuda', label: 'Mentoria & Dúvidas', icon: <Search className="w-5 h-5" /> }
  ];

  const currentItems = isCandidate
    ? candidateItems
    : isCompany
    ? companyItems
    : isAdmin
    ? adminItems
    : communityItems;

  const roleLabel = isCandidate
    ? 'Desenvolvedor'
    : isCompany
    ? 'Empresa B2B'
    : isAdmin
    ? 'Governança TCC'
    : 'Comunidade';

  return (
    <aside 
      className={`shrink-0 transition-all duration-300 ease-in-out border-r border-border bg-card dark:border-[#1E2638] dark:bg-[#0A0D14] lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-4rem)] lg:max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar z-20 flex flex-col ${
        isCollapsed ? 'w-full lg:w-[72px]' : 'w-full lg:w-[264px]'
      }`}
    >
      <div className={`p-4 flex flex-col ${isCollapsed ? 'space-y-4' : 'space-y-3.5'}`}>
        
        {/* Cabeçalho do Menu Lateral: Perfil Ativo & Botão de Recolher */}
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#1E2638]">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/20 dark:border-amber-400/20 truncate">
                  {roleLabel}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  Ativo
                </span>
              </div>
              <button
                type="button"
                onClick={toggleCollapsed}
                title="Recolher Menu Lateral"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#161D2B] transition-colors shrink-0"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex justify-center py-0.5">
              <button
                type="button"
                onClick={toggleCollapsed}
                title="Estender Menu Lateral"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#161D2B] transition-colors"
              >
                <PanelLeft className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              </button>
            </div>
          )}
        </div>

        {/* Rótulo de Seção (Apenas quando expandido) */}
        {!isCollapsed && (
          <div className="px-2 text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
            <span>Navegação</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Ativa</span>
          </div>
        )}

        {/* Lista de Itens do Menu (Organizada e Conectada) */}
        <nav className="space-y-1.5">
          {currentItems.map(item => {
            const isActive = currentTab === item.id;

            if (isCollapsed) {
              // ==================== MODO RECOLHIDO (Ícones Maiores + Tooltip) ====================
              return (
                <div key={item.id} className="relative group flex justify-center py-0.5">
                  <button
                    type="button"
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400 border border-amber-500/40 dark:border-amber-400/40 shadow-sm scale-105'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#151C2A]'
                    }`}
                  >
                    {item.icon}
                    {isActive && (
                      <span className="absolute -left-4 top-2 bottom-2 w-1.5 bg-amber-500 dark:bg-amber-400 rounded-r-full shadow-sm" />
                    )}
                  </button>

                  {/* Tooltip flutuante minimalista */}
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-card border border-border text-foreground dark:bg-[#101522] dark:border-[#232D3F] dark:text-white text-xs font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            // ==================== MODO ESTENDIDO ====================
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all group text-left relative ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-800 dark:bg-[#161E2E] dark:text-amber-400 font-bold border-l-4 border-amber-500 dark:border-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#121824] font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 transition-colors ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${item.badgeColor || 'bg-amber-500/10 text-amber-700 border-amber-500/25 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* =========================================================================
            INFORMAÇÕES DE NÍVEL / STATUS (AGORA JUNTAS DAS OPÇÕES, SEM VAZIO)
           ========================================================================= */}
        {isCollapsed ? (
          <div className="pt-3 border-t border-border dark:border-[#1E2638] flex flex-col items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#121722] border border-border dark:border-[#1E2638] flex items-center justify-center font-mono font-bold text-xs text-amber-600 dark:text-amber-400 shadow-sm"
              title={`Nível ${lvl} • ${seniority} (${tier})`}
            >
              L{lvl}
            </div>
            <div 
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" 
              title={`Motor IA Ativo • ${tier}`} 
            />
            <a
              href="mailto:qimatch.suporte@gmail.com?subject=Suporte%20Plataforma%20Q.I.%20Match"
              className="w-8 h-8 rounded-lg border border-border dark:border-[#1E2638] flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:bg-muted transition-colors mt-1"
              title="Suporte: qimatch.suporte@gmail.com"
            >
              <LifeBuoy className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="pt-2.5 border-t border-border dark:border-[#1E2638] space-y-3">
            {/* Widget Informativo do Candidato / Ficha Técnica RPG */}
            {isCandidate && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121722] border border-border dark:border-[#1E2638] space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-800 dark:text-slate-300 font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Nível {lvl} • {seniority}</span>
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${levelInfo.badgeBg} ${levelInfo.badgeBorder} ${levelInfo.badgeText}`}>
                    {tier}
                  </span>
                </div>

                {/* Mini Barra de XP */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground dark:text-slate-400 mb-1">
                    <span>XP Técnico</span>
                    <span className="text-amber-700 dark:text-amber-400 font-semibold">{xpPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-[#1B2230] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 dark:from-amber-400 dark:to-emerald-400 rounded-full transition-all duration-300" 
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground dark:text-slate-400 pt-1.5 border-t border-border dark:border-[#1F2737]">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Lock className="w-3 h-3" />
                    <span>Modo Ghost</span>
                  </span>
                  <span className="text-muted-foreground dark:text-slate-400">LGPD Art. 20</span>
                </div>
              </div>
            )}

            {/* Widget B2B para Empresa */}
            {isCompany && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121722] border border-border dark:border-[#1E2638] space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-800 dark:text-slate-300 font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Plano Corporativo</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25">
                    Ativo
                  </span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground dark:text-slate-400 flex items-center justify-between">
                  <span>Slots de Vagas:</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">{companyCredits} disponíveis</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('empresa-vagas')}
                  className="w-full mt-1.5 py-1.5 bg-amber-400/15 hover:bg-amber-400 hover:text-black border border-amber-400/30 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Publicar Nova Vaga</span>
                </button>
              </div>
            )}

            {/* Widget Governança para Admin */}
            {isAdmin && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121722] border border-border dark:border-[#1E2638] space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-800 dark:text-slate-300 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Auditoria TCC</span>
                  </span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/25">
                    Governança
                  </span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground dark:text-slate-400">
                  Logs de IA & Revisões Art. 20
                </div>
              </div>
            )}

            {/* Badges de Status da Plataforma */}
            <div className="space-y-1.5 px-0.5">
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate">Motor IA & Whisper Ativo</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 dark:bg-amber-400/80 shrink-0" />
                <span className="truncate">Criptografia & Double Opt-In</span>
              </div>
            </div>

            {/* Canal de Suporte Oficial */}
            <a
              href="mailto:qimatch.suporte@gmail.com?subject=Suporte%20Plataforma%20Q.I.%20Match"
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#121722] hover:bg-amber-500/5 dark:hover:bg-amber-500/10 border border-border dark:border-[#1E2638] hover:border-amber-500/30 flex items-center justify-between gap-2 text-foreground transition-all group"
              title="Suporte Técnico e Comercial: qimatch.suporte@gmail.com"
            >
              <div className="flex items-center gap-2 min-w-0 text-left">
                <div className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
                  <LifeBuoy className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold block truncate group-hover:text-amber-500 transition-colors">Suporte Técnico</span>
                  <span className="text-[10px] text-muted-foreground block truncate">qimatch.suporte@gmail.com</span>
                </div>
              </div>
              <Mail className="w-3.5 h-3.5 text-muted-foreground group-hover:text-amber-500 shrink-0" />
            </a>
          </div>
        )}

      </div>
    </aside>
  );
};
