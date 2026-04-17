import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:8080/api/auth';
  
  // On injecte HttpClient et l'ID de la plateforme
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  

  // Informations USER
  getCurrentUser() {
  const token = localStorage.getItem('token_session');
  return this.http.get('http://localhost:8080/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

  // 🔐 LOGIN
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data).pipe(
      tap((response: any) => {
        // On ne stocke le token que si on est dans le navigateur
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token_session', response.token);
        }
      })
    );
  }

  // 🧾 REGISTER
  register(data: {
    nom: string;
    prenom: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  // 🔍 CHECK LOGIN
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token_session');
    }
    return false; // Côté serveur, on fait comme si on n'était pas connecté
  }

  // 🚪 LOGOUT
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token_session');
    }
  }

  // 🔑 GET TOKEN
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token_session');
    }
    return null;
  }
}