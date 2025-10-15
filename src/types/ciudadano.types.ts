// src/types/ciudadano.types.ts

/**
 * Representa un ciudadano del sistema
 */
export interface Ciudadano {
  id?: number;                    // Opcional al crear, presente en respuesta
  nombres: string;                // OBLIGATORIO
  apellidos: string;              // OBLIGATORIO
  dni: string;                    // OBLIGATORIO - Único
  telefono: string;               // OBLIGATORIO
  correo: string;                 // OBLIGATORIO - Único
  usuario: string;                // OBLIGATORIO - Único
  contrasena?: string;            // Opcional (solo al crear/actualizar, no en respuestas)
}

/**
 * Datos para crear un nuevo ciudadano
 */
export interface CrearCiudadanoRequest {
  nombres: string;                // OBLIGATORIO
  apellidos: string;              // OBLIGATORIO
  dni: string;                    // OBLIGATORIO - Único
  telefono: string;               // OBLIGATORIO
  correo: string;                 // OBLIGATORIO - Único
  usuario: string;                // OBLIGATORIO - Único
  contrasena: string;             // OBLIGATORIO
}

/**
 * Respuesta del servidor con datos del ciudadano (sin contraseña)
 */
export interface CiudadanoResponse {
  id: number;                     // Siempre presente en respuesta
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  usuario: string;
  // contrasena nunca se devuelve en respuestas
}

/**
 * Datos para actualizar un ciudadano
 */
export interface ActualizarCiudadanoRequest {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  correo?: string;
  contrasena?: string;            // Opcional - Solo si se desea cambiar
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
