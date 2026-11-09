import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { PresentationBanner } from './components/layout/PresentationBanner';
import { SidebarNav } from './components/layout/SidebarNav';
import { PersonaSelectorView } from './views/PersonaSelectorView';
import { CandidateOnboardingView } from './views/CandidateOnboardingView';
import { CandidateDashboardView } from './views/CandidateDashboardView';
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
import { VitrinePlanosView } from './views/VitrinePlanosView';
import { CookieConsentModal } from './components/common/CookieConsentModal';

// Páginas Integradas do Motor de IA & Auditoria TCC
import { DashboardPage } from '../pages/DashboardPage';
import { CandidateRegistrationPage } from '../pages/CandidateRegistrationPage';
import { ProcessingMonitorPage } from '../pages/ProcessingMonitorPage';
import { CompetencyReportPage } from '../pages/CompetencyReportPage';
import { ReplicaReviewPage } from '../pages/ReplicaReviewPage';
import { JobManagementPage } from '../pages/JobManagementPage';
import { MatchingRankingPage } from '../pages/MatchingRankingPage';
import { CandidateComparisonPage } from '../pages/CandidateComparisonPage';

const CANDIDATE_ALLOWED_TABS = [
  'candidato-inicio',
  'candidato-perfil',
  'candidato-entrevista',
  'candidato-relatorio',
  'candidato-replica',
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
  'empresa-vaga-detalhe',
  'empresa-matching-ia',
  'empresa-comparacao',
  'empresa-relatorios-ia',
  'vitrine-planos'
];

const ADMIN_ALLOWED_TABS = [
  'admin-dashboard',
  'admin-motor-ia',
  'admin-monitor',
  'admin-revisoes',
  'admin-laboratorio',
  'vitrine-planos'
];

