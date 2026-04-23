import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:8080/api/auth';

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private currentUserSubject = new BehaviorSubject<any>(null);

  getCurrentUser$ = this.currentUserSubject.asObservable();

  setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
  }

  getUser() {
    return this.currentUserSubject.value;
  }

  // 🔐 LOGIN
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data).pipe(
      tap((response: any) => {
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

  // 👤 GET CURRENT USER
  getCurrentUser() {
    const token = this.getToken();

    if (!token) {
      throw new Error("Token introuvable ❌");
    }

    return this.http.get(`${this.API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // ✏️ UPDATE USER
  updateCurrentUser(user: any) {
    const token = this.getToken();

    return this.http.put('http://localhost:8080/api/user/me', user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * 🛡️ Utilisé par GuestGuard
   * Retourne true si l'utilisateur est authentifié (token présent et valide)
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  /**
   * 🔍 Utilisé par AuthGuard
   * Vérifie la validité du token JWT
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // 🚪 LOGOUT
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token_session');
      this.currentUserSubject.next(null);
    }
  }

  // 🔑 GET TOKEN
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token_session');
    }
    return null;
  }

  setUser(user: any) {
    this.currentUserSubject.next(user);
  }
}