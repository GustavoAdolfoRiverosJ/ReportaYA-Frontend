// src/types/tecnico-completo.types.ts
import { TipoFotoType } from './enums';

/**
 * Foto para enviar al completar un reporte (con contenido base64)
 */
export interface FotoRequest {
  tipo: TipoFotoType;           // INICIAL, PROCESO, FINAL
  descripcion: string;          // Descripción de la foto
  archivoBase64: string;        // Contenido de la foto en base64
}

/**
 * Solicitud para completar un reporte con fotos
 * PATCH /api/tecnicos/{tecnicoId}/reportes/{reporteId}/completar
 */
export interface CompletarReporteRequest {
  comentarioResolucion: string; // Comentario (10-1000 caracteres)
  fotos: FotoRequest[];         // Lista de 1-3 fotos
}

/**
 * Respuesta DTO de una foto
 */
export interface FotoDTO {
  id: number;
  reporteId: number;
  url: string;
  tipo: TipoFotoType;
  descripcion: string;
  fechaCarga: string;           // ISO 8601
}

/**
 * Respuesta completa al completar un reporte
 */
export interface CompletarReporteResponse {
  mensaje: string;
  reporte: any;                 // ReporteResponse del backend
  fotosAdjuntadas: number;
  estadoFinal: string;
  proximoPaso: string;
}