export const MainLayout: React.FC = () => {
  const { activePersona, isAuthenticated, session, currentUser, needsOnboarding } = useApp();
  
  const [currentTab, setCurrentTabState] = useState<string>('candidato-perfil');
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>('vac-frontend-pleno');
  const [routeNotice, setRouteNotice] = useState<string>('');

  // Estados compartilhados de navegação do Motor IA
  const [targetReportId, setTargetReportId] = useState<string | undefined>(undefined);
  const [targetJobId, setTargetJobId] = useState<string | undefined>(undefined);
  const [targetSkillId, setTargetSkillId] = useState<string | undefined>(undefined);
  const [targetCandidateIds, setTargetCandidateIds] = useState<string[]>([]);

  // Sub-abas nas visões consolidadas de Admin
  const [adminReviewSubTab, setAdminReviewSubTab] = useState<'reports' | 'replicas'>('reports');
  const [adminLabSubTab, setAdminLabSubTab] = useState<'candidates' | 'jobs'>('candidates');

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
    return 'candidato-inicio';
  };

  const isTabAllowedForRole = (tab: string): boolean => {

    const role = session?.role || currentUser?.role;
    if (role === 'empresa' || activePersona === 'empresa-orion') {
      return COMPANY_ALLOWED_TABS.includes(tab);
    }
    if (role === 'admin' || activePersona === 'admin-qitech') {
      return ADMIN_ALLOWED_TABS.includes(tab);
    }
    if (role === 'profissional' || activePersona === 'candidato-lucas' || activePersona === 'candidato-marina' || activePersona === 'comunidade-rafael') {
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

  if (needsOnboarding) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-background qi-portal-container">
        <Header currentViewTitle="Onboarding do Profissional" />
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 py-6">
          <CandidateOnboardingView
            onComplete={() => {
              setCurrentTabState('candidato-perfil');
              window.location.hash = '#/candidato-perfil';
            }}
          />
        </main>
        <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground">
          <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Q.I. Match — Ecossistema Unificado de Recrutamento Invertido, Comunidade & Motor IA</span>
            <span className="text-[11px]">Proteção de Dados, Double Opt-In e Direito de Réplica (Art. 20 LGPD)</span>
          </div>
        </footer>
      </div>
    );
  }

  const safeTab = isTabAllowedForRole(currentTab) ? currentTab : getDefaultTabForCurrentUser();

  const getTitle = () => {
    switch (safeTab) {
      case 'candidato-inicio': return 'Painel do Candidato';
      case 'candidato-perfil': return 'Meu Perfil Profissional';
      case 'candidato-entrevista': return 'Entrevista de Competências';
      case 'candidato-relatorio': return 'Relatório de Competências';
      case 'candidato-replica': return 'Solicitar Revisão de Avaliação (Art. 20 LGPD)';
      case 'candidato-vagas': return 'Oportunidades Compatíveis';
      case 'candidato-processos': return 'Meus Processos Seletivos';
      case 'candidato-estalecas': return 'Indicações & Estalecas Q.I.';
      case 'empresa-vagas': return 'Painel da Empresa & Vagas';
      case 'empresa-shortlist': return 'Talentos & Shortlist';
      case 'empresa-vaga-detalhe': return 'Gestão da Vaga & Candidatos';
      case 'empresa-matching-ia': return 'Análise de Compatibilidade (5 Dimensões)';
      case 'empresa-comparacao': return 'Comparador de Perfis Lado a Lado';
      case 'empresa-relatorios-ia': return 'Evidências e Laudos de Avaliação';
      case 'comunidade-feed': return 'Comunidade Técnica';
      case 'comunidade-rede': return 'Rede de Conexões';
      case 'comunidade-ajuda': return 'Ajuda & Mentoria';
      case 'admin-dashboard': return 'Governança & Parâmetros Comerciais';
      case 'admin-motor-ia': return 'Laboratório de Testes do TCC';
      case 'admin-monitor': return 'Trilha de Auditoria e Pipeline';
      case 'admin-revisoes': return 'Fila de Revisão de Avaliações';
      case 'admin-laboratorio': return 'Catálogo de Dados e APIs';
      case 'vitrine-planos': return 'Gestão de Planos & Slots B2B';
      default: return 'Q.I. Match';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background qi-portal-container">
      <Header currentViewTitle={getTitle()} />
      <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-4rem)]">
        <SidebarNav currentTab={safeTab} setCurrentTab={setCurrentTab} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1440px] mx-auto">
            {/* ==================== ROTAS PERFIL CANDIDATO ==================== */}
            {safeTab === 'candidato-inicio' && <CandidateDashboardView onNavigateToTab={setCurrentTab} />}
            {safeTab === 'candidato-perfil' && <CandidateProfileView />}
            {safeTab === 'candidato-entrevista' && (
              <CandidateInterviewView
                onNavigateToReport={(repId) => {
                  if (repId) setTargetReportId(repId);
                  setCurrentTab('candidato-relatorio');
                }}
                onNavigateToReplica={(repId) => {
                  if (repId) setTargetReportId(repId);
                  setCurrentTab('candidato-replica');
                }}
              />
            )}
            {safeTab === 'candidato-relatorio' && (
              <CompetencyReportPage
                initialReportId={targetReportId}
                onNavigateToReplica={(repId, skId) => {
                  setTargetReportId(repId);
                  setTargetSkillId(skId);
                  setCurrentTab('candidato-replica');
                }}
              />
            )}
            {safeTab === 'candidato-replica' && (
              <ReplicaReviewPage
                initialReportId={targetReportId}
                initialSkillId={targetSkillId}
              />
            )}
            {safeTab === 'candidato-vagas' && (
              <CandidateOpportunitiesView
                onNavigateToProcess={() => setCurrentTab('candidato-processos')}
                onNavigateToReport={() => setCurrentTab('candidato-relatorio')}
              />
            )}
            {safeTab === 'candidato-processos' && <CandidateApplicationsView />}
            {safeTab === 'candidato-estalecas' && <CandidateRewardsView />}

            {/* ==================== ROTAS PERFIL EMPRESA B2B ==================== */}
            {safeTab === 'empresa-vagas' && (
              <CompanyDashboardView
                onSelectVacancy={(id) => {
                  setSelectedVacancyId(id);
                  setCurrentTab('empresa-vaga-detalhe');
                }}
                onOpenMatchingIa={(jobId) => {
                  if (jobId) setTargetJobId(jobId);
                  setCurrentTab('empresa-matching-ia');
                }}
                onOpenComparison={(jobId) => {
                  if (jobId) setTargetJobId(jobId);
                  setCurrentTab('empresa-comparacao');
                }}
              />
            )}
            {(safeTab === 'empresa-shortlist' || safeTab === 'empresa-vaga-detalhe') && (
              <CompanyVacancyDetailView
                vacancyId={selectedVacancyId || 'vac-frontend-pleno'}
                onBack={() => setCurrentTab('empresa-vagas')}
                onOpenMatchingIa={() => setCurrentTab('empresa-matching-ia')}
                onOpenComparison={() => setCurrentTab('empresa-comparacao')}
                onOpenCandidateReport={() => setCurrentTab('empresa-relatorios-ia')}
              />
            )}
            {safeTab === 'empresa-matching-ia' && (
              <MatchingRankingPage
                initialJobId={targetJobId}
                onNavigateToComparison={(jobId, candIds) => {
                  setTargetJobId(jobId);
                  setTargetCandidateIds(candIds);
                  setCurrentTab('empresa-comparacao');
                }}
                onNavigateToReport={(repId) => {
                  setTargetReportId(repId);
                  setCurrentTab('empresa-relatorios-ia');
                }}
              />
            )}
            {safeTab === 'empresa-comparacao' && (
              <CandidateComparisonPage
                initialJobId={targetJobId}
                initialCandidateIds={targetCandidateIds}
                onBackToMatching={(jobId) => {
                  setTargetJobId(jobId);
                  setCurrentTab('empresa-matching-ia');
                }}
              />
            )}
            {safeTab === 'empresa-relatorios-ia' && (
              <CompetencyReportPage
                initialReportId={targetReportId}
                onNavigateToReplica={(repId, skId) => {
                  setTargetReportId(repId);
                  setTargetSkillId(skId);
                }}
              />
            )}

            {/* ==================== ROTAS COMUNIDADE TÉCNICA ==================== */}
            {safeTab === 'comunidade-feed' && <CommunityFeedView />}
            {safeTab === 'comunidade-rede' && <CommunityNetworkView />}
            {safeTab === 'comunidade-ajuda' && <CommunityHelperView />}

            {/* ==================== ROTAS PERFIL ADMIN & BANCA TCC ==================== */}
            {safeTab === 'admin-dashboard' && <AdminDashboardView />}
            {safeTab === 'admin-motor-ia' && (
              <DashboardPage
                onNavigate={(engineTarget) => {
                  if (engineTarget === 'reports') {
                    setAdminReviewSubTab('reports');
                    setCurrentTab('admin-revisoes');
                  } else if (engineTarget === 'replica') {
                    setAdminReviewSubTab('replicas');
                    setCurrentTab('admin-revisoes');
                  } else if (engineTarget === 'monitor') {
                    setCurrentTab('admin-monitor');
                  } else if (engineTarget === 'candidates') {
                    setAdminLabSubTab('candidates');
                    setCurrentTab('admin-laboratorio');
                  } else if (engineTarget === 'jobs' || engineTarget === 'matching') {
                    setAdminLabSubTab('jobs');
                    setCurrentTab('admin-laboratorio');
                  }
                }}
              />
            )}
            {safeTab === 'admin-monitor' && <ProcessingMonitorPage />}
            {safeTab === 'admin-revisoes' && (
              <div className="space-y-4">
                <div className="bg-card p-3.5 rounded-base border border-border shadow-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdminReviewSubTab('reports')}
                      className={`px-3.5 py-1.5 rounded-base text-xs font-bold transition-all ${
                        adminReviewSubTab === 'reports'
                          ? 'bg-primary text-white'
                          : 'bg-background text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Inspeção de Relatórios Consolidados (5 Estados Epistêmicos)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminReviewSubTab('replicas')}
                      className={`px-3.5 py-1.5 rounded-base text-xs font-bold transition-all ${
                        adminReviewSubTab === 'replicas'
                          ? 'bg-primary text-white'
                          : 'bg-background text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Revisão Humana de Réplicas (Versionamento v1 → v2)
                    </button>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Conformidade Art. 20 LGPD • Auditoria Humana
                  </span>
                </div>

                {adminReviewSubTab === 'reports' ? (
                  <CompetencyReportPage
                    initialReportId={targetReportId}
                    onNavigateToReplica={(repId, skId) => {
                      setTargetReportId(repId);
                      setTargetSkillId(skId);
                      setAdminReviewSubTab('replicas');
                    }}
                  />
                ) : (
                  <ReplicaReviewPage
                    initialReportId={targetReportId}
                    initialSkillId={targetSkillId}
                  />
                )}
              </div>
            )}
            {safeTab === 'vitrine-planos' && (
              <VitrinePlanosView
                onNavigateToDev={() => setCurrentTab('candidato-perfil')}
                onNavigateToCompany={() => setCurrentTab('empresa-vagas')}
              />
            )}
            {safeTab === 'admin-laboratorio' && (
              <div className="space-y-4">
                <div className="bg-card p-3.5 rounded-base border border-border shadow-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdminLabSubTab('candidates')}
                      className={`px-3.5 py-1.5 rounded-base text-xs font-bold transition-all ${
                        adminLabSubTab === 'candidates'
                          ? 'bg-primary text-white'
                          : 'bg-background text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Cadastro de Candidatos na Base SQLite
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminLabSubTab('jobs')}
                      className={`px-3.5 py-1.5 rounded-base text-xs font-bold transition-all ${
                        adminLabSubTab === 'jobs'
                          ? 'bg-primary text-white'
                          : 'bg-background text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Cadastro de Vagas & Pesos Algorítmicos
                    </button>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Persistência Direta via FastAPI REST (`/api/v1`)
                  </span>
                </div>

                {adminLabSubTab === 'candidates' ? (
                  <CandidateRegistrationPage />
                ) : (
                  <JobManagementPage
                    onNavigateToMatching={(jobId) => {
                      setTargetJobId(jobId);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Q.I. Match — Ecossistema Unificado: Recrutamento Invertido, Comunidade & Motor de IA Local (TCC FECAP)</span>
          <span className="text-[11px]">Faster-Whisper (int8) • Qwen3 + EvidenceVerifier • Multilingual-E5 • LGPD Double Opt-In & Art. 20</span>
        </div>
      </footer>
      <CookieConsentModal />
    </div>
  );
};

export function PortalApp() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default PortalApp;
