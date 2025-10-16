// src/types/asignacion.types.ts

export interface Asignacion {
  id?: number;
  reporteId: number;
  operadorId: number;
  tecnicoId: number;
  reporteTitulo?: string;
  operadorNombre?: string;
  tecnicoNombre?: string;
  fechaAsignacion?: string; // ISO 8601 string
  fechaCierre?: string; // ISO 8601 string
}

export interface CrearAsignacionRequest {
  reporteId: number;
  operadorId: number;
  tecnicoId: number;
}

export interface AsignacionResponse {
  id: number;
  reporteId: number;
  operadorId: number;
  tecnicoId: number;
  reporteTitulo: string;
  operadorNombre: string;
  tecnicoNombre: string;
  fechaAsignacion: string; // ISO 8601 string
  fechaCierre?: string; // ISO 8601 string (opcional si está activa)
}
