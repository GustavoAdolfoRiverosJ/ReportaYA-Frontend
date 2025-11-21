import httpService from './httpService';
import { RegistrarTokenRequest } from '../types/notificacion.types';

class ServicioNotificaciones {
  /**
   * Registra el token FCM del dispositivo para recibir notificaciones push
   * @param request Datos del token y cuenta
   * @returns Mensaje de éxito
   */
  async registrarToken(request: RegistrarTokenRequest): Promise<string> {
    return await httpService.post<string>('/notificaciones/registrar-token', request);
  }
}

export default new ServicioNotificaciones();
