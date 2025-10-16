// src/screens/HomeScreenOperador/HomeScreenOperador.controller.ts
import { useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useOperadorReportes } from '../../context/OperadorReportesContext';

export const useHomeScreenOperadorController = () => {
  const {
    reportes,
    loading,
    error,
    currentPage,
    totalPages,
    cargarReportes,
    nextPage,
    prevPage,
    cambiarEstadoARevision,
    actualizarEstadoReporte,
  } = useOperadorReportes();
  const navigation = useNavigation();

  const asignarTecnico = (reporteId: number) => {
    (navigation as any).navigate('AsignacionTecnicos', { reporteId });
  };

  useEffect(() => {
    cargarReportes(0);
  }, []); // Solo ejecutar una vez al montar el componente

  return {
    reportes,
    loading,
    error,
    currentPage,
    totalPages,
    cargarReportes: () => cargarReportes(0),
    recargarPaginaActual: () => cargarReportes(currentPage), // Para recargar la página actual
    nextPage,
    prevPage,
    cambiarEstadoARevision,
    asignarTecnico,
  };
};