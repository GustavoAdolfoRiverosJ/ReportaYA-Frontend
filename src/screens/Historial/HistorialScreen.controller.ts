import { useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useHistorial } from '../../context/HistorialContext';
import { RootStackParamList } from '../../navigation/AppNavigator';

export const useHistorialController = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Historial'>>();
  const { reporteId } = route.params;
  const { historial, loading, error, cargarHistorial } = useHistorial();

  useEffect(() => {
    cargarHistorial(reporteId);
  }, [reporteId]);

  return {
    historial: historial[reporteId] || [],
    loading,
    error,
    recargar: () => cargarHistorial(reporteId)
  };
};
