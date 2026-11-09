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
  Layers,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Radio
} from 'lucide-react';
import { AnimatedIcon } from '../common/AnimatedIcon';

interface SidebarNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  emoji: string;
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

  // Itens de Menu por Papel
  const candidateItems: NavItem[] = [
    { id: 'candidato-inicio', label: 'Dashboard Dev', emoji: '📱', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'candidato-entrevista', label: 'Entrevista IA', emoji: '🤖', icon: <Bot className="w-4 h-4" /> },
    { id: 'candidato-perfil', label: 'Meu Perfil Técnico', emoji: '👤', icon: <Contact className="w-4 h-4" /> },
    { id: 'candidato-vagas', label: 'Oportunidades', emoji: '💼', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'candidato-processos', label: 'Meus Processos', emoji: '📑', icon: <FileText className="w-4 h-4" /> },
    { id: 'candidato-estalecas', label: 'Tech Points', emoji: '🪙', icon: <Hexagon className="w-4 h-4" /> },
    { id: 'candidato-relatorio', label: 'Laudo da IA', emoji: '🛡️', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  const companyItems: NavItem[] = [
    { 
      id: 'empresa-vagas', 
      label: 'Painel de Vagas', 
      emoji: '🏢', 
      icon: <Building2 className="w-4 h-4" />,
      badge: `${companyCredits} slots`,
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30'
    },
    { id: 'empresa-matching-ia', label: 'Análise de Matching', emoji: '🎯', icon: <Target className="w-4 h-4" /> },
    { id: 'empresa-comparacao', label: 'Comparar Perfis', emoji: '📊', icon: <FileText className="w-4 h-4" /> },
    { 
      id: 'vitrine-planos', 
      label: 'Planos & Slots B2B', 
      emoji: '💳', 
      icon: <CreditCard className="w-4 h-4" />,
      badge: 'Gestão',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
    }
  ];

  const adminItems: NavItem[] = [
    { id: 'admin-dashboard', label: 'Governança & Dados', emoji: '⚖️', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'vitrine-planos', label: 'Planos & Slots B2B', emoji: '🏪', icon: <Store className="w-4 h-4" /> },
    { id: 'admin-revisoes', label: 'Revisões (Art. 20)', emoji: '🔄', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'admin-laboratorio', label: 'Laboratório TCC', emoji: '🧪', icon: <Database className="w-4 h-4" /> },
    { id: 'admin-monitor', label: 'Pipeline & Logs IA', emoji: '📡', icon: <Bot className="w-4 h-4" /> }
  ];

  const communityItems: NavItem[] = [
    { id: 'comunidade-feed', label: 'Feed de Artigos', emoji: '🌐', icon: <Share2 className="w-4 h-4" /> },
    { id: 'comunidade-rede', label: 'Rede de Conexões', emoji: '👥', icon: <Users className="w-4 h-4" /> },
    { id: 'comunidade-ajuda', label: 'Mentoria & Dúvidas', emoji: '💡', icon: <Search className="w-4 h-4" /> }
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
      className={`shrink-0 transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-full lg:w-[68px]' : 'w-full lg:w-[250px]'
      }`}
    >
      {/* Menu Lateral Autêntico (Docked Nav - Sem visual de card flutuante isolado) */}
      <nav className="bg-[#0D111A] border border-[#1E2638] rounded-xl lg:rounded-2xl p-2.5 flex flex-col justify-between min-h-[480px] shadow-lg sticky top-20">
        
        <div className="space-y-3">
          {/* Header do Menu Lateral com botão de alternância (Recolher/Estender) */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1E2638]">
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5 min-w-0 pl-1">
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
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-black font-black font-heading text-xs flex items-center justify-center shadow-sm">
                  Q
                </div>
              </div>
            )}

            {/* Botão de Toggle Estender / Recolher */}
            <button
              type="button"
              onClick={toggleCollapsed}
              title={isCollapsed ? 'Estender Menu Lateral' : 'Recolher Menu Lateral'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182030] transition-colors shrink-0"
            >
              {isCollapsed ? (
                <PanelLeft className="w-4 h-4 text-amber-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Rótulo de Sessão (Exibido somente quando expandido) */}
          {!isCollapsed && (
            <div className="px-2 pt-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Navegação</span>
              <span className="text-[9px] text-emerald-400 font-mono font-medium">Ativa</span>
            </div>
          )}

          {/* Lista de Opções de Navegação */}
          <div className="space-y-1.5">
            {currentItems.map(item => {
              const isActive = currentTab === item.id;

              if (isCollapsed) {
                // ==================== MODO RECOLHIDO: PRÉVIA POR EMOJI COM TOOLTIP ====================
                return (
                  <div key={item.id} className="relative group flex justify-center">
                    <button
                      type="button"
                      onClick={() => setCurrentTab(item.id)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all relative ${
                        isActive
                          ? 'bg-[#1C2638] text-amber-400 border border-amber-400/80 shadow-md shadow-amber-500/10 scale-105'
                          : 'bg-[#101522] border border-transparent text-slate-400 hover:text-white hover:bg-[#161D2B] hover:border-[#232D3F]'
                      }`}
                    >
                      <span className="select-none">{item.emoji}</span>
                      {isActive && (
                        <span className="absolute -left-1 w-1.5 h-4 bg-amber-400 rounded-r-full" />
                      )}
                    </button>

                    {/* Tooltip flutuante ao passar o mouse */}
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-[#0A0D14] border border-[#232D3F] text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap flex items-center gap-2">
                      <span>{item.emoji}</span>
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

              // ==================== MODO ESTENDIDO: MENU LATERAL AUTÊNTICO ====================
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group text-left relative ${
                    isActive
                      ? 'bg-[#182234] text-amber-400 border border-amber-400/50 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#131A26] border border-transparent'
                  }`}
                >
                  {/* Linha indicadora ativa à esquerda */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-400 rounded-r-full" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base select-none shrink-0 group-hover:scale-110 transition-transform">
                      {item.emoji}
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
          </div>
        </div>

        {/* Rodapé do Menu Lateral */}
        <div className={`pt-3 border-t border-[#1E2638] ${isCollapsed ? 'flex flex-col items-center gap-2' : 'space-y-1.5 px-1'}`}>
          {isCollapsed ? (
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Motor IA Online" />
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate">Motor IA & Whisper Ativo</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="truncate">LGPD Art. 20 Conforme</span>
              </div>
            </>
          )}
        </div>

      </nav>
    </aside>
  );
};
