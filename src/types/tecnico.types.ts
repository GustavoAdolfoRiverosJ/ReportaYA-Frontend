// src/types/tecnico.types.ts

export interface Tecnico {
  id?: number;
  usuario: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  activo: boolean;
}

export interface TecnicoResponse {
  id: number;
  usuario: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  activo: boolean;
}
