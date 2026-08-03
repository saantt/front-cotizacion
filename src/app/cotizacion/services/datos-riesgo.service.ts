import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatosRiesgoResponse } from '../models/datos-riesgos/datosRiesgoResponse.model';
import { Observable } from 'rxjs';
import { DatosRiesgoRequest } from '../models/datos-riesgos/datosRiesgoRequest.model';

@Injectable({
  providedIn: 'root'
})
export class DatosRiesgoService {

  private readonly apiURL = 'http://localhost:9090'

  constructor(private htppClient: HttpClient) { }

  getDatosRiesgo(): Observable<DatosRiesgoResponse[]> {
    return this.htppClient.get<DatosRiesgoResponse[]>(`${this.apiURL}/api/datos-riesgo`);
  }

  createDatosRiesgo(datosRiesgo: DatosRiesgoRequest): Observable<DatosRiesgoRequest> {
    return this.htppClient.post<DatosRiesgoRequest>(`${this.apiURL}/api/datos-riesgo`, datosRiesgo);
  }

  updateDatosRiesgo(id: string, datosRiesgo: DatosRiesgoRequest): Observable<DatosRiesgoRequest> {
    return this.htppClient.put<DatosRiesgoRequest>(`${this.apiURL}/api/datos-riesgo/${id}`, datosRiesgo);
  }

  deleteDatosRiesgo(id: string): Observable<void> {
    return this.htppClient.delete<void>(`${this.apiURL}/api/datos-riesgo/${id}`);
  }
}
