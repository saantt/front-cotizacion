export interface CoberturaRiesgo {
    idCotizacion: string;
    idCobertura: string;
    idDeducible: number | null;
    primaCobertura: number;
}
export interface CoberturaRiesgoRequest {
    idCotizacion: string;
    idCobertura: string;
    idDeducible: number | null;
    primaCobertura: number;
}