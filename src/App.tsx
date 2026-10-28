import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { EcosystemTopBar } from './components/EcosystemTopBar';
import { Navbar } from './components/Navbar';
import { Header } from './components/layout/Header';
import { SidebarNav } from './components/layout/SidebarNav';

// Views do Portal (Recrutamento Invertido & Comunidade)
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

// Páginas do Matchmaker Engine (Motor IA & TCC)
import { DashboardPage } from './pages/DashboardPage';
import { CandidateRegistrationPage } from './pages/CandidateRegistrationPage';
import { InterviewSessionPage } from './pages/InterviewSessionPage';
import { ProcessingMonitorPage } from './pages/ProcessingMonitorPage';
import { CompetencyReportPage } from './pages/CompetencyReportPage';
import { ReplicaReviewPage } from './pages/ReplicaReviewPage';
import { JobManagementPage } from './pages/JobManagementPage';
import { MatchingRankingPage } from './pages/MatchingRankingPage';
import { CandidateComparisonPage } from './pages/CandidateComparisonPage';

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

interface MainLayoutProps {
  onSwitchToEngine?: () => void;
  onOpenEngineTab?: (tab: string, params?: any) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onSwitchToEngine, onOpenEngineTab }) => {
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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').trim();
      if (!hash || hash === 'login' || hash.startsWith('engine')) return;

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

  if (needsOnboarding) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-background qi-portal-container">
        <Header currentViewTitle="Onboarding do Profissional" onSwitchToEngine={onSwitchToEngine} />
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
    <div className="min-h-screen flex flex-col justify-between bg-background qi-portal-container">
      <Header currentViewTitle={getTitle()} onSwitchToEngine={onSwitchToEngine} />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <SidebarNav currentTab={safeTab} setCurrentTab={setCurrentTab} onOpenEngineTab={onOpenEngineTab} />
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
  const [activeModule, setActiveModule] = useState<'portal' | 'engine'>('portal');

  // Estados do Matchmaker Engine
  const [engineTab, setEngineTab] = useState<string>('dashboard');
  const [targetReportId, setTargetReportId] = useState<string | undefined>(undefined);
  const [targetJobId, setTargetJobId] = useState<string | undefined>(undefined);
  const [targetSkillId, setTargetSkillId] = useState<string | undefined>(undefined);
  const [targetCandidateIds, setTargetCandidateIds] = useState<string[]>([]);

  useEffect(() => {
    const hash = window.location.hash.replace('#/', '').trim();
    if (hash.startsWith('engine')) {
      setActiveModule('engine');
      const parts = hash.split('/');
      if (parts[1]) {
        setEngineTab(parts[1]);
      }
    }
  }, []);

  const handleOpenEngineTab = (
    tab: string,
    params?: { reportId?: string; jobId?: string; candidateIds?: string[]; skillId?: string }
  ) => {
    if (params?.reportId) setTargetReportId(params.reportId);
    if (params?.jobId) setTargetJobId(params.jobId);
    if (params?.candidateIds) setTargetCandidateIds(params.candidateIds);
    if (params?.skillId) setTargetSkillId(params.skillId);

    setEngineTab(tab);
    setActiveModule('engine');
    window.location.hash = `#/engine/${tab}`;
  };

  const handleNavigateToReport = (reportId: string) => {
    setTargetReportId(reportId);
    setEngineTab('reports');
  };

  const handleNavigateToReplica = (reportId: string, skillId?: string) => {
    setTargetReportId(reportId);
    setTargetSkillId(skillId);
    setEngineTab('replica');
  };

  const handleNavigateToMatching = (jobId: string) => {
    setTargetJobId(jobId);
    setEngineTab('matching');
  };

  const handleNavigateToComparison = (jobId: string, candidateIds: string[]) => {
    setTargetJobId(jobId);
    setTargetCandidateIds(candidateIds);
    setEngineTab('comparison');
  };

  const renderActiveEnginePage = () => {
    switch (engineTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={(tab) => setEngineTab(tab)} />;
      case 'candidates':
        return <CandidateRegistrationPage />;
      case 'interview':
        return (
          <InterviewSessionPage
            onNavigateToReport={handleNavigateToReport}
            onNavigateToMonitor={() => setEngineTab('monitor')}
          />
        );
      case 'monitor':
        return <ProcessingMonitorPage />;
      case 'reports':
        return (
          <CompetencyReportPage
            initialReportId={targetReportId}
            onNavigateToReplica={handleNavigateToReplica}
          />
        );
      case 'replica':
        return (
          <ReplicaReviewPage
            initialReportId={targetReportId}
            initialSkillId={targetSkillId}
          />
        );
      case 'jobs':
        return <JobManagementPage onNavigateToMatching={handleNavigateToMatching} />;
      case 'matching':
        return (
          <MatchingRankingPage
            initialJobId={targetJobId}
            onNavigateToComparison={handleNavigateToComparison}
            onNavigateToReport={handleNavigateToReport}
          />
        );
      case 'comparison':
        return (
          <CandidateComparisonPage
            initialJobId={targetJobId}
            initialCandidateIds={targetCandidateIds}
            onBackToMatching={(jobId) => {
              setTargetJobId(jobId);
              setEngineTab('matching');
            }}
          />
        );
      default:
        return <DashboardPage onNavigate={(tab) => setEngineTab(tab)} />;
    }
  };

  return (
    <AppProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <EcosystemTopBar
          activeModule={activeModule}
          setActiveModule={(mod) => {
            setActiveModule(mod);
            if (mod === 'engine') {
              window.location.hash = `#/engine/${engineTab}`;
            }
          }}
        />

        {activeModule === 'portal' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <MainLayout
              onSwitchToEngine={() => setActiveModule('engine')}
              onOpenEngineTab={handleOpenEngineTab}
            />
          </div>
        )}

        {activeModule === 'engine' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-main)',
              color: 'var(--text-primary)',
              minHeight: 'calc(100vh - 40px)',
            }}
          >
            <Navbar
              activeTab={engineTab}
              setActiveTab={(tab) => {
                setEngineTab(tab);
                window.location.hash = `#/engine/${tab}`;
              }}
              onSwitchToPortal={() => {
                setActiveModule('portal');
                window.location.hash = '#/candidato-perfil';
              }}
            />
            <main style={{ flex: 1, paddingBottom: '3rem' }}>
              {renderActiveEnginePage()}
            </main>
            <footer
              style={{
                borderTop: '1px solid var(--border-subtle)',
                padding: '1.25rem 1.5rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-surface)',
              }}
            >
              Q.I. Tech Matchmaker Engine v1.0.0 • TCC Ciência da Computação FECAP 2026 • Modelos 100% Locais (Whisper + Qwen3 + Multilingual-E5)
            </footer>
          </div>
        )}
      </div>
    </AppProvider>
  );
}