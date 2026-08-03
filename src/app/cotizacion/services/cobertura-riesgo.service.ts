import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoberturaRiesgo } from '../models/cobertura-riesgo.model';

@Injectable({
  providedIn: 'root'
})
export class CoberturaRiesgoService {

  private apiUrl = 'http://localhost:8080/coberturariesgo';

  private coberturasSubject = new BehaviorSubject<CoberturaRiesgo[]>([]);
  coberturas$ = this.coberturasSubject.asObservable();

  constructor(private http: HttpClient) { }

  cargarCoberturasRiesgo(): void {
    this.http.get<CoberturaRiesgo[]>(this.apiUrl)
      .subscribe((lista: any) => this.coberturasSubject.next(lista));
  }

  crearCoberturaRiesgo(cobertura: CoberturaRiesgo): Observable<CoberturaRiesgo> {
    return this.http.post<CoberturaRiesgo>(this.apiUrl, cobertura)
      .pipe(tap(() => this.cargarCoberturasRiesgo()));
  }

  actualizarCoberturaRiesgo(
    idCotizacion: string,
    idCobertura: string,
    cobertura: CoberturaRiesgo
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
