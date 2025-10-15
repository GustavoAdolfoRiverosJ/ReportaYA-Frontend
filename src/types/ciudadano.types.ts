// src/types/ciudadano.types.ts

/**
 * Representa un ciudadano del sistema
 */
export interface Ciudadano {
  id?: number;                    // Opcional al crear, presente en respuesta
  usuario: string;                // OBLIGATORIO - Único
  nombres: string;                // OBLIGATORIO
  apellidos: string;              // OBLIGATORIO
  dni: string;                    // OBLIGATORIO - Único
  telefono: string;               // OBLIGATORIO
  correo: string;                 // OBLIGATORIO - Único
  contrasena?: string;            // Opcional (solo al crear/actualizar, no en respuestas)
  activo: boolean;                // Estado del ciudadano
}

/**
 * Datos para crear un nuevo ciudadano
 */
export interface CrearCiudadanoRequest {
  usuario: string;                // OBLIGATORIO - Único
  nombres: string;                // OBLIGATORIO
  apellidos: string;              // OBLIGATORIO
  dni: string;                    // OBLIGATORIO - Único
  telefono: string;               // OBLIGATORIO
  correo: string;                 // OBLIGATORIO - Único
  contrasena: string;             // OBLIGATORIO
  activo: boolean;                // Estado del ciudadano (default: true)
}

/**
 * Respuesta del servidor con datos del ciudadano (sin contraseña)
 */
export interface CiudadanoResponse {
  id: number;                     // Siempre presente en respuesta
  usuario: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  activo: boolean;
  // contrasena nunca se devuelve en respuestas
}

/**
 * Datos para actualizar un ciudadano
 */
export interface ActualizarCiudadanoRequest {
  usuario?: string;
  nombres?: string;
  apellidos?: string;
  dni?: string;
  telefono?: string;
  correo?: string;
  contrasena?: string;            // Opcional - Solo si se desea cambiar
  activo?: boolean;
}

/**
 * Datos de login
 */
export interface LoginRequest {
  usuario: string;                // OBLIGATORIO
  contrasena: string;             // OBLIGATORIO
}

/**
 * Respuesta de login exitoso
 */
export interface LoginResponse {
  token?: string;                 // Token de autenticación (si aplica)
  ciudadano: CiudadanoResponse;   // Datos del ciudadano autenticado
}
