// src/types/pagination.types.ts
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // página actual (0-indexed)
  size: number;   // tamaño de página
  first: boolean;
  last: boolean;
}