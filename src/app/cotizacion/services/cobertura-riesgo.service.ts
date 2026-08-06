import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoberturaRiesgo, CoberturaRiesgoRequest } from '../models/cobertura-riesgo.model';

@Injectable({
  providedIn: 'root'
})
export class CoberturaRiesgoService {

  private apiUrl = 'http://localhost:9090/coberturariesgo';

  private coberturasSubject = new BehaviorSubject<CoberturaRiesgo[]>([]);
  coberturas$ = this.coberturasSubject.asObservable();

  constructor(private http: HttpClient) { }

  cargarCoberturasRiesgo(): void {
    this.http.get<CoberturaRiesgo[]>(this.apiUrl)
      .subscribe((lista: CoberturaRiesgo[]) => this.coberturasSubject.next(lista));
  }

  /**
   * Obtiene coberturas de riesgo de forma paginada (server-side).
   * El backend debe exponer un endpoint /page que acepte parámetros page,size
   */
  getCoberturaRiesgoPage(page: number, size: number) {
    const params: any = {
      page: page.toString(), size: size.toString()
    };
    // Usamos /page para seguir el mismo patrón que otros servicios
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  crearCoberturaRiesgo(cobertura: CoberturaRiesgoRequest): Observable<CoberturaRiesgo> {
    return this.http.post<CoberturaRiesgo>(this.apiUrl, cobertura)
      .pipe(tap(() => this.cargarCoberturasRiesgo()));
  }

  actualizarCoberturaRiesgo(
    idCotizacion: string,
    idCobertura: string,
    cobertura: CoberturaRiesgoRequest
  ): Observable<CoberturaRiesgo> {
    return this.http.put<CoberturaRiesgo>(
      `${this.apiUrl}/${idCotizacion}/${idCobertura}`,
      cobertura
    ).pipe(tap(() => this.cargarCoberturasRiesgo()));
  }

  eliminarCoberturaRiesgo(idCotizacion: string, idCobertura: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idCotizacion}/${idCobertura}`)
      .pipe(tap(() => this.cargarCoberturasRiesgo()));
  }
}