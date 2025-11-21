// src/servicios/ServicioTecnicos.ts
import httpService from './httpService';
import { TecnicoResponse, Page } from '../types';

class ServicioTecnicos {
  private readonly ENDPOINT = '/api/tecnicos';

  /**
   * Obtener todos los técnicos (paginados)
   * @param page - Número de página (0-indexed)
   * @returns Promise con página de técnicos
   */
  async obtenerTodosTecnicos(page: number = 0): Promise<Page<TecnicoResponse>> {
    try {
      const response = await httpService.get<Page<TecnicoResponse>>(`${this.ENDPOINT}?page=${page}&size=10`);
      return response;
    } catch (error: any) {
      console.error('Error al obtener técnicos:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los técnicos');
    }
  }
}

export default new ServicioTecnicos();