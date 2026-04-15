import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Cette méthode vérifie si un token existe dans le stockage du navigateur
  isLoggedIn(): boolean {
    // On vérifie si on a un token (exemple: 'token_session') dans le localStorage
    return !!localStorage.getItem('token_session');
  }

  // Optionnel : Méthode pour se déconnecter
  logout() {
    localStorage.removeItem('token_session');
  }
}
