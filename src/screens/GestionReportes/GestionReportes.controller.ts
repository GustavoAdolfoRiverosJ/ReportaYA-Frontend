// src/screens/GestionReportes/GestionReportes.controller.ts
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useOperadorReportes } from '../../context/OperadorReportesContext';
import { useTecnicos } from '../../context/TecnicosContext';

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
  const { cargarTecnicos } = useTecnicos();

  const asignarTecnico = async (reporteId: number) => {
    console.log('NAV: prefetch técnicos y navegar a AsignacionTecnicos con reporteId=', reporteId);
    try {
      // Prefetch técnicos en background para mejorar UX
      await cargarTecnicos(0);
    } catch (err) {
      console.warn('Prefetch técnicos falló, navegando de todas formas', err);
    }
    (navigation as any).navigate('AsignacionTecnicos', { reporteId }); // navegación definida en AppNavigator -> Stack.Screen name="AsignacionTecnicos"
  };

  const auditarReporte = (reporteId: number) => {
    console.log('NAV: Navegando a AuditarReporte con reporteId=', reporteId);
    (navigation as any).navigate('AuditarReporte', { reporteId });
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
    auditarReporte,
  };
};
