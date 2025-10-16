// App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ReportesProvider } from './src/context/ReportesContext';

const App = () => {
  return (
    <ReportesProvider>
      <AppNavigator />
    </ReportesProvider>
  );
};

export default App;