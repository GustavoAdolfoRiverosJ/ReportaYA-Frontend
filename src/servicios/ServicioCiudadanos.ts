// src/servicios/ServicioCiudadanos.ts
import httpService from './httpService';
import { 
  CrearCiudadanoRequest,
  CiudadanoResponse,
  ActualizarCiudadanoRequest,
} from '../types';

class ServicioCiudadanos {
  private readonly ENDPOINT = '/ciudadanos';

  /**
   * Crear un nuevo ciudadano (registro)
   * @param ciudadano - Datos del ciudadano a crear
   * @returns Promise con la respuesta del servidor
   */
  async crearCiudadano(ciudadano: CrearCiudadanoRequest): Promise<CiudadanoResponse> {
    try {
      const response = await httpService.post<CiudadanoResponse>(this.ENDPOINT, ciudadano);
      return response;
    } catch (error: any) {
      console.error('Error al crear ciudadano:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear el ciudadano');
    }
  }

  /**
   * Actualizar un ciudadano existente
   * @param id - ID del ciudadano a actualizar
   * @param ciudadano - Datos a actualizar
   * @returns Promise con la respuesta del servidor
   */
  async actualizarCiudadano(id: number, ciudadano: ActualizarCiudadanoRequest): Promise<CiudadanoResponse> {
    try {
      const response = await httpService.put<CiudadanoResponse>(`${this.ENDPOINT}/${id}`, ciudadano);
      return response;
    } catch (error: any) {
      console.error('Error al actualizar ciudadano:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar el ciudadano');
    }
  }
}

export default new ServicioCiudadanos();
