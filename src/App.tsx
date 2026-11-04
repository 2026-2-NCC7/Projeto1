import React from 'react';
import { EcosystemTopBar } from './components/EcosystemTopBar';
import { AppProvider } from './portal/context/AppContext';
import { MainLayout } from './portal/App';

export function App() {
  return (
    <AppProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* BARRA DE STATUS DO SISTEMA UNIFICADO E ALTERNÂNCIA DE VISÃO */}
        <EcosystemTopBar />

        {/* LAYOUT ÚNICO UNIFICADO DIFERENCIADO POR PERFIL (CANDIDATO, EMPRESA, COMUNIDADE E ADMIN) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <MainLayout />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
