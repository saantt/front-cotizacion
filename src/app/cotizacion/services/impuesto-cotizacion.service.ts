import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ImpuestoCotizacion,
  ImpuestoCotizacionRequest,
  PaginaResponse
} from '../models/impuesto-cotizacion/impuesto-cotizacion.model';

@Injectable({
  providedIn: 'root'
})
export class ImpuestoCotizacionService {

  private baseUrl = `${environment.apiUrl}/api/impuestos-cotizacion`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ImpuestoCotizacion[]> {
    return this.http.get<ImpuestoCotizacion[]>(this.baseUrl);
  }

  getPage(page: number, size: number): Observable<PaginaResponse<ImpuestoCotizacion>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<PaginaResponse<ImpuestoCotizacion> | ImpuestoCotizacion[]>(this.baseUrl, { params })
      .pipe(
        map(response => {
          // Compatibilidad temporal con el backend actual, que aun devuelve un arreglo.
          // Cuando el backend devuelva una pagina, esta rama deja de utilizarse.
          if (Array.isArray(response)) {
            const start = page * size;
            const content = response.slice(start, start + size);
            const totalElements = response.length;
            const totalPages = Math.ceil(totalElements / size);

            return {
              content,
              totalElements,
              totalPages,
              number: page,
              size,
              first: page === 0,
              last: totalPages === 0 || page >= totalPages - 1
            };
          }

          return response;
        })
      );
  }

  getById(id: number): Observable<ImpuestoCotizacion> {
    return this.http.get<ImpuestoCotizacion>(`${this.baseUrl}/${id}`);
  }

  create(request: ImpuestoCotizacionRequest): Observable<ImpuestoCotizacion> {
    return this.http.post<ImpuestoCotizacion>(this.baseUrl, request);
  }

  update(id: number, request: ImpuestoCotizacionRequest): Observable<ImpuestoCotizacion> {
    return this.http.put<ImpuestoCotizacion>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
