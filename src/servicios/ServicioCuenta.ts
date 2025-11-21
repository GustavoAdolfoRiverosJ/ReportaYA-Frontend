// src/servicios/ServicioCuenta.ts
import httpService from './httpService';
import { CrearCuentaRequest, CuentaResponse } from '../types/cuenta.types';

class ServicioCuenta {
  private readonly ENDPOINT = '/api/cuenta';

  /**
   * Crear una nueva cuenta (ciudadano, técnico, operador municipal)
   * @param cuenta - Datos de la cuenta a crear
   * @returns Promise con la respuesta del servidor
   */
  async crearCuenta(cuenta: CrearCuentaRequest): Promise<CuentaResponse> {
    try {
      const response = await httpService.post<CuentaResponse>(this.ENDPOINT, cuenta);
      return response;
    } catch (error: any) {
      console.error('Error al crear cuenta:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear la cuenta');
    }
  }
}

export default new ServicioCuenta();
