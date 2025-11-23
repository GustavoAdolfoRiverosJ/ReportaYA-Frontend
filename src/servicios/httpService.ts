// src/servicios/httpService.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// --- Configuración de la API ---

// Opción 1: Para conectar desde un EMULADOR de Android.
// El emulador usa la IP 10.0.2.2 para referirse al 'localhost' de la máquina anfitriona (tu PC).
const API_BASE_URL = 'http://10.0.2.2:8080';

// Opción 2: Para conectar desde un DISPOSITIVO FÍSICO.
// El dispositivo debe estar en la misma red WiFi que tu PC.
// Reemplaza '192.168.100.135' con la IP de tu PC (la puedes ver con 'ipconfig' o 'ifconfig').
// const API_BASE_URL = 'http://192.168.100.135:8080';

// Opción 3: API en producción.
// const API_BASE_URL = 'https://reporte-a.agreeableisland-1cef4d7f.eastus2.azurecontainerapps.io/api';

// Configuración base de la API
// NOTA: Dispositivo físico conectado a la misma red WiFi que la PC
//const API_BASE_URL = 'https://reporte-a.agreeableisland-1cef4d7f.eastus2.azurecontainerapps.io/api'; // IP de tu PC
const API_BASE_URL = 'http://192.168.18.26:8080'; // Para emulador Android (descomentar si usas emulador)

class HttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar respuestas
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Error en la petición HTTP:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Método GET
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  // Método POST
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  // Método PUT
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  // Método DELETE
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  // Método PATCH
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  // Actualizar headers (por ejemplo, para tokens de autenticación)
  setAuthToken(token: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Remover token de autenticación
  removeAuthToken() {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }
}

export default new HttpService();
