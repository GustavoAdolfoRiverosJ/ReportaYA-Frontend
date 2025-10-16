// App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ReportesProvider } from './src/context/ReportesContext';
import { AuthProvider } from './src/context/AuthContext';
import { OperadorReportesProvider } from './src/context/OperadorReportesContext';
import { TecnicosProvider } from './src/context/TecnicosContext';

const App = () => {
  return (
    <AuthProvider>
      <ReportesProvider>
        <OperadorReportesProvider>
          <TecnicosProvider>
            <AppNavigator />
          </TecnicosProvider>
        </OperadorReportesProvider>
      </ReportesProvider>
    </AuthProvider>
  );
};

export default App;