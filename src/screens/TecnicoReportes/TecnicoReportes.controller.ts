// src/screens/TecnicoReportes/TecnicoReportes.controller.ts
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTecnicoReportes } from '../../context/TecnicoReportesContext';

export const useTecnicoReportesController = () => {
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
  } = useTecnicoReportes();
  
  const navigation = useNavigation();

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
    recargarPaginaActual: () => cargarReportes(currentPage),
    nextPage,
    prevPage,
  };
};
