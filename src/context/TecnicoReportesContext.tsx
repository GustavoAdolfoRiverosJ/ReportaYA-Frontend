// src/context/TecnicoReportesContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ServicioTecnicos from '../servicios/ServicioTecnicos';
import { ReporteResponse, Page, EstadoReporteType } from '../types';
import { useAuth } from './AuthContext';

interface TecnicoReportesContextType {
  reportes: ReporteResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filtroEstado: EstadoReporteType | null;
  setFiltroEstado: (estado: EstadoReporteType | null) => void;
  cargarReportes: (page?: number, estadoParam?: EstadoReporteType | null) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  limpiarReportes: () => void;
}

const TecnicoReportesContext = createContext<TecnicoReportesContextType | undefined>(undefined);

export const TecnicoReportesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();
  const [reportes, setReportes] = useState<ReporteResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filtroEstado, setFiltroEstadoState] = useState<EstadoReporteType | null>(null);

  const cargarReportes = useCallback(async (page: number = 0, estadoParam?: EstadoReporteType | null) => {
    try {
      setLoading(true);
      setError(null);

      if (!usuario || !usuario.id) {
        throw new Error('Usuario no autenticado');
      }

      // Usar el parámetro si se proporciona, sino usar el estado global
      const estado = (estadoParam !== undefined ? estadoParam : filtroEstado) || undefined;
      const pageData: Page<ReporteResponse> = await ServicioTecnicos.obtenerReportesAsignados(
        usuario.id,
        estado,
        page
      );

      setReportes(pageData.content);
      setCurrentPage(page);
      setTotalPages(pageData.totalPages);
      console.log('Técnico - Reportes cargados:', pageData.totalPages, 'páginas, página actual:', pageData.number, 'reportes en esta página:', pageData.content.length, 'filtro:', estado);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los reportes asignados');
      console.error('Error en TecnicoReportesContext:', err);
    } finally {
      setLoading(false);
    }
  }, [usuario, filtroEstado]);

  const setFiltroEstado = useCallback((estado: EstadoReporteType | null) => {
    setFiltroEstadoState(estado);
    // Cargar inmediatamente con el nuevo filtro
    if (!usuario || !usuario.id) return;

    setLoading(true);
    ServicioTecnicos.obtenerReportesAsignados(usuario.id, estado || undefined, 0)
      .then((pageData) => {
        setReportes(pageData.content);
        setCurrentPage(0);
        setTotalPages(pageData.totalPages);
        console.log('Técnico - Filtro cambiado a:', estado, 'Total reportes:', pageData.content.length);
      })
      .catch((err: any) => {
        setError(err.message || 'Error al cargar los reportes');
        console.error('Error al cambiar filtro:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [usuario]);

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

  const limpiarReportes = useCallback(() => {
    setReportes([]);
    setCurrentPage(0);
    setTotalPages(0);
    setFiltroEstadoState(null);
    setError(null);
  }, []);

  return (
    <TecnicoReportesContext.Provider
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
        limpiarReportes,
      }}
    >
      {children}
    </TecnicoReportesContext.Provider>
  );
};

export const useTecnicoReportes = () => {
  const context = useContext(TecnicoReportesContext);
  if (!context) {
    throw new Error('useTecnicoReportes debe usarse dentro de un TecnicoReportesProvider');
  }
  return context;
};
