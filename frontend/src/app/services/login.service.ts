import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from '../interfaces/login-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
   url = 'https://localhost:7035/api/login';
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
  checkTokenExpiry(): void {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeJWT(token);
      if (decoded && decoded.exp) {
        const now = Math.floor(Date.now() / 1000); // correct conversion
        if (decoded.exp < now) {
          console.warn('Token expired at:', decoded.exp, 'Current time:', now);
          this.logout(); // remove token
          this.router.navigate(['/login']); // redirect to login
        }
      }
    }
  }
  login(login: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, login);
  }

  loginSuccess(token: string): void {
    // Clear any leftover quiz state from a previous session
    localStorage.removeItem('quizStarted');
    localStorage.removeItem('quizState');

    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const name = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

    if (role) {
      localStorage.setItem('role', role);
    }
    if (name) {
      localStorage.setItem('name', name);
    }
    if (email) {
      localStorage.setItem('email', email);
    }
    sessionStorage.setItem('token', token);
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getName(): string | null {
    return localStorage.getItem('name');
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }
  isTeacher(): boolean {
    return this.getRole() === 'Teacher';
  }

  decodeJWT(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    // sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
