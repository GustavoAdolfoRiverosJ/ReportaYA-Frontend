// src/types/auditor-reporte.types.ts

import { TipoFotoType } from './enums';
import { Ubicacion } from './ubicacion.types';

/**
 * Información de una foto adjuntada por el técnico
 */
export interface FotoAuditoria {
  id?: number;
  tipo: TipoFotoType;        // INICIAL, PROCESO, FINAL
  descripcion: string;
  archivoBase64?: string;    // Base64 para mostrar en la app
  url?: string;              // URL si se almacena en servidor
  fechaCarga?: string;       // ISO 8601
}

/**
 * Información de auditoría de un reporte completado
 * Contiene lo que el técnico envió cuando marcó como RESUELTA
 */
export interface ReporteAuditoria {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: Ubicacion;
  estado: string;              // Debería ser RESUELTA para auditar
  prioridad: string;
  
  // Información del técnico asignado
  tecnicoId: number;
  tecnicoNombre: string;
  
  // Comentario de resolución
  comentarioResolucion: string;
  
  // Fotos adjuntadas por el técnico
  fotos: FotoAuditoria[];
  
  // Contador de rechazos de auditoría
  contadorRechazos: number;    // 0-2 = RECHAZADO_AUDITO, 3+ = RECHAZADO
  
  // Metadata
  fechaCreacion: string;
  fechaAsignacion?: string;
  fechaCompletacion?: string;
}

/**
 * Request para aceptar auditoría (cambiar a CERRADA)
 */
export interface AceptarAuditoriaRequest {
  operadorId?: number;
  reporteId?: number;
  comentarioCierre?: string;  // Opcional: comentario del auditor
}

/**
 * Request para rechazar auditoría (cambiar a RECHAZADO_AUDITO)
 */
export interface RechazarAuditoriaRequest {
  operadorId?: number;
  reporteId: number;
  comentarioRechazo: string;  // Obligatorio: comentario de rechazo
}

/**
 * Response del servidor después de auditar
 */
export interface RespuestaAuditoriaResponse {
  exito: boolean;
  mensaje: string;
  reporteId: number;
  nuevoEstado: string;  // CERRADA o RECHAZADO_AUDITO
}
