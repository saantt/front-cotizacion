export interface Deducible {
  id_deducible: number;
  porcentaje: number;
  monto_minimo: number;
}

export interface DeducibleRequest {
  porcentaje: number;
  monto_minimo: number;
}