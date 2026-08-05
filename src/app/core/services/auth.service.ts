import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
  private readonly registerUrl = `${environment.apiUrl}/api/users/register`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.get<LoginResponse>(this.loginUrl, { params })
      .pipe(
        tap(response => this.storeSession(response)),
        catchError(error => this.handleAuthError(error))
      );
  }

  register(firstName: string, lastName: string, email: string, username: string, password: string): Observable<any> {
    const body = { firstName, lastName, email, username, password };
    return this.http.post(this.registerUrl, body);
  }

  private storeSession(response: LoginResponse | null | undefined): void {
    if (response && response.token) {
      localStorage.setItem(STORAGE_KEY, response.token);
    }
    if (response && response.username) {
      localStorage.setItem(STORAGE_USERNAME_KEY, response.username);
    }
  }

  private handleAuthError(error: any): Observable<never> {
    console.error('Auth request failed', error);
    return throwError(() => error);
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
