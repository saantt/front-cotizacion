import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatosRiesgoResponse } from '../models/datos-riesgos/datosRiesgoResponse.model';
import { Observable } from 'rxjs';
import { DatosRiesgoRequest } from '../models/datos-riesgos/datosRiesgoRequest.model';
import { PageResponse } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosRiesgoService {

  private readonly apiURL = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

  getDatosRiesgo(): Observable<DatosRiesgoResponse[]> {
    return this.httpClient.get<DatosRiesgoResponse[]>(`${this.apiURL}/api/datos-riesgo`);
  }

  getDatosRiesgoPages(page: number, size: number): Observable<PageResponse<DatosRiesgoResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<PageResponse<DatosRiesgoResponse>>(`${this.apiURL}/api/datos-riesgo/page`, { params });
  }

  createDatosRiesgo(datosRiesgo: DatosRiesgoRequest): Observable<DatosRiesgoRequest> {

    console.log("datosRiesgo", datosRiesgo);

    return this.httpClient.post<DatosRiesgoRequest>(`${this.apiURL}/api/datos-riesgo`, datosRiesgo);
  }

  updateDatosRiesgo(id: string, datosRiesgo: DatosRiesgoRequest): Observable<DatosRiesgoRequest> {
    return this.httpClient.put<DatosRiesgoRequest>(`${this.apiURL}/api/datos-riesgo/${id}`, datosRiesgo);
  }

  deleteDatosRiesgo(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiURL}/api/datos-riesgo/${id}`);
  }
}
