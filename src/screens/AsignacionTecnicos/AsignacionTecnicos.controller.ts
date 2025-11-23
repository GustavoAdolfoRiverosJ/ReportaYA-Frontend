// src/screens/AsignacionTecnicos/AsignacionTecnicos.controller.ts
import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import ServicioAsignaciones from '../../servicios/ServicioAsignaciones';
import ServicioReportes from '../../servicios/ServicioReportes';
import { useAuth } from '../../context/AuthContext';
import { useTecnicos } from '../../context/TecnicosContext';
import { useOperadorReportes } from '../../context/OperadorReportesContext';
import { EstadoReporte, Prioridad } from '../../types/enums';
import { PrioridadType } from '../../types';

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
  const [prioridad, setPrioridad] = useState<PrioridadType>(Prioridad.MEDIA);

  const route = useRoute();
  const navigation = useNavigation();
  const { usuario } = useAuth();

  const { reporteId } = route.params as { reporteId: number };

  const [showSuccess, setShowSuccess] = useState(false);

  // Log para depuración: confirmar que la pantalla recibió el reporteId
  console.log('AsignacionTecnicos - mounted, reporteId=', reporteId);

  const asignarTecnico = async (tecnicoId: number) => {
    if (!usuario?.id || !reporteId) {
      setAsignacionError('Información de usuario o reporte incompleta');
      return;
    }

    try {
      setTecnicoAsignandoId(tecnicoId);
      setAsignacionError(null);

      console.log('🔗 Asignando: reporteId=', reporteId, 'operadorId=', usuario.id, 'tecnicoId=', tecnicoId, 'prioridad=', prioridad);
      await ServicioAsignaciones.crearAsignacion(
        reporteId,
        usuario.id,
        tecnicoId,
        prioridad
      );

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
    prioridad,
    setPrioridad,
    cargarTecnicos: () => cargarTecnicos(0),
    recargarPaginaActual: () => cargarTecnicos(currentPage), // Para recargar la página actual
    nextPage,
    prevPage,
    asignarTecnico,
  };
};