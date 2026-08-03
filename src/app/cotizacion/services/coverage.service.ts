import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coverage, CoverageRequest } from '../models/coverage.model';


@Injectable({
  providedIn: 'root'
})

export class CoverageService {

  private baseUrl = 'http://localhost:9090/coverage';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Coverage[]> {
    return this.http.get<Coverage[]>(this.baseUrl);
  }

  getById(id: string): Observable<Coverage> {
    return this.http.get<Coverage>(`${this.baseUrl}/${id}`);
  }

  create(request: CoverageRequest): Observable<Coverage> {
    return this.http.post<Coverage>(this.baseUrl, request);
  }

  update(id: string, request: CoverageRequest): Observable<Coverage> {
    return this.http.put<Coverage>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

