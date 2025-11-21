// src/servicios/ServicioReportes.ts
import httpService from './httpService';
import {
  CrearReporteRequest,
  ReporteResponse,
  ActualizarReporteRequest,
  Page
} from '../types';

class ServicioReportes {
  private readonly ENDPOINT = '/api/reportes';

  /**
   * Crear un nuevo reporte
   * @param reporte - Datos del reporte a crear
   * @returns Promise con la respuesta del servidor
   */
  async crearReporte(reporte: CrearReporteRequest): Promise<ReporteResponse> {
    try {
      const response = await httpService.post<ReporteResponse>(this.ENDPOINT, reporte);
      return response;
    } catch (error: any) {
      console.error('Error al crear reporte:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear el reporte');
    }
  }

  /**
   * Actualizar un reporte existente
   * @param id - ID del reporte a actualizar
   * @param reporte - Datos a actualizar
   * @returns Promise con la respuesta del servidor
   */
  async actualizarReporte(id: number, reporte: ActualizarReporteRequest): Promise<ReporteResponse> {
    try {
      const response = await httpService.put<ReporteResponse>(`${this.ENDPOINT}/${id}`, reporte);
      return response;
    } catch (error: any) {
      console.error('Error al actualizar reporte:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar el reporte');
    }
  }

  /**
   * Obtener todos los reportes (paginados) con filtros opcionales
   * @param page - Número de página (0-indexed)
   * @param estado - (Opcional) Filtrar por estado
   * @returns Promise con página de reportes
   */
  async obtenerTodosReportes(page: number = 0, estado?: string): Promise<Page<ReporteResponse>> {
    try {
      let url = `${this.ENDPOINT}?page=${page}&size=10`;
      if (estado) {
        url += `&estado=${estado}`;
      }
      const response = await httpService.get<Page<ReporteResponse>>(url);
      return response;
    } catch (error: any) {
      console.error('Error al obtener todos los reportes:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los reportes');
    }
  }

  /**
   * Rechazar un reporte
   * @param id - ID del reporte
   * @param motivo - Motivo del rechazo
   * @returns Promise con el reporte actualizado
   */
  async rechazarReporte(id: number, motivo: string): Promise<ReporteResponse> {
    try {
      const response = await httpService.post<ReporteResponse>(`${this.ENDPOINT}/${id}/rechazar?motivo=${encodeURIComponent(motivo)}`);
      return response;
    } catch (error: any) {
      console.error('Error al rechazar reporte:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al rechazar el reporte');
    }
  }

  /**
   * Obtener historial de estados de un reporte
   * @param reporteId - ID del reporte
   * @returns Promise con lista de historial
   */
  async obtenerHistorialEstados(reporteId: number): Promise<any[]> {
    try {
      const response = await httpService.get<any[]>(`/historial-estados/reporte/${reporteId}`);
      return response;
    } catch (error: any) {
      console.error('Error al obtener historial:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener historial');
    }
  }

  /**
   * Obtener reportes de un ciudadano específico (paginados)
   * @param cuentaId - ID de la cuenta del ciudadano
   * @param page - Número de página (0-indexed)
   * @returns Promise con página de reportes
   */
  async obtenerReportesPorCuenta(cuentaId: number, page: number = 0): Promise<Page<ReporteResponse>> {
    try {
      const response = await httpService.get<Page<ReporteResponse>>(`${this.ENDPOINT}/cuenta/${cuentaId}?page=${page}&size=10`);
      return response;
    } catch (error: any) {
      console.error('Error al obtener reportes por cuenta:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los reportes');
    }
  }

  /**
   * Cambiar estado de un reporte
   * @param id - ID del reporte
   * @param nuevoEstado - Nuevo estado del reporte
   * @returns Promise con el reporte actualizado
   */
  async cambiarEstadoReporte(id: number, nuevoEstado: string): Promise<ReporteResponse> {
    try {
      const response = await httpService.patch<ReporteResponse>(`${this.ENDPOINT}/${id}/estado?nuevoEstado=${nuevoEstado}`);
      return response;
    } catch (error: any) {
      console.error('Error al cambiar estado del reporte:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al cambiar estado del reporte');
    }
  }

  /**
   * Cambiar prioridad de un reporte
   * @param id - ID del reporte
   * @param nuevaPrioridad - Nueva prioridad del reporte
   * @returns Promise con el reporte actualizado
   */
  async cambiarPrioridadReporte(id: number, nuevaPrioridad: string): Promise<ReporteResponse> {
    try {
      const response = await httpService.patch<ReporteResponse>(`${this.ENDPOINT}/${id}/prioridad?nuevaPrioridad=${nuevaPrioridad}`);
      return response;
    } catch (error: any) {
      console.error('Error al cambiar prioridad del reporte:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al cambiar prioridad del reporte');
    }
  }

  /**
   * Eliminar un reporte
   * @param id - ID del reporte a eliminar
   * @returns Promise<void>
   */
  async eliminarReporte(id: number): Promise<void> {
    try {
      await httpService.delete(`${this.ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error al eliminar reporte:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar el reporte');
    }
  }
}

export default new ServicioReportes();
