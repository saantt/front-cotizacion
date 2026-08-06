import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/page.model';
import { environment } from '../../../environments/environment';
import { TomadorModule } from '../models/tomador/tomador.module';

@Injectable({
  providedIn: 'root'
})
export class TomadorServiceService {

    private apiURL = `${environment.apiUrl}/api/tomadores`;

  constructor(private http: HttpClient) { }

  getTomadoresPaginados(page: number = 0, size: number = 10): Observable<PageResponse<TomadorModule>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<TomadorModule>>(`${this.apiURL}/page`, { params });
  }

  crearTomador(tomador: TomadorModule): Observable<TomadorModule> {
    console.log(tomador);
    return this.http.post<TomadorModule>(this.apiURL,tomador);
  }

  updateTomador(cctomador: number, tomador:TomadorModule): Observable<TomadorModule> {
    return this.http.put<TomadorModule>(`${this.apiURL}/${cctomador}`,tomador);
  }

  deleteTomador(ccTomador: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${ccTomador}`);
  }
}
