import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { SidebarNav } from './components/layout/SidebarNav';

// Views
import { PersonaSelectorView } from './views/PersonaSelectorView';
import { CandidateOnboardingView } from './views/CandidateOnboardingView';
import { CandidateProfileView } from './views/CandidateProfileView';
import { CandidateInterviewView } from './views/CandidateInterviewView';
import { CandidateOpportunitiesView } from './views/CandidateOpportunitiesView';
import { CandidateApplicationsView } from './views/CandidateApplicationsView';
import { CandidateRewardsView } from './views/CandidateRewardsView';
import { CompanyDashboardView } from './views/CompanyDashboardView';
import { CompanyVacancyDetailView } from './views/CompanyVacancyDetailView';
import { CommunityFeedView } from './views/CommunityFeedView';
import { CommunityNetworkView } from './views/CommunityNetworkView';
import { CommunityHelperView } from './views/CommunityHelperView';
import { AdminDashboardView } from './views/AdminDashboardView';

const CANDIDATE_ALLOWED_TABS = [
  'candidato-perfil',
  'candidato-entrevista',
  'candidato-vagas',
  'candidato-processos',
  'candidato-estalecas',
  'comunidade-feed',
  'comunidade-rede',
  'comunidade-ajuda'
];

const COMPANY_ALLOWED_TABS = [
  'empresa-vagas',
  'empresa-shortlist',
  'empresa-vaga-detalhe'
];

const ADMIN_ALLOWED_TABS = [
  'admin-dashboard'
];

