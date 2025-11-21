// src/types/reporte.types.ts
import { EstadoReporteType, PrioridadType } from './enums';
import { Ubicacion, CrearUbicacionRequest } from './ubicacion.types';

/**
 * Representa un reporte de incidencia urbana
 */
export interface Reporte {
  id?: number;                    // Opcional al crear, presente en respuesta
  titulo: string;                 // OBLIGATORIO
  descripcion: string;            // OBLIGATORIO
  cuentaId: number;               // OBLIGATORIO - ID del ciudadano
  nombreCiudadano?: string;       // Solo en respuesta del servidor
  prioridad?: PrioridadType;      // Opcional (default: MEDIA)
  estado?: EstadoReporteType;     // Solo en respuesta (default: PENDIENTE)
  ubicacion: Ubicacion;           // OBLIGATORIO - Composición
  fechaCreacion?: string;         // Solo en respuesta (ISO 8601)
  fechaActualizacion?: string;    // Solo en respuesta (ISO 8601)
}

/**
 * Datos para crear un nuevo reporte
 */
export interface CrearReporteRequest {
  titulo: string;                 // OBLIGATORIO
  descripcion: string;            // OBLIGATORIO
  cuentaId: number;               // OBLIGATORIO - ID del ciudadano
  ubicacion: CrearUbicacionRequest;  // OBLIGATORIO - Solo campos necesarios
  prioridad?: PrioridadType;      // Opcional (default: MEDIA en backend)
}

/**
 * Respuesta completa del servidor al crear/obtener un reporte
 */
export interface ReporteResponse {
  id: number;                     // Siempre presente en respuesta
  titulo: string;
  descripcion: string;
  cuentaId: number;
  nombreCiudadano: string;        // Siempre presente en respuesta
  prioridad: PrioridadType;       // Siempre presente en respuesta
  estado: EstadoReporteType;      // Siempre presente en respuesta
  ubicacion: Ubicacion;           // Siempre presente con datos completos
  fechaCreacion: string;          // Siempre presente (ISO 8601)
  fechaActualizacion: string;     // Siempre presente (ISO 8601)
}

/**
 * Datos para actualizar un reporte existente
 */
export interface ActualizarReporteRequest {
  titulo?: string;
  descripcion?: string;
  prioridad?: PrioridadType;
  estado?: EstadoReporteType;
  ubicacion?: CrearUbicacionRequest;
}

/**
 * Filtros para búsqueda de reportes
 */
export interface FiltrosReporte {
  cuentaId?: number;              // Filtrar por ciudadano
  estado?: EstadoReporteType;     // Filtrar por estado
  prioridad?: PrioridadType;      // Filtrar por prioridad
  fechaDesde?: string;            // Fecha desde (ISO 8601)
  fechaHasta?: string;            // Fecha hasta (ISO 8601)
}

/**
 * Historial de cambios de estado de un reporte
 */
export interface HistorialEstado {
  id: number;
  reporteId: number;
  estadoAnterior: EstadoReporteType | null;
  estadoNuevo: EstadoReporteType;
  fechaCambio: string; // ISO 8601
}

/**
 * Solicitud para rechazar un reporte
 */
export interface RechazarReporteRequest {
  motivo: string;
}
