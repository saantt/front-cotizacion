export interface Coverage {
  id_cobertura: string;
  nombre_cobertura: string ;
  tasa_publico: number;
  tasa_particular: number;
}

export interface CoverageRequest {
  nombre_cobertura: string ;
  tasa_publico: number;
  tasa_particular: number;
}