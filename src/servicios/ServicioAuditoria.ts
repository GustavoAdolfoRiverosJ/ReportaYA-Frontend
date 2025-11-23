// src/servicios/ServicioAuditoria.ts

import httpService from './httpService';
import {
  ReporteAuditoria,
  AceptarAuditoriaRequest,
  RechazarAuditoriaRequest,
  RespuestaAuditoriaResponse,
} from '../types';

class ServicioAuditoria {
  private readonly ENDPOINT = '/api/reportes';

  /**
   * Obtener información de auditoría de un reporte
   * GET /api/reportes/{id}
   * @param reporteId - ID del reporte a auditar
   * @returns Promise con los datos del reporte (comentario y fotos)
   */
  async obtenerReporteParaAuditoria(reporteId: number): Promise<ReporteAuditoria> {
    try {
      const url = `${this.ENDPOINT}/${reporteId}`;
      console.log('🔍 Obteniendo reporte para auditoría:', url);
      const response = await httpService.get<ReporteAuditoria>(url);
      console.log('✅ Reporte obtenido para auditoría:', response);
      return response;
    } catch (error: any) {
      console.error('Error al obtener reporte para auditoría:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener reporte para auditoría');
    }
  }

  /**
   * Aceptar auditoría - cambiar estado a CERRADA
   * POST /api/operador/reportes/{id}/cerrar
   * @param reporteId - ID del reporte
   * @param comentarioCierre - Comentario del operador
   * @returns Promise con la respuesta del servidor
   */
  async aceptarAuditoria(
    reporteId: number,
    comentarioCierre: string
  ): Promise<RespuestaAuditoriaResponse> {
    try {
      const url = `/api/operador/reportes/${reporteId}/cerrar`;
      const request: AceptarAuditoriaRequest = {
        operadorId: 1, // TODO: obtener del contexto de autenticación
        reporteId,
        comentarioCierre,
      };
      console.log('✅ Aceptando auditoría:', url);
      const response = await httpService.post<RespuestaAuditoriaResponse>(url, request);
      console.log('✅ Auditoría aceptada:', response);
      return response;
    } catch (error: any) {
      console.error('Error al aceptar auditoría:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al aceptar auditoría');
    }
  }

  /**
   * Rechazar auditoría - cambiar estado a RECHAZADO_AUDITO
   * POST /api/operador/reportes/{id}/rechazar-audito
   * @param reporteId - ID del reporte
   * @param comentarioRechazo - Comentario de rechazo (obligatorio)
   * @returns Promise con la respuesta del servidor
   */
  async rechazarAuditoria(reporteId: number, comentarioRechazo: string): Promise<RespuestaAuditoriaResponse> {
    try {
      if (!comentarioRechazo || comentarioRechazo.trim().length === 0) {
        throw new Error('El comentario de rechazo es obligatorio');
      }

      const url = `/api/operador/reportes/${reporteId}/rechazar-audito`;
      const request: RechazarAuditoriaRequest = {
        operadorId: 1, // TODO: obtener del contexto de autenticación
        reporteId,
        comentarioRechazo,
      };
      console.log('❌ Rechazando auditoría:', url);
      const response = await httpService.post<RespuestaAuditoriaResponse>(url, request);
      console.log('❌ Auditoría rechazada:', response);
      return response;
    } catch (error: any) {
      console.error('Error al rechazar auditoría:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al rechazar auditoría');
    }
  }
}

export default new ServicioAuditoria();
