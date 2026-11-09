import React, { useState } from 'react';
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
  PanelLeftClose,
  PanelLeft
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
  const { activePersona, session, currentUser, companyCredits } = useApp();

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

  // Itens Minimalistas e Profissionais com Ícones Vetoriais Lucide (Sem Emojis)
  const candidateItems: NavItem[] = [
    { id: 'candidato-inicio', label: 'Dashboard Dev', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'candidato-entrevista', label: 'Entrevista IA', icon: <Bot className="w-4 h-4" /> },
    { id: 'candidato-perfil', label: 'Meu Perfil Técnico', icon: <Contact className="w-4 h-4" /> },
    { id: 'candidato-vagas', label: 'Oportunidades', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'candidato-processos', label: 'Meus Processos', icon: <FileText className="w-4 h-4" /> },
    { id: 'candidato-estalecas', label: 'Tech Points', icon: <Hexagon className="w-4 h-4" /> },
    { id: 'candidato-relatorio', label: 'Laudo da IA', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  const companyItems: NavItem[] = [
    { 
      id: 'empresa-vagas', 
      label: 'Painel de Vagas', 
      icon: <Building2 className="w-4 h-4" />,
      badge: `${companyCredits} slots`,
      badgeColor: 'bg-amber-400/15 text-amber-400 border-amber-400/25'
    },
    { id: 'empresa-matching-ia', label: 'Análise de Matching', icon: <Target className="w-4 h-4" /> },
    { id: 'empresa-comparacao', label: 'Comparar Perfis', icon: <FileText className="w-4 h-4" /> },
    { 
      id: 'vitrine-planos', 
      label: 'Planos & Slots B2B', 
      icon: <CreditCard className="w-4 h-4" />,
      badge: 'Gestão',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
    }
  ];

  const adminItems: NavItem[] = [
    { id: 'admin-dashboard', label: 'Governança & Dados', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'vitrine-planos', label: 'Planos & Slots B2B', icon: <Store className="w-4 h-4" /> },
    { id: 'admin-revisoes', label: 'Revisões (Art. 20)', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'admin-laboratorio', label: 'Laboratório TCC', icon: <Database className="w-4 h-4" /> },
    { id: 'admin-monitor', label: 'Pipeline & Logs IA', icon: <Bot className="w-4 h-4" /> }
  ];

  const communityItems: NavItem[] = [
    { id: 'comunidade-feed', label: 'Feed de Artigos', icon: <Share2 className="w-4 h-4" /> },
    { id: 'comunidade-rede', label: 'Rede de Conexões', icon: <Users className="w-4 h-4" /> },
    { id: 'comunidade-ajuda', label: 'Mentoria & Dúvidas', icon: <Search className="w-4 h-4" /> }
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
      className={`shrink-0 transition-all duration-300 ease-in-out border-r border-[#1E2638] bg-[#0A0D14] flex flex-col justify-between ${
        isCollapsed ? 'w-full lg:w-[64px]' : 'w-full lg:w-[240px]'
      }`}
    >
      <div className="p-3 space-y-4">
        {/* Cabeçalho do Menu Lateral */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-black font-black font-heading text-xs flex items-center justify-center shrink-0 shadow-sm">
                Q
              </div>
              <div className="min-w-0">
                <span className="font-heading font-extrabold text-xs text-white block truncate leading-tight">
                  Q.I. Match
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 block font-semibold truncate">
                  {roleLabel}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center py-0.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-black font-black font-heading text-xs flex items-center justify-center shadow-sm">
                Q
              </div>
            </div>
          )}

          {/* Botão de Toggle Estender / Recolher */}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={isCollapsed ? 'Estender Menu Lateral' : 'Recolher Menu Lateral'}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#161D2B] transition-colors shrink-0"
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4 text-amber-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Rótulo de Seção (Apenas quando expandido) */}
        {!isCollapsed && (
          <div className="px-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            Navegação
          </div>
        )}

        {/* Lista de Itens do Menu */}
        <nav className="space-y-1">
          {currentItems.map(item => {
            const isActive = currentTab === item.id;

            if (isCollapsed) {
              // ==================== MODO RECOLHIDO (Ícones Minimalistas + Tooltip) ====================
              return (
                <div key={item.id} className="relative group flex justify-center">
                  <button
                    type="button"
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all relative ${
                      isActive
                        ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                        : 'text-slate-400 hover:text-white hover:bg-[#141B28]'
                    }`}
                  >
                    {item.icon}
                    {isActive && (
                      <span className="absolute -left-3 top-2 bottom-2 w-1 bg-amber-400 rounded-r-full" />
                    )}
                  </button>

                  {/* Tooltip flutuante minimalista */}
                  <div className="absolute left-12 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-[#101522] border border-[#232D3F] text-white text-xs font-medium rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            // ==================== MODO ESTENDIDO (Layout Lateral Autêntico) ====================
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all group text-left relative ${
                  isActive
                    ? 'bg-[#151C2A] text-amber-400 font-bold border-l-2 border-amber-400'
                    : 'text-slate-300 hover:text-white hover:bg-[#121722] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${item.badgeColor || 'bg-amber-400/10 text-amber-400 border-amber-400/20'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Rodapé Lateral */}
      <div className={`p-3 border-t border-[#1E2638] ${isCollapsed ? 'flex justify-center' : 'space-y-1'}`}>
        {isCollapsed ? (
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Motor IA & Whisper Ativo" />
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span className="truncate">Motor IA & Whisper Ativo</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 shrink-0" />
              <span className="truncate">LGPD Art. 20 Conforme</span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