const MainLayout: React.FC = () => {
  const { activePersona, isAuthenticated, session, currentUser, needsOnboarding } = useApp();
  
  const [currentTab, setCurrentTabState] = useState<string>('candidato-perfil');
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>('vac-frontend-pleno');
  const [routeNotice, setRouteNotice] = useState<string>('');

  const getDefaultTabForCurrentUser = (): string => {
    const role = session?.role || currentUser?.role;
    if (role === 'empresa' || activePersona === 'empresa-orion') {
      return 'empresa-vagas';
    }
    if (role === 'admin' || activePersona === 'admin-qitech') {
      return 'admin-dashboard';
    }
    if (activePersona === 'comunidade-rafael') {
      return 'comunidade-feed';
    }
    return 'candidato-perfil';
  };

  const isTabAllowedForRole = (tab: string): boolean => {
    const role = session?.role || currentUser?.role;
    if (role === 'empresa') {
      return COMPANY_ALLOWED_TABS.includes(tab);
    }
    if (role === 'admin') {
      return ADMIN_ALLOWED_TABS.includes(tab);
    }
    if (role === 'profissional') {
      return CANDIDATE_ALLOWED_TABS.includes(tab);
    }
    return false;
  };

  // Proteção de navegação por aba: impede Empresa em telas de Candidato e vice-versa
  const setCurrentTab = (nextTab: string) => {
    if (!isAuthenticated) {
      setRouteNotice('Faça login para acessar as áreas internas da plataforma.');
      return;
    }
    if (!isTabAllowedForRole(nextTab)) {
      const fallback = getDefaultTabForCurrentUser();
      setCurrentTabState(fallback);
      window.location.hash = `#/${fallback}`;
      return;
    }
    setCurrentTabState(nextTab);
    window.location.hash = `#/${nextTab}`;
  };

  // Redirecionamento automático ao autenticar ou trocar de sessão/papel
  useEffect(() => {
    if (!isAuthenticated) {
      const hash = window.location.hash.replace('#/', '').trim();
      const isInternalHash =
        CANDIDATE_ALLOWED_TABS.includes(hash) ||
        COMPANY_ALLOWED_TABS.includes(hash) ||
        ADMIN_ALLOWED_TABS.includes(hash) ||
        hash === 'onboarding';
      if (isInternalHash) {
        setRouteNotice('Acesso restrito: autentique-se para acessar esta rota interna.');
        window.location.hash = '#/login';
      }
      return;
    }

    setRouteNotice('');
    if (needsOnboarding) {
      window.location.hash = '#/onboarding';
      return;
    }

    const hash = window.location.hash.replace('#/', '').trim();
    if (hash && isTabAllowedForRole(hash)) {
      setCurrentTabState(hash);
    } else {
      const targetTab = getDefaultTabForCurrentUser();
      setCurrentTabState(targetTab);
      window.location.hash = `#/${targetTab}`;
    }
  }, [isAuthenticated, session?.userId, session?.role, activePersona, needsOnboarding]);

  // Monitora alterações manuais na URL (hash) para proteger rotas em tempo real
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').trim();
      if (!hash || hash === 'login') return;

      if (!isAuthenticated) {
        setRouteNotice('Você precisa estar autenticado para acessar páginas internas.');
        window.location.hash = '#/login';
        return;
      }

      if (needsOnboarding && hash !== 'onboarding') {
        window.location.hash = '#/onboarding';
        return;
      }

      if (!isTabAllowedForRole(hash)) {
        const fallback = getDefaultTabForCurrentUser();
        setCurrentTabState(fallback);
        window.location.hash = `#/${fallback}`;
      } else {
        setCurrentTabState(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, session?.role, needsOnboarding, activePersona]);

  if (!isAuthenticated) {
    return (
      <PersonaSelectorView
        initialAuthNotice={routeNotice}
        onEnterApp={() => {
          setRouteNotice('');
        }}
      />
    );
  }

  // Se for um profissional recém-cadastrado com onboarding pendente, leva ao fluxo curto de onboarding
  if (needsOnboarding) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-background">
        <Header currentViewTitle="Onboarding do Profissional" />
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 py-6">
          <CandidateOnboardingView
            onComplete={() => {
              setCurrentTabState('candidato-perfil');
              window.location.hash = '#/candidato-perfil';
            }}
          />
        </main>
        <footer className="bg-white border-t border-border py-4 text-center text-xs text-muted-foreground">
          <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Q.I. Tech — Plataforma de Recrutamento Invertido & Comunidade Técnica</span>
            <span className="text-[11px]">Proteção de Dados e Double Opt-In em conformidade com a LGPD</span>
          </div>
        </footer>
      </div>
    );
  }

  const safeTab = isTabAllowedForRole(currentTab) ? currentTab : getDefaultTabForCurrentUser();

  const getTitle = () => {
    switch (safeTab) {
      case 'candidato-perfil': return 'Meu Perfil Técnico';
      case 'candidato-entrevista': return 'Entrevista IA (Soft Skills)';
      case 'candidato-vagas': return 'Vagas Compatíveis';
      case 'candidato-processos': return 'Meus Processos';
      case 'candidato-estalecas': return 'Estalecas & Indicações';
      case 'empresa-vagas': return 'Painel Corporativo & Faturamento';
      case 'empresa-shortlist': return 'Match Express & Shortlists';
      case 'empresa-vaga-detalhe': return 'Shortlist & Gestão da Vaga';
      case 'comunidade-feed': return 'Feed da Comunidade';
      case 'comunidade-rede': return 'Minha Rede & Afinidade';
      case 'comunidade-ajuda': return 'Mentoria & Ajuda Técnica';
      case 'admin-dashboard': return 'Backoffice & Governança';
      default: return 'Q.I. Tech';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      
      {/* Cabeçalho Comercial Autenticado */}
      <Header currentViewTitle={getTitle()} />

      {/* Corpo Principal */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Navegação Esquerda */}
          <SidebarNav currentTab={safeTab} setCurrentTab={setCurrentTab} />

          {/* Área de Conteúdo Central Protegida por Papel */}
          <div className="flex-1 min-w-0">
            {safeTab === 'candidato-perfil' && <CandidateProfileView />}
            {safeTab === 'candidato-entrevista' && <CandidateInterviewView />}
            {safeTab === 'candidato-vagas' && (
              <CandidateOpportunitiesView onNavigateToProcess={() => setCurrentTab('candidato-processos')} />
            )}
            {safeTab === 'candidato-processos' && <CandidateApplicationsView />}
            {safeTab === 'candidato-estalecas' && <CandidateRewardsView />}
            
            {safeTab === 'empresa-vagas' && (
              <CompanyDashboardView 
                onSelectVacancy={(id) => {
                  setSelectedVacancyId(id);
                  setCurrentTab('empresa-vaga-detalhe');
                }} 
              />
            )}
            {safeTab === 'empresa-shortlist' && (
              <CompanyVacancyDetailView 
                vacancyId={selectedVacancyId || 'vac-frontend-pleno'} 
                onBack={() => setCurrentTab('empresa-vagas')} 
              />
            )}
            {safeTab === 'empresa-vaga-detalhe' && (
              <CompanyVacancyDetailView 
                vacancyId={selectedVacancyId} 
                onBack={() => setCurrentTab('empresa-vagas')} 
              />
            )}

            {safeTab === 'comunidade-feed' && <CommunityFeedView />}
            {safeTab === 'comunidade-rede' && <CommunityNetworkView />}
            {safeTab === 'comunidade-ajuda' && <CommunityHelperView />}
            {safeTab === 'admin-dashboard' && <AdminDashboardView />}
          </div>

        </div>
      </main>

      {/* Rodapé Comercial */}
      <footer className="bg-white border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Q.I. Tech — Plataforma de Recrutamento Invertido & Comunidade Técnica</span>
          <span className="text-[11px]">Proteção de Dados e Double Opt-In em conformidade com a LGPD</span>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}