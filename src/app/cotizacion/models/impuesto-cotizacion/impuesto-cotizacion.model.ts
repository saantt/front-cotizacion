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
