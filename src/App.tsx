import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { SidebarNav } from './components/layout/SidebarNav';

// Views
import { PersonaSelectorView } from './views/PersonaSelectorView';
import { CandidateProfileView } from './views/CandidateProfileView';
import { CandidateInterviewView } from './views/CandidateInterviewView';
import { CandidateOpportunitiesView } from './views/CandidateOpportunitiesView';
import { CandidateApplicationsView } from './views/CandidateApplicationsView';
import { CompanyDashboardView } from './views/CompanyDashboardView';
import { CompanyVacancyDetailView } from './views/CompanyVacancyDetailView';
import { CommunityFeedView } from './views/CommunityFeedView';
import { CommunityNetworkView } from './views/CommunityNetworkView';
import { CommunityHelperView } from './views/CommunityHelperView';
import { AdminDashboardView } from './views/AdminDashboardView';

const MainLayout: React.FC = () => {
  const { activePersona, isAuthenticated } = useApp();
  
  const [currentTab, setCurrentTab] = useState<string>('candidato-perfil');
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>('vac-frontend-pleno');

  React.useEffect(() => {
    if (activePersona === 'candidato-lucas' || activePersona === 'candidato-marina') {
      setCurrentTab('candidato-perfil');
    } else if (activePersona === 'empresa-orion') {
      setCurrentTab('empresa-vagas');
    } else if (activePersona === 'comunidade-rafael') {
      setCurrentTab('comunidade-feed');
    } else if (activePersona === 'admin-qitech') {
      setCurrentTab('admin-dashboard');
    }
  }, [activePersona]);

  if (!isAuthenticated) {
    return <PersonaSelectorView onEnterApp={() => {}} />;
  }

  const getTitle = () => {
    switch (currentTab) {
      case 'candidato-perfil': return 'Meu Perfil Técnico';
      case 'candidato-entrevista': return 'Entrevista IA (Soft Skills)';
      case 'candidato-vagas': return 'Vagas Compatíveis';
      case 'candidato-processos': return 'Processos & Estalecas Q.I.';
      case 'empresa-vagas': return 'Painel Corporativo & Faturamento';
      case 'empresa-shortlist': return 'Match Express & Shortlists';
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
          <SidebarNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

          {/* Área de Conteúdo Central */}
          <div className="flex-1 min-w-0">
            {currentTab === 'candidato-perfil' && <CandidateProfileView />}
            {currentTab === 'candidato-entrevista' && <CandidateInterviewView />}
            {currentTab === 'candidato-vagas' && (
              <CandidateOpportunitiesView onNavigateToProcess={() => setCurrentTab('candidato-processos')} />
            )}
            {currentTab === 'candidato-processos' && <CandidateApplicationsView />}
            
            {currentTab === 'empresa-vagas' && (
              <CompanyDashboardView 
                onSelectVacancy={(id) => {
                  setSelectedVacancyId(id);
                  setCurrentTab('empresa-vaga-detalhe');
                }} 
              />
            )}
            {currentTab === 'empresa-shortlist' && (
              <CompanyVacancyDetailView 
                vacancyId="vac-frontend-pleno" 
                onBack={() => setCurrentTab('empresa-vagas')} 
              />
            )}
            {currentTab === 'empresa-vaga-detalhe' && (
              <CompanyVacancyDetailView 
                vacancyId={selectedVacancyId} 
                onBack={() => setCurrentTab('empresa-vagas')} 
              />
            )}

            {currentTab === 'comunidade-feed' && <CommunityFeedView />}
            {currentTab === 'comunidade-rede' && <CommunityNetworkView />}
            {currentTab === 'comunidade-ajuda' && <CommunityHelperView />}
            {currentTab === 'admin-dashboard' && <AdminDashboardView />}
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