// src/types/enums.ts

/**
 * Estados posibles de un reporte
 */
export enum EstadoReporte {
  PENDIENTE = 'PENDIENTE',   // Estado inicial
  REVISION = 'REVISION',     // En revisión por autoridades
  PROCESO = 'PROCESO',       // En proceso de solución
  FINALIZADO = 'FINALIZADO', // Problema resuelto
  RECHAZADO = 'RECHAZADO'    // Reporte rechazado
}

/**
 * Niveles de prioridad de un reporte
 */
export enum Prioridad {
  BAJA = 'BAJA',     // Prioridad baja
  MEDIA = 'MEDIA',   // Prioridad media (por defecto)
  ALTA = 'ALTA'      // Prioridad alta
}

// Type aliases para uso flexible
export type EstadoReporteType = 'PENDIENTE' | 'REVISION' | 'PROCESO' | 'FINALIZADO' | 'RECHAZADO';
export type PrioridadType = 'BAJA' | 'MEDIA' | 'ALTA';
