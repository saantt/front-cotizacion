import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  token: string;
  username?: string;
}

const STORAGE_KEY = 'cotizacion-user';
const STORAGE_USERNAME_KEY = 'cotizacion-username';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = `${environment.apiUrl}/api/users/login`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.get<LoginResponse>(this.loginUrl, { params })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem(STORAGE_KEY, response.token);
          }
          if (response && response.username) {
            localStorage.setItem(STORAGE_USERNAME_KEY, response.username);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_USERNAME_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(STORAGE_USERNAME_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }
}
