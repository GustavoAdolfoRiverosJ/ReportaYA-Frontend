// App.tsx
import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import AppNavigator from './src/navigation/AppNavigator';
import { ReportesProvider } from './src/context/ReportesContext';
import { AuthProvider } from './src/context/AuthContext';
import { OperadorReportesProvider } from './src/context/OperadorReportesContext';
import { TecnicosProvider } from './src/context/TecnicosContext';
import { TecnicoReportesProvider } from './src/context/TecnicoReportesContext';
import { HistorialProvider } from './src/context/HistorialContext';
import CustomToast from './src/components/CustomToast';

const App = () => {
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setToast({
        visible: true,
        message: remoteMessage.notification?.body || 'Tienes un nuevo mensaje',
        type: 'info'
      });
    });

    return unsubscribe;
  }, []);

  return (
    <AuthProvider>
      <ReportesProvider>
        <OperadorReportesProvider>
          <TecnicosProvider>
            <TecnicoReportesProvider>
              <HistorialProvider>
                <AppNavigator />
                <CustomToast
                  visible={toast.visible}
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast(prev => ({ ...prev, visible: false }))}
                />
              </HistorialProvider>
            </TecnicoReportesProvider>
          </TecnicosProvider>
        </OperadorReportesProvider>
      </ReportesProvider>
    </AuthProvider>
  );
};

export default App;