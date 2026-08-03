export interface EstadoCotizacion {
  id_estado: number;
  descripcion: string;
  estado: string;
  fec_inicio: string;
  fec_fin: string;
}

export interface EstadoCotizacionRequest {
  descripcion: string;
  estado: string;
  fec_inicio: string;
  fec_fin: string;
}