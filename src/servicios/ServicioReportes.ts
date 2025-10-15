// src/servicios/ServicioReportes.ts
import httpService from './httpService';
import { 
  CrearReporteRequest, 
  ReporteResponse, 
} from '../types';

class ServicioReportes {
  private readonly ENDPOINT = '/reportes';

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

  
}

export default new ServicioReportes();
