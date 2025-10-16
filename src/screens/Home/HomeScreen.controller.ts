// src/screens/Home/HomeScreen.controller.ts
import { useEffect } from 'react';
import { useReportes } from '../../context/ReportesContext';
import { useAuth } from '../../context/AuthContext';

export const useHomeController = () => {
  const { reportes, loading, error, currentPage, totalPages, cargarReportes, nextPage, prevPage } = useReportes();
  const { usuario } = useAuth();

  useEffect(() => {
    // Cargar reportes solo si el usuario está autenticado
    if (usuario?.id) {
      cargarReportes(usuario.id, 0);
    }
  }, [usuario?.id]); // Solo depender de usuario.id, no de cargarReportes

  const recargarReportes = () => {
    // Recargar la página actual
    if (usuario?.id) {
      cargarReportes(usuario.id, currentPage);
    }
  };

  const siguientePagina = () => {
    if (usuario?.id) {
      nextPage(usuario.id);
    }
  };

  const paginaAnterior = () => {
    if (usuario?.id) {
      prevPage(usuario.id);
    }
  };

  return {
    reportes,
    loading,
    error,
    currentPage,
    totalPages,
    cargarReportes: recargarReportes,
    nextPage: siguientePagina,
    prevPage: paginaAnterior,
  };
};
