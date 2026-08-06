export interface ImpuestoCotizacion {
  idImpuestoCot: number;
  idCotizacion: string;
  concepto: string;
  valor: number;
}

export interface ImpuestoCotizacionRequest {
  idCotizacion: string;
  concepto: string;
  valor: number;
}

export interface PaginaResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
