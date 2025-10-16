// src/context/OperadorReportesContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ServicioReportes from '../servicios/ServicioReportes';
import { ReporteResponse, Page } from '../types';

interface OperadorReportesContextType {
  reportes: ReporteResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  cargarReportes: (page?: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  cambiarEstadoARevision: (reporteId: number) => Promise<void>;
  actualizarEstadoReporte: (reporteId: number, nuevoEstado: string) => void;
  limpiarReportes: () => void;
}

const OperadorReportesContext = createContext<OperadorReportesContextType | undefined>(undefined);

export const OperadorReportesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reportes, setReportes] = useState<ReporteResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pagesCache, setPagesCache] = useState<Map<number, ReporteResponse[]>>(new Map());

  const cargarReportes = useCallback(async (page: number = 0) => {
    // Verificar si la página ya está en cache
    if (pagesCache.has(page)) {
      setReportes(pagesCache.get(page)!);
      setCurrentPage(page);
      console.log('Cargado desde cache - page:', page);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const pageData: Page<ReporteResponse> = await ServicioReportes.obtenerTodosReportes(page);

      // Guardar en cache
      setPagesCache(prev => new Map(prev.set(page, pageData.content)));

      setReportes(pageData.content);
      setCurrentPage(page); // Usar la página solicitada, no la que devuelve la API
      setTotalPages(pageData.totalPages);
      console.log('Operador totalPages:', pageData.totalPages, 'currentPage:', pageData.number, 'content length:', pageData.content.length);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los reportes');
      console.error('Error en OperadorReportesContext:', err);
    } finally {
      setLoading(false);
    }
  }, [pagesCache]);

  const nextPage = useCallback(async () => {
    if (currentPage < totalPages - 1 && !loading) {
      await cargarReportes(currentPage + 1);
    }
  }, [currentPage, totalPages, loading, cargarReportes]);

  const prevPage = useCallback(async () => {
    if (currentPage > 0 && !loading) {
      await cargarReportes(currentPage - 1);
    }
  }, [currentPage, loading, cargarReportes]);

  const cambiarEstadoARevision = useCallback(async (reporteId: number) => {
    try {
      setLoading(true);
      await ServicioReportes.cambiarEstadoReporte(reporteId, 'REVISION' as any);

      // Actualizar en todas las páginas del cache
      setPagesCache(prev => {
        const newCache = new Map(prev);
        for (const [page, reports] of newCache) {
          const updatedReports = reports.map(reporte =>
            reporte.id === reporteId
              ? { ...reporte, estado: 'REVISION' as any }
              : reporte
          );
          newCache.set(page, updatedReports);
        }
        return newCache;
      });

      // Actualizar el estado actual
      setReportes(prev =>
        prev.map(reporte =>
          reporte.id === reporteId
            ? { ...reporte, estado: 'REVISION' as any }
            : reporte
        )
      );
    } catch (err: any) {
      setError(err.message || 'Error al cambiar estado del reporte');
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarEstadoReporte = useCallback((reporteId: number, nuevoEstado: string) => {
    // Actualizar en todas las páginas del cache
    setPagesCache(prev => {
      const newCache = new Map(prev);
      for (const [page, reports] of newCache) {
        const updatedReports = reports.map(reporte =>
          reporte.id === reporteId
            ? { ...reporte, estado: nuevoEstado as any }
            : reporte
        );
        newCache.set(page, updatedReports);
      }
      return newCache;
    });

    // Actualizar el estado actual si está en la página actual
    setReportes(prev =>
      prev.map(reporte =>
        reporte.id === reporteId
          ? { ...reporte, estado: nuevoEstado as any }
          : reporte
      )
    );
  }, []);

  const limpiarReportes = useCallback(() => {
    setReportes([]);
    setCurrentPage(0);
    setTotalPages(0);
    setPagesCache(new Map());
    setError(null);
  }, []);

  return (
    <OperadorReportesContext.Provider
      value={{
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
        limpiarReportes
      }}
    >
      {children}
    </OperadorReportesContext.Provider>
  );
};

export const useOperadorReportes = () => {
  const context = useContext(OperadorReportesContext);
  if (!context) {
    throw new Error('useOperadorReportes debe usarse dentro de un OperadorReportesProvider');
  }
  return context;
};