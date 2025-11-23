// src/servicios/ServicioOperador.ts
import httpService from './httpService';
import { ReporteResponse, Page } from '../types';

interface CerrarReporteRequest {
  operadorId: number;
  comentarioCierre: string;
}

interface RechazarAuditoriaRequest {
  operadorId: number;
  comentarioRechazo: string;
}

class ServicioOperador {
  private readonly ENDPOINT = '/api/operador';

  /**
   * Obtener reportes pendientes de auditoría
   * @param estado - Estado del reporte (ej: RESUELTA)
   * @param page - Número de página (0-indexed)
   */
  async obtenerReportesParaAuditoria(
    estado: string = 'RESUELTA',
    page: number = 0
  ): Promise<Page<ReporteResponse>> {
    try {
      const response = await httpService.get<Page<ReporteResponse>>(
        `${this.ENDPOINT}/reportes-auditoria?estado=${estado}&page=${page}`
      );
      return response;
    } catch (error: any) {
      console.error('Error al obtener reportes para auditoría:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener reportes');
    }
  }

  /**
   * Cerrar un reporte (APROBAR auditoría)
   * @param reporteId - ID del reporte
   * @param operadorId - ID del operador
   * @param comentarioCierre - Comentario del cierre
   */
  async cerrarReporte(
    reporteId: number,
    operadorId: number,
    comentarioCierre: string
  ): Promise<ReporteResponse> {
    try {
      const request: CerrarReporteRequest = {
        operadorId,
        comentarioCierre,
      };
      const response = await httpService.post<ReporteResponse>(
        `${this.ENDPOINT}/reportes/${reporteId}/cerrar`,
        request
      );
      return response;
    } catch (error: any) {
      console.error('Error al cerrar reporte:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al cerrar el reporte');
    }
  }

  /**
   * Rechazar un reporte en auditoría
   * Si contador < 3: RESUELTA → RECHAZADO_AUDITO (permite reintento)
   * Si contador >= 3: RESUELTA → RECHAZADO (cierre definitivo)
   *
   * @param reporteId - ID del reporte
   * @param operadorId - ID del operador
   * @param comentarioRechazo - Motivo del rechazo
   */
  async rechazarAudito(
    reporteId: number,
    operadorId: number,
    comentarioRechazo: string
  ): Promise<ReporteResponse> {
    try {
      const request: RechazarAuditoriaRequest = {
        operadorId,
        comentarioRechazo,
      };
      const response = await httpService.post<ReporteResponse>(
        `${this.ENDPOINT}/reportes/${reporteId}/rechazar-audito`,
        request
      );
      return response;
    } catch (error: any) {
      console.error('Error al rechazar auditoría:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al rechazar el reporte');
    }
  }
}

export default new ServicioOperador();
