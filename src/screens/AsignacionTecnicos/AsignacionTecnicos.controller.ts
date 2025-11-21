// src/screens/AsignacionTecnicos/AsignacionTecnicos.controller.ts
import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import ServicioAsignaciones from '../../servicios/ServicioAsignaciones';
import ServicioReportes from '../../servicios/ServicioReportes';
import { useAuth } from '../../context/AuthContext';
import { useTecnicos } from '../../context/TecnicosContext';
import { useOperadorReportes } from '../../context/OperadorReportesContext';
import { EstadoReporte } from '../../types/enums';

export const useAsignacionTecnicosController = () => {
  const {
    tecnicos,
    loading,
    error,
    currentPage,
    totalPages,
    cargarTecnicos,
    nextPage,
    prevPage,
  } = useTecnicos();
  const { actualizarEstadoReporte } = useOperadorReportes();
  const [tecnicoAsignandoId, setTecnicoAsignandoId] = useState<number | null>(null);
  const [asignacionError, setAsignacionError] = useState<string | null>(null);

  const route = useRoute();
  const navigation = useNavigation();
  const { usuario } = useAuth();

  const { reporteId } = route.params as { reporteId: number };

  const [showSuccess, setShowSuccess] = useState(false);

  const asignarTecnico = async (tecnicoId: number) => {
    if (!usuario?.id || !reporteId) {
      setAsignacionError('Información de usuario o reporte incompleta');
      return;
    }

    try {
      setTecnicoAsignandoId(tecnicoId);
      setAsignacionError(null);

      await ServicioAsignaciones.crearAsignacion({
        reporteId,
        operadorId: usuario.id,
        tecnicoId,
      });

      // El backend cambia automáticamente el estado a PROCESO al asignar
      // Solo actualizamos el estado localmente para reflejar el cambio
      actualizarEstadoReporte(reporteId, EstadoReporte.PROCESO);

      setShowSuccess(true);
      
      // Esperar un momento para que el usuario vea el mensaje de éxito antes de volver
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (err: any) {
      setAsignacionError(err.message || 'Error al asignar técnico');
    } finally {
      setTecnicoAsignandoId(null);
    }
  };

  useEffect(() => {
    cargarTecnicos(0);
  }, []); // Solo ejecutar una vez al montar el componente

  return {
    tecnicos,
    loading,
    error: error || asignacionError,
    tecnicoAsignandoId,
    reporteId,
    currentPage,
    totalPages,
    showSuccess,
    setShowSuccess,
    cargarTecnicos: () => cargarTecnicos(0),
    recargarPaginaActual: () => cargarTecnicos(currentPage), // Para recargar la página actual
    nextPage,
    prevPage,
    asignarTecnico,
  };
};