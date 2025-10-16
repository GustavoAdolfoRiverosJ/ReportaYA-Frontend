// src/types/cuenta.types.ts

export type TipoCuenta = 'CIUDADANO' | 'TECNICO' | 'OPERADOR_MUNICIPAL';

export interface Cuenta {
  id?: number;
  tipoCuenta: TipoCuenta;
  usuario: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  activo: boolean;
}

export interface CrearCuentaRequest {
  tipoCuenta: TipoCuenta;
  usuario: string;
  contrasena: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  activo: boolean;
}

export interface CuentaResponse {
  id: number;
  tipoCuenta: TipoCuenta;
  usuario: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  activo: boolean;
}
