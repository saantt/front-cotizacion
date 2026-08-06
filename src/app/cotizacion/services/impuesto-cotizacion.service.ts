import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getPage(page: number, size: number): Observable<PaginaResponse<ImpuestoCotizacion>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginaResponse<ImpuestoCotizacion>>(this.baseUrl, { params });
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
