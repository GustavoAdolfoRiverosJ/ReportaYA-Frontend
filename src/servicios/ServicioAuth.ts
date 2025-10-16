// src/servicios/ServicioAuth.ts
import httpService from './httpService';
import { AuthLoginRequest, AuthLoginResponse } from '../types/auth.types';

class ServicioAuth {
  private readonly ENDPOINT = '/auth';

  /**
   * Realizar login de usuario
   * @param usuario - Nombre de usuario
   * @param password - Contraseña
   * @returns Promise con la respuesta del login
   */
  async login(usuario: string, password: string): Promise<AuthLoginResponse> {
    try {
      const loginRequest: AuthLoginRequest = {
        usuario,
        password
      };

      const response = await httpService.post<AuthLoginResponse>(
        `${this.ENDPOINT}/login`,
        loginRequest
      );

      console.log('Login exitoso:', response);
      return response;
    } catch (error: any) {
      console.error('Error en login:', error.response?.data || error.message);

      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        throw new Error('Usuario o contraseña incorrectos');
      } else if (error.response?.status === 400) {
        throw new Error('Datos de login inválidos');
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(error.message || 'Error al iniciar sesión');
      }
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * (Por ahora solo verifica si hay datos en AsyncStorage)
   * @returns Promise<boolean>
   */
  async verificarAutenticacion(): Promise<boolean> {
    try {
      // TODO: Implementar verificación con token JWT cuando esté disponible
      // Por ahora, solo verificamos si hay datos guardados localmente
      return false; // Placeholder
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }
}

export default new ServicioAuth();