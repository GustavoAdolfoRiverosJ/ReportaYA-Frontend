// src/screens/Home/HomeScreen.controller.ts
import { useEffect } from 'react';
import { useReportes } from '../../context/ReportesContext';

export const useHomeController = () => {
  const { reportes, loading, error, cargarReportes } = useReportes();

  useEffect(() => {
    // Cargar reportes solo si no están en memoria
    // ID de cuenta 1 para pruebas
    cargarReportes(1);
  }, [cargarReportes]);

  const recargarReportes = () => {
    // Forzar recarga con el segundo parámetro en true
    cargarReportes(1, true);
  };

  return {
    reportes,
    loading,
    error,
    cargarReportes: recargarReportes,
  };
};
