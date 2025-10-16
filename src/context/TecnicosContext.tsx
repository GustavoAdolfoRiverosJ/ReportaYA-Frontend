// src/context/TecnicosContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ServicioTecnicos from '../servicios/ServicioTecnicos';
import { TecnicoResponse, Page } from '../types';

interface TecnicosContextType {
  tecnicos: TecnicoResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  cargarTecnicos: (page?: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  limpiarTecnicos: () => void;
}

const TecnicosContext = createContext<TecnicosContextType | undefined>(undefined);

export const TecnicosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tecnicos, setTecnicos] = useState<TecnicoResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pagesCache, setPagesCache] = useState<Map<number, TecnicoResponse[]>>(new Map());

  const cargarTecnicos = useCallback(async (page: number = 0) => {
    // Verificar si la página ya está en cache
    if (pagesCache.has(page)) {
      setTecnicos(pagesCache.get(page)!);
      setCurrentPage(page);
      console.log('Tecnicos cargado desde cache - page:', page);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const pageData: Page<TecnicoResponse> = await ServicioTecnicos.obtenerTodosTecnicos(page);

      // Guardar en cache
      setPagesCache(prev => new Map(prev.set(page, pageData.content)));

      setTecnicos(pageData.content);
      setCurrentPage(page); // Usar la página solicitada, no la que devuelve la API
      setTotalPages(pageData.totalPages);
      console.log('Tecnicos totalPages:', pageData.totalPages, 'currentPage:', pageData.number, 'content length:', pageData.content.length);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los técnicos');
      console.error('Error en TecnicosContext:', err);
    } finally {
      setLoading(false);
    }
  }, [pagesCache]);

  const nextPage = useCallback(async () => {
    if (currentPage < totalPages - 1 && !loading) {
      await cargarTecnicos(currentPage + 1);
    }
  }, [currentPage, totalPages, loading, cargarTecnicos]);

  const prevPage = useCallback(async () => {
    if (currentPage > 0 && !loading) {
      await cargarTecnicos(currentPage - 1);
    }
  }, [currentPage, loading, cargarTecnicos]);

  const limpiarTecnicos = useCallback(() => {
    setTecnicos([]);
    setCurrentPage(0);
    setTotalPages(0);
    setPagesCache(new Map());
    setError(null);
  }, []);

  return (
    <TecnicosContext.Provider
      value={{
        tecnicos,
        loading,
        error,
        currentPage,
        totalPages,
        cargarTecnicos,
        nextPage,
        prevPage,
        limpiarTecnicos
      }}
    >
      {children}
    </TecnicosContext.Provider>
  );
};

export const useTecnicos = () => {
  const context = useContext(TecnicosContext);
  if (!context) {
    throw new Error('useTecnicos debe usarse dentro de un TecnicosProvider');
  }
  return context;
};