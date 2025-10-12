// src/types/index.ts

export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  contraseniaHash: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface Reporte {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'infraestructura' | 'residuos' | 'otros';
  ubicacion: {
    latitud: number;
    longitud: number;
  };
  imagenUrl?: string;
  fechaCreacion: Date;
  estado: 'PENDIENTE' | 'REVISION' | 'PROCESO' | 'FINALIZADO' | 'RECHAZADO';
}

export interface ReportForm {
  tipo: '' | 'infraestructura' | 'residuos' | 'otros';
  descripcion: string;
  ubicacion: { lat: number; lng: number } | null;
  imagen: string | null; 
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}