// src/context/OperadorReportesContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ServicioReportes from '../servicios/ServicioReportes';
import { ReporteResponse, Page, EstadoReporteType } from '../types';

interface OperadorReportesContextType {
  reportes: ReporteResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filtroEstado: EstadoReporteType | null;
  setFiltroEstado: (estado: EstadoReporteType | null) => void;
  cargarReportes: (page?: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  cambiarEstadoARevision: (reporteId: number) => Promise<void>;
  rechazarReporte: (reporteId: number, motivo: string) => Promise<void>;
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
  const [filtroEstado, setFiltroEstadoState] = useState<EstadoReporteType | null>(null);

  const cargarReportes = useCallback(async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      // Si hay filtro, usarlo
      const estado = filtroEstado || undefined;
      const pageData: Page<ReporteResponse> = await ServicioReportes.obtenerTodosReportes(page, estado);

      setReportes(pageData.content);
      setCurrentPage(page);
      setTotalPages(pageData.totalPages);
      console.log('Operador totalPages:', pageData.totalPages, 'currentPage:', pageData.number, 'content length:', pageData.content.length, 'filtro:', estado);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los reportes');
      console.error('Error en OperadorReportesContext:', err);
    } finally {
      setLoading(false);
    }
  }, [filtroEstado]);

  const setFiltroEstado = useCallback((estado: EstadoReporteType | null) => {
    setFiltroEstadoState(estado);
    // Al cambiar filtro, recargar desde página 0
    // Nota: cargarReportes depende de filtroEstado, pero aquí estamos actualizando el estado.
    // Necesitamos un useEffect o llamar a cargarReportes después de que el estado se actualice.
    // Sin embargo, como cargarReportes usa el valor del estado, y setState es async, mejor pasar el valor directamente o usar useEffect.
    // Para simplificar, usaremos un useEffect en el componente o aquí.
    // Mejor opción: useEffect que escuche cambios en filtroEstado.
  }, []);

  // Efecto para recargar cuando cambia el filtro
  React.useEffect(() => {
    cargarReportes(0);
  }, [filtroEstado]);

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
      await ServicioReportes.cambiarEstadoReporte(reporteId, 'REVISION');
      await cargarReportes(currentPage);
    } catch (err: any) {
      setError(err.message || 'Error al cambiar estado del reporte');
    } finally {
      setLoading(false);
    }
  }, [currentPage, cargarReportes]);

  const rechazarReporte = useCallback(async (reporteId: number, motivo: string) => {
    try {
      setLoading(true);
      await ServicioReportes.rechazarReporte(reporteId, motivo);
      await cargarReportes(currentPage);
    } catch (err: any) {
      setError(err.message || 'Error al rechazar reporte');
    } finally {
      setLoading(false);
    }
  }, [currentPage, cargarReportes]);

  const actualizarEstadoReporte = useCallback((reporteId: number, nuevoEstado: string) => {
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
    setFiltroEstadoState(null);
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
        filtroEstado,
        setFiltroEstado,
        cargarReportes,
        nextPage,
        prevPage,
        cambiarEstadoARevision,
        rechazarReporte,
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