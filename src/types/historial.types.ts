export interface HistorialEstado {
  id: number;
  reporteId: number;
  estadoAnterior: string | null;
  estadoNuevo: string;
  fechaCambio: string;
}
