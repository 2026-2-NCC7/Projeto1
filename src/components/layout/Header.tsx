import React, { useState } from 'react';
import { useApp, ActivePersona } from '../../context/AppContext';
import { Bell, Search, User, LogOut, ChevronDown, Check, Sun, Moon, PlayCircle } from 'lucide-react';

interface HeaderProps {
  currentViewTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ currentViewTitle }) => {
  const {
    theme,
    toggleTheme,
    activePersona,
    setActivePersona,
    currentUser,
    session,
    currentCandidateId,
    currentCompany,
    candidates,
    notifications,
    markNotificationAsRead,
    logout
  } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const demoAccounts: Array<{ id: ActivePersona; name: string; badge: string }> = [
    { id: 'candidato-lucas', name: 'Lucas Almeida', badge: 'Profissional (Demo)' },
    { id: 'candidato-marina', name: 'Marina Costa', badge: 'Profissional Sênior (Demo)' },
    { id: 'comunidade-rafael', name: 'Rafael Mendes', badge: 'Comunidade (Demo)' },
    { id: 'empresa-orion', name: 'Orion Tech Solutions', badge: 'Empresa B2B (Demo)' },
    { id: 'admin-qitech', name: 'Governança Q.I. Tech', badge: 'Admin (Demo)' }
  ];

  let userDisplayName = currentUser?.name || 'Lucas Almeida';
  let userAvatar = '';
  let userBadge = 'Profissional';
  let currentUserId = currentUser?.id || 'user-lucas';

  if (session?.role === 'empresa' || activePersona === 'empresa-orion') {
    userDisplayName = currentCompany?.name || currentUser?.companyName || 'Orion Tech Solutions';
    userAvatar = currentUser?.isDemo
      ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
      : '';
    userBadge = 'Empresa B2B';
    currentUserId = currentUser?.id || 'user-orion';
  } else if (session?.role === 'admin' || activePersona === 'admin-qitech') {
    userDisplayName = currentUser?.name || 'Governança Q.I. Tech';
    userAvatar = '';
    userBadge = 'Admin';
    currentUserId = currentUser?.id || 'user-admin';
  } else if (activePersona === 'comunidade-rafael') {
    userDisplayName = 'Rafael Mendes';
    userAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
    userBadge = 'Comunidade';
    currentUserId = 'user-rafael-externo';
  } else {
    const cand = candidates[currentCandidateId];
    userDisplayName = cand?.name || currentUser?.name || 'Profissional';
    userAvatar = cand?.avatar || '';
    userBadge = cand?.seniority ? `Profissional ${cand.seniority}` : 'Profissional';
    currentUserId = currentUser?.id || 'user-lucas';
  }

  const myNotifications = notifications.filter(
    n => n.recipientUserId === currentUserId || (session?.role === 'empresa' && n.recipientUserId === 'user-orion')
  );
  const unreadCount = myNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b border-border shadow-xs">
      <div className="max-w-[1440px] mx-auto h-full px-4 flex items-center justify-between gap-4">
        
        {/* Marca e Seção Atual */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-base bg-primary flex items-center justify-center font-heading font-bold text-white text-lg shadow-xs">
            Q
          </div>
          <div>
            <span className="font-heading font-bold text-foreground text-base leading-tight block">
              Q.I. Tech
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              {currentViewTitle}
            </span>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar vagas, habilidades ou especialistas..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-background border border-border rounded-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Alternador de Tema, Notificações e Ícone de Conta com Lista Suspensa */}
        <div className="flex items-center gap-2.5">
          
          {/* Botão Alternar Modo Escuro / Claro */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-base border border-border flex items-center justify-center hover:bg-secondary text-foreground transition-colors"
            title={theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
            aria-label="Alternar tema claro/escuro"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-brandOrange" />
            ) : (
              <Moon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* Sino de Notificações */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="w-9 h-9 rounded-base border border-border flex items-center justify-center hover:bg-secondary text-foreground relative transition-colors"
              title="Notificações"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brandOrange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-base shadow-lg p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
                  <span className="font-heading font-bold text-xs text-foreground">Notificações</span>
                  <span className="text-[10px] text-muted-foreground">{myNotifications.length} recente(s)</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {myNotifications.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2 text-center">Nenhuma notificação no momento.</p>
                  ) : (
                    myNotifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2 rounded text-xs cursor-pointer transition-colors ${
                          n.read ? 'bg-background text-muted-foreground' : 'bg-secondary/60 text-foreground font-medium border border-primary/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-[11px] text-primary">{n.title}</strong>
                          <span className="text-[9px] text-muted-foreground">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Menu Suspenso de Sessão do Usuário */}
          <div className="relative pl-2 border-l border-border">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-2 py-1 rounded-base hover:bg-background transition-all"
            >
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userDisplayName} 
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-foreground block leading-tight truncate max-w-[145px]">
                  {userDisplayName}
                </span>
                <span className="text-[10px] text-primary font-semibold block">
                  {userBadge}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-border rounded-base shadow-xl py-2 z-50">
                {/* Dados da Sessão Atual */}
                <div className="px-3.5 py-2 border-b border-border bg-background/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Sessão Autenticada
                  </span>
                  <strong className="text-xs font-bold text-foreground block truncate mt-0.5">
                    {userDisplayName}
                  </strong>
                  <span className="text-[10px] text-muted-foreground block truncate">
                    {session?.email || currentUser?.email}
                  </span>
                </div>

                {/* Atalho de Demonstração para alternar personas seedadas */}
                <div className="px-3.5 py-1.5 border-b border-border flex items-center gap-1">
                  <PlayCircle className="w-3 h-3 text-brandOrange" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Acesso de Demonstração
                  </span>
                </div>

                {demoAccounts.map(acc => {
                  const isCurrent = acc.id === activePersona && Boolean(currentUser?.isDemo);
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setActivePersona(acc.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full px-3.5 py-1.5 text-left flex items-center justify-between text-xs hover:bg-secondary/60 transition-colors ${
                        isCurrent ? 'bg-secondary/40 font-bold text-primary' : 'text-foreground'
                      }`}
                    >
                      <div>
                        <span className="block">{acc.name}</span>
                        <span className="text-[10px] text-muted-foreground">{acc.badge}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  );
                })}

                <div className="border-t border-border mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      window.location.hash = '';
                      logout();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-bold text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Encerrar Sessão (Sair)
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};