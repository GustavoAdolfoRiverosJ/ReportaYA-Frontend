// src/context/ReportesContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ServicioReportes from '../servicios/ServicioReportes';
import { ReporteResponse } from '../types';

interface ReportesContextType {
  reportes: ReporteResponse[];
  loading: boolean;
  error: string | null;
  cargarReportes: (cuentaId: number, forzarRecarga?: boolean) => Promise<void>;
  agregarReporte: (reporte: ReporteResponse) => void;
  actualizarReporte: (reporte: ReporteResponse) => void;
  limpiarReportes: () => void;
}

const ReportesContext = createContext<ReportesContextType | undefined>(undefined);

export const ReportesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reportes, setReportes] = useState<ReporteResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cargaInicial, setCargaInicial] = useState<boolean>(false);

  const cargarReportes = useCallback(async (cuentaId: number, forzarRecarga: boolean = false) => {
    // Si ya cargamos antes y no se fuerza la recarga, no hacer nada
    if (cargaInicial && !forzarRecarga) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ServicioReportes.obtenerReportesPorCuenta(cuentaId);
      setReportes(data);
      setCargaInicial(true);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los reportes');
      console.error('Error en ReportesContext:', err);
    } finally {
      setLoading(false);
    }
  }, [cargaInicial]);

  const agregarReporte = useCallback((reporte: ReporteResponse) => {
    setReportes(prev => [reporte, ...prev]);
  }, []);

  const actualizarReporte = useCallback((reporteActualizado: ReporteResponse) => {
    setReportes(prev => 
      prev.map(r => r.id === reporteActualizado.id ? reporteActualizado : r)
    );
  }, []);

  const limpiarReportes = useCallback(() => {
    setReportes([]);
    setCargaInicial(false);
    setError(null);
  }, []);

  return (
    <ReportesContext.Provider 
      value={{ 
        reportes, 
        loading, 
        error, 
        cargarReportes, 
        agregarReporte, 
        actualizarReporte,
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
