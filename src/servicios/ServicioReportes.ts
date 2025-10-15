// src/servicios/ServicioReportes.ts
import httpService from './httpService';
import { 
  CrearReporteRequest, 
  ReporteResponse,
  ActualizarReporteRequest,
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
   * Obtener reportes de un ciudadano específico
   * @param cuentaId - ID de la cuenta del ciudadano
   * @returns Promise con array de reportes
   */
  async obtenerReportesPorCuenta(cuentaId: number): Promise<ReporteResponse[]> {
    try {
      const response = await httpService.get<ReporteResponse[]>(`${this.ENDPOINT}/cuenta/${cuentaId}`);
      return response;
    } catch (error: any) {
      console.error('Error al obtener reportes por cuenta:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los reportes');
    }
  }
}

export default new ServicioReportes();
