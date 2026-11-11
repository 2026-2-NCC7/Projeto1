import React from 'react';
import { AppProvider } from './portal/context/AppContext';
import { MainLayout } from './portal/App';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ErrorBoundary>
          <MainLayout />
        </ErrorBoundary>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
