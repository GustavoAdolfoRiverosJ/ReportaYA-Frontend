// src/servicios/ServicioTecnicos.ts
import httpService from './httpService';
import {
  ReporteResponse,
  Page,
  CompletarReporteRequest,
  CompletarReporteResponse,
  TecnicoResponse
} from '../types';

class ServicioTecnicos {
  private readonly ENDPOINT = '/api/tecnicos';

  /**
   * Obtener todos los técnicos disponibles (paginado)
   * GET /api/tecnicos?page={PAGE}
   * @param page - Número de página (0-indexed)
   * @returns Promise con página de técnicos
   */
  async obtenerTodosTecnicos(page: number = 0): Promise<Page<TecnicoResponse>> {
    try {
      const url = `${this.ENDPOINT}?page=${page}`;
      console.log('🔍 Obteniendo técnicos:', url);
      const response = await httpService.get<Page<TecnicoResponse>>(url);
      console.log('✅ Técnicos obtenidos:', response.content.length, 'técnicos, página', response.number + 1, 'de', response.totalPages);
      return response;
    } catch (error: any) {
      console.error('Error al obtener técnicos:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los técnicos');
    }
  }

  /**
   * Obtener reportes asignados al técnico, filtrados por estado
   * GET /api/tecnicos/{id}/reportes?estado={ESTADO}&page={PAGE}
   * @param tecnicoId - ID del técnico
   * @param estado - (Opcional) Estado de los reportes (PROCESO, RESUELTA, etc)
   * @param page - Número de página (0-indexed)
   * @returns Promise con página de reportes
   */
  async obtenerReportesAsignados(
    tecnicoId: number,
    estado?: string,
    page: number = 0
  ): Promise<Page<ReporteResponse>> {
    try {
      let url = `${this.ENDPOINT}/${tecnicoId}/reportes?page=${page}`;
      if (estado) {
        url += `&estado=${estado}`;
      }
      console.log('🔍 Técnico - Llamando a:', url);
      const response = await httpService.get<Page<ReporteResponse>>(url);
      console.log('✅ Técnico - Respuesta recibida:', response.content.length, 'reportes, página', response.number + 1, 'de', response.totalPages);
      return response;
    } catch (error: any) {
      console.error('Error al obtener reportes asignados:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los reportes asignados');
    }
  }

  /**
   * Completar un reporte con fotos y comentario
   * PATCH /api/tecnicos/{id}/reportes/{reporteId}/completar
   * @param tecnicoId - ID del técnico
   * @param reporteId - ID del reporte a completar
   * @param request - Datos del reporte completado (comentario + fotos)
   * @returns Promise con respuesta del servidor
   */
  async completarReporte(
    tecnicoId: number,
    reporteId: number,
    request: CompletarReporteRequest
  ): Promise<CompletarReporteResponse> {
    try {
      console.log('📸 Completando reporte:', reporteId, 'con', request.fotos?.length, 'fotos');
      const response = await httpService.patch<CompletarReporteResponse>(
        `${this.ENDPOINT}/${tecnicoId}/reportes/${reporteId}/completar`,
        request
      );
      console.log('✅ Reporte completado:', response.mensaje);
      return response;
    } catch (error: any) {
      console.error('Error al completar reporte:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al completar el reporte');
    }
  }

  /**
   * Obtener un reporte específico asignado al técnico
   * GET /api/reportes/{id}
   * @param reporteId - ID del reporte
   * @returns Promise con los datos del reporte
   */
  async obtenerReportePorId(reporteId: number): Promise<ReporteResponse> {
    try {
      console.log('🔍 Obteniendo reporte:', reporteId);
      const response = await httpService.get<ReporteResponse>(`/api/reportes/${reporteId}`);
      return response;
    } catch (error: any) {
      console.error('Error al obtener reporte:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener el reporte');
    }
  }
}

export default new ServicioTecnicos();
