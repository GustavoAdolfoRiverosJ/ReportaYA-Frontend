// src/context/ReportesContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ServicioReportes from '../servicios/ServicioReportes';
import { ReporteResponse, Page } from '../types';

interface ReportesContextType {
  reportes: ReporteResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  cargarReportes: (cuentaId: number, page?: number) => Promise<void>;
  nextPage: (cuentaId: number) => Promise<void>;
  prevPage: (cuentaId: number) => Promise<void>;
  agregarReporte: (reporte: ReporteResponse) => void;
  actualizarReporte: (reporte: ReporteResponse) => void;
  actualizarEstadoReporte: (reporteId: number, nuevoEstado: string) => void;
  limpiarReportes: () => void;
}

const ReportesContext = createContext<ReportesContextType | undefined>(undefined);

export const ReportesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reportes, setReportes] = useState<ReporteResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const cargarReportes = useCallback(async (cuentaId: number, page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      const pageData: Page<ReporteResponse> = await ServicioReportes.obtenerReportesPorCuenta(cuentaId, page);
      setReportes(pageData.content);
      setCurrentPage(page); // Usar la página solicitada, no la que devuelve la API
      setTotalPages(pageData.totalPages);
      console.log('Home totalPages:', pageData.totalPages, 'currentPage:', pageData.number, 'content length:', pageData.content.length);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los reportes');
      console.error('Error en ReportesContext:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextPage = useCallback(async (cuentaId: number) => {
    if (currentPage < totalPages - 1 && !loading) {
      await cargarReportes(cuentaId, currentPage + 1);
    }
  }, [currentPage, totalPages, loading, cargarReportes]);

  const prevPage = useCallback(async (cuentaId: number) => {
    if (currentPage > 0 && !loading) {
      await cargarReportes(cuentaId, currentPage - 1);
    }
  }, [currentPage, loading, cargarReportes]);

  const agregarReporte = useCallback((reporte: ReporteResponse) => {
    setReportes(prev => [reporte, ...prev]);
  }, []);

  const actualizarReporte = useCallback((reporteActualizado: ReporteResponse) => {
    setReportes(prev =>
      prev.map(r => r.id === reporteActualizado.id ? reporteActualizado : r)
    );
  }, []);

  const actualizarEstadoReporte = useCallback((reporteId: number, nuevoEstado: string) => {
    setReportes(prev =>
      prev.map(r => r.id === reporteId ? { ...r, estado: nuevoEstado as any } : r)
    );
  }, []);

  const limpiarReportes = useCallback(() => {
    setReportes([]);
    setCurrentPage(0);
    setTotalPages(0);
    setError(null);
  }, []);

  return (
    <ReportesContext.Provider
      value={{
        reportes,
        loading,
        error,
        currentPage,
        totalPages,
        cargarReportes,
        nextPage,
        prevPage,
        agregarReporte,
        actualizarReporte,
        actualizarEstadoReporte,
        limpiarReportes
      }}
    >
      {children}
    </ReportesContext.Provider>
  );
};

export const useReportes = () => {
  const context = useContext(ReportesContext);
  if (!context) {
    throw new Error('useReportes debe usarse dentro de un ReportesProvider');
  }
  return context;
};