import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ServicioReportes from '../servicios/ServicioReportes';
import { HistorialEstado } from '../types/historial.types';

interface HistorialContextType {
  historial: Record<number, HistorialEstado[]>; // Cache: reporteId -> Historial
  loading: boolean;
  error: string | null;
  cargarHistorial: (reporteId: number) => Promise<void>;
  limpiarHistorial: () => void;
}

const HistorialContext = createContext<HistorialContextType | undefined>(undefined);

export const HistorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [historial, setHistorial] = useState<Record<number, HistorialEstado[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarHistorial = useCallback(async (reporteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ServicioReportes.obtenerHistorialEstados(reporteId);
      // Ordenar por fecha descendente (más reciente primero)
      const sortedData = data.sort((a: HistorialEstado, b: HistorialEstado) => 
        new Date(b.fechaCambio).getTime() - new Date(a.fechaCambio).getTime()
      );
      
      setHistorial(prev => ({
        ...prev,
        [reporteId]: sortedData
      }));
    } catch (err: any) {
      setError(err.message || 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarHistorial = useCallback(() => {
    setHistorial({});
    setError(null);
  }, []);

  return (
    <HistorialContext.Provider value={{ historial, loading, error, cargarHistorial, limpiarHistorial }}>
      {children}
    </HistorialContext.Provider>
  );
};

export const useHistorial = () => {
  const context = useContext(HistorialContext);
  if (!context) {
    throw new Error('useHistorial debe usarse dentro de un HistorialProvider');
  }
  return context;
};
