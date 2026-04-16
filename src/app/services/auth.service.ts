import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // 🔐 LOGIN
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data).pipe(
      tap((response: any) => {
        // supposons que backend retourne { token: 'xxx' }
        localStorage.setItem('token_session', response.token);
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
    return !!localStorage.getItem('token_session');
  }

  // 🚪 LOGOUT
  logout() {
    localStorage.removeItem('token_session');
  }

  // 🔑 GET TOKEN
  getToken(): string | null {
    return localStorage.getItem('token_session');
  }
}
