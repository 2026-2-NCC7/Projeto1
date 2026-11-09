import React from 'react';
import { AppProvider } from './portal/context/AppContext';
import { MainLayout } from './portal/App';

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
