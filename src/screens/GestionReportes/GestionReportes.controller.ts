// src/screens/GestionReportes/GestionReportes.controller.ts
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useOperadorReportes } from '../../context/OperadorReportesContext';

export const useGestionReportesController = () => {
  const {
    reportes,
    loading,
    error,
    currentPage,
    totalPages,
    filtroEstado,
    setFiltroEstado,
    cargarReportes,
    nextPage,
    prevPage,
    cambiarEstadoARevision,
    rechazarReporte,
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
    filtroEstado,
    setFiltroEstado,
    cargarReportes: () => cargarReportes(0),
    recargarPaginaActual: () => cargarReportes(currentPage), // Para recargar la página actual
    nextPage,
    prevPage,
    cambiarEstadoARevision,
    rechazarReporte,
    asignarTecnico,
  };
};
