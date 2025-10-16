// src/servicios/ServicioCiudadanos.ts
import httpService from './httpService';
import { CrearCuentaRequest, CuentaResponse } from '../types/cuenta.types';
import { ActualizarCiudadanoRequest, CiudadanoResponse } from '../types/ciudadano.types';


class ServicioCiudadanos {
  private readonly ENDPOINT = '/cuenta';


  /**
   * Crear una nueva cuenta tipo ciudadano
   * @param cuenta - Datos de la cuenta a crear (tipoCuenta: 'CIUDADANO')
   * @returns Promise con la respuesta del servidor
   */
  async crearCiudadano(cuenta: CrearCuentaRequest): Promise<CuentaResponse> {
    try {
      const response = await httpService.post<CuentaResponse>(this.ENDPOINT, cuenta);
      return response;
    } catch (error: any) {
      console.error('Error al crear ciudadano:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear el ciudadano');
    }
  }


  /**
   * Actualizar datos de un ciudadano existente
   * @param id - ID de la cuenta/ciudadano a actualizar
   * @param datos - Datos a actualizar
   * @returns Promise con la respuesta del servidor
   */
  async actualizarCiudadano(id: number, datos: ActualizarCiudadanoRequest): Promise<CuentaResponse> {
    try {
      const response = await httpService.put<CuentaResponse>(`${this.ENDPOINT}/${id}`, datos);
      return response;
    } catch (error: any) {
      console.error('Error al actualizar ciudadano:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar el ciudadano');
    }
  }
}

export default new ServicioCiudadanos();
