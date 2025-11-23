// src/servicios/ServicioAsignaciones.ts
import httpService from './httpService';
import { PrioridadType } from '../types';

interface AsignacionRequest {
  reporteId: number;
  operadorId: number;
  tecnicoId: number;
  prioridad: PrioridadType;
}

interface AsignacionResponse {
  id: number;
  reporteId: number;
  operadorId: number;
  tecnicoId: number;
  prioridad: PrioridadType;
  estado: string;
  fechaAsignacion: string;
}

class ServicioAsignaciones {
  private readonly ENDPOINT = '/api/asignaciones';

  /**
   * Crear una nueva asignación (triaje)
   * Asigna un técnico a un reporte por parte de un operador municipal
   * 
   * @param reporteId - ID del reporte a asignar
   * @param operadorId - ID del operador que realiza la asignación
   * @param tecnicoId - ID del técnico asignado
   * @param prioridad - Nivel de prioridad (BAJA, MEDIA, ALTA)
   * @returns Promise con la respuesta del servidor
   */
  async crearAsignacion(
    reporteId: number,
    operadorId: number,
    tecnicoId: number,
    prioridad: PrioridadType
  ): Promise<AsignacionResponse> {
    try {
      const request: AsignacionRequest = {
        reporteId,
        operadorId,
        tecnicoId,
        prioridad,
      };
      const response = await httpService.post<AsignacionResponse>(this.ENDPOINT, request);
      return response;
    } catch (error: any) {
      console.error('Error al crear asignación:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Error al crear la asignación');
    }
  }
}

export default new ServicioAsignaciones();