import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deducible, DeducibleRequest } from '../models/deducible.model';


@Injectable({
  providedIn: 'root'
})
export class DeducibleService {

  private baseUrl = 'http://localhost:9090/deducibles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Deducible[]> {
    return this.http.get<Deducible[]>(this.baseUrl);
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


