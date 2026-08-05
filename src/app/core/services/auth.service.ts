import { Injectable } from '@angular/core';
const STORAGE_KEY = 'clase-angular-user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  login(username: string): void {
    localStorage.setItem(STORAGE_KEY, username);
  }
 
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
 
  isLoggedIn(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  }
 
  getUsername(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }
 
}