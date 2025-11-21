// src/servicios/ServicioAsignaciones.ts
import httpService from './httpService';
import { CrearAsignacionRequest, AsignacionResponse } from '../types/asignacion.types';

class ServicioAsignaciones {
  private readonly ENDPOINT = '/api/asignaciones';

  /**
   * Crear una nueva asignación (triaje)
   * Asigna un técnico a un reporte por parte de un operador municipal
   * @param asignacion - Datos de la asignación a crear
   * @returns Promise con la respuesta del servidor
   */
  async crearAsignacion(asignacion: CrearAsignacionRequest): Promise<AsignacionResponse> {
    try {
      const response = await httpService.post<AsignacionResponse>(this.ENDPOINT, asignacion);
      return response;
    } catch (error: any) {
      console.error('Error al crear asignación:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Error al crear la asignación');
    }
  }
}

export default new ServicioAsignaciones();