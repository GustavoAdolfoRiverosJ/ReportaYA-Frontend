// src/types/enums.ts

/**
 * Estados posibles de un reporte
 */
export enum EstadoReporte {
  PENDIENTE = 'PENDIENTE',   // Recién creado por el ciudadano
  REVISION = 'REVISION',     // En revisión por el operador municipal
  PROCESO = 'PROCESO',       // Técnico asignado y trabajando
  RESUELTA = 'RESUELTA',     // Trabajo completado por el técnico
  CERRADA = 'CERRADA',       // Validado y cerrado por el operador
  RECHAZADO = 'RECHAZADO'    // Reporte inválido o duplicado
}

/**
 * Niveles de prioridad de un reporte
 */
export enum Prioridad {
  BAJA = 'BAJA',     // Prioridad baja
  MEDIA = 'MEDIA',   // Prioridad media (por defecto)
  ALTA = 'ALTA'      // Prioridad alta
}

/**
 * Tipos de foto en un reporte
 */
export enum TipoFoto {
  INICIAL = 'INICIAL',   // Foto inicial del problema
  PROCESO = 'PROCESO',   // Foto durante la solución
  FINAL = 'FINAL'        // Foto del resultado final
}

// Type aliases para uso flexible
export type EstadoReporteType = 'PENDIENTE' | 'REVISION' | 'PROCESO' | 'RESUELTA' | 'CERRADA' | 'RECHAZADO' | 'RECHAZADO_AUDITO';
export type PrioridadType = 'BAJA' | 'MEDIA' | 'ALTA';
export type TipoFotoType = 'INICIAL' | 'PROCESO' | 'FINAL';
