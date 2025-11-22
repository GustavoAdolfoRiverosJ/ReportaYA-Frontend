// src/screens/AuditarReporte/AuditarReporte.controller.ts

import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import ServicioAuditoria from '../../servicios/ServicioAuditoria';
import { useOperadorReportes } from '../../context/OperadorReportesContext';
import { ReporteAuditoria } from '../../types';

export const useAuditarReporteController = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { actualizarEstadoReporte } = useOperadorReportes();

  // Validación defensiva para route.params
  const reporteId = (route.params as any)?.reporteId;
  
  if (!reporteId) {
    console.error('❌ ERROR: reporteId no fue pasado a AuditarReporte. Route params:', route.params);
    throw new Error('reporteId es requerido para auditar un reporte');
  }

  console.log('✅ AuditarReporte inicializado con reporteId:', reporteId);

  const [reporte, setReporte] = useState<ReporteAuditoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aceptando, setAceptando] = useState(false);
  const [rechazando, setRechazando] = useState(false);
  const [comentarioRechazo, setComentarioRechazo] = useState('');
  const [comentarioCierre, setComentarioCierre] = useState('');
  const [mostrarModalCierre, setMostrarModalCierre] = useState(false);
  const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);

  // Cargar reporte al montar
  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Cargando reporte para auditoría:', reporteId);
      const data = await ServicioAuditoria.obtenerReporteParaAuditoria(reporteId);
      setReporte(data);
    } catch (err: any) {
      const mensajeError = err.message || 'Error al cargar el reporte';
      setError(mensajeError);
      console.error('Error:', mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const aceptarAuditoria = async () => {
    if (!comentarioCierre.trim()) {
      setError('Debes escribir un comentario de cierre');
      return;
    }

    try {
      setAceptando(true);
      setError(null);
      console.log('✅ Aceptando auditoría del reporte:', reporteId);
      await ServicioAuditoria.aceptarAuditoria(reporteId, comentarioCierre);

      // Actualizar estado localmente
      actualizarEstadoReporte(reporteId, 'CERRADA');

      console.log('✅ Reporte cerrado exitosamente');
      setMostrarModalCierre(false);
      // Volver a la pantalla anterior después de 1 segundo
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (err: any) {
      const mensajeError = err.message || 'Error al aceptar auditoría';
      setError(mensajeError);
      console.error('Error:', mensajeError);
    } finally {
      setAceptando(false);
    }
  };

  const rechazarAuditoria = async (comentario: string) => {
    if (!comentario.trim()) {
      setError('Debes escribir un comentario de rechazo');
      return;
    }

    try {
      setRechazando(true);
      setError(null);
      console.log('❌ Rechazando auditoría del reporte:', reporteId);
      await ServicioAuditoria.rechazarAuditoria(reporteId, comentario);

      // Actualizar estado localmente
      actualizarEstadoReporte(reporteId, 'RECHAZADO_AUDITO');

      console.log('❌ Reporte rechazado, vuelve a PROCESO');
      setMostrarModalRechazo(false);
      // Volver a la pantalla anterior después de 1 segundo
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (err: any) {
      const mensajeError = err.message || 'Error al rechazar auditoría';
      setError(mensajeError);
      console.error('Error:', mensajeError);
    } finally {
      setRechazando(false);
    }
  };

  return {
    reporteId,
    reporte,
    loading,
    error,
    aceptando,
    rechazando,
    comentarioRechazo,
    setComentarioRechazo,
    comentarioCierre,
    setComentarioCierre,
    mostrarModalCierre,
    setMostrarModalCierre,
    mostrarModalRechazo,
    setMostrarModalRechazo,
    cargarReporte,
    aceptarAuditoria,
    rechazarAuditoria,
  };
};
