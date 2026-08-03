import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoCotizacion, EstadoCotizacionRequest } from '../models/estado-cotizacion.model';


@Injectable({
  providedIn: 'root'
})
export class EstadoCotizacionService {

  private baseUrl = 'http://localhost:9090/api/estados-cotizacion';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EstadoCotizacion[]> {
    return this.http.get<EstadoCotizacion[]>(this.baseUrl);
  }

  getById(id: number): Observable<EstadoCotizacion> {
    return this.http.get<EstadoCotizacion>(`${this.baseUrl}/${id}`);
  }

  create(request: EstadoCotizacionRequest): Observable<EstadoCotizacion> {
    return this.http.post<EstadoCotizacion>(this.baseUrl, request);
  }

  update(id: number, request: EstadoCotizacionRequest): Observable<EstadoCotizacion> {
    return this.http.put<EstadoCotizacion>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}


