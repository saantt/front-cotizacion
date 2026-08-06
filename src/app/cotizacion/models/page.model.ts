export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Página actual (inicia en 0)
  first: boolean;
  last: boolean;
  empty: boolean;
}
