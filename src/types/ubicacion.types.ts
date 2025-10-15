// src/types/ubicacion.types.ts

/**
 * Representa la ubicación GPS de un reporte
 * Composición obligatoria en Reporte
 */
export interface Ubicacion {
  id?: number;                    // Opcional al crear, presente en respuesta
  latitud: number;                // OBLIGATORIO - Coordenada de latitud
  longitud: number;               // OBLIGATORIO - Coordenada de longitud
  direccion?: string;             // Opcional - Dirección textual
  fechaRegistro?: string;         // Opcional - ISO 8601 string (ej: "2024-10-15T10:30:00")
}

/**
 * Datos para crear una ubicación (solo campos obligatorios + opcionales)
 */
export interface CrearUbicacionRequest {
  latitud: number;                // OBLIGATORIO
  longitud: number;               // OBLIGATORIO
  direccion?: string;             // Opcional
}

/**
 * Respuesta del servidor con ubicación completa
 */
export interface UbicacionResponse extends Ubicacion {
  id: number;                     // Siempre presente en respuesta
  fechaRegistro: string;          // Siempre presente en respuesta
}
