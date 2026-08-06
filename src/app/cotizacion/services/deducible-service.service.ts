import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deducible, DeducibleRequest } from '../models/deducible.model';
import { PageResponse } from '../models/page.model';


@Injectable({
  providedIn: 'root'
})
export class DeducibleService {

  private baseUrl = 'http://localhost:9090/deducibles';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los deducibles de forma paginada.
   * @param page  número de página (0-based, como espera Spring)
   * @param size  cantidad de elementos por página
   * @param sort  campo(s) de orden. Puede ser un string ('campo,asc')
   *              o un array (['campo1,asc', 'campo2,desc'])
   */
  getAll(page: number = 0, size: number = 10, sort?: string | string[]): Observable<PageResponse<Deducible>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      const sortValues = Array.isArray(sort) ? sort : [sort];
      sortValues.forEach(s => {
        params = params.append('sort', s);
      });
    }

    return this.http.get<PageResponse<Deducible>>(`${this.baseUrl}/page`, { params });
  }

  getById(id: number): Observable<Deducible> {
    return this.http.get<Deducible>(`${this.baseUrl}/${id}`);
  }

  create(request: DeducibleRequest): Observable<Deducible> {
    return this.http.post<Deducible>(this.baseUrl, request);
  }

  update(id: number, request: DeducibleRequest): Observable<Deducible> {
    return this.http.put<Deducible>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}