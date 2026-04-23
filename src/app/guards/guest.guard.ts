import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ton service existant

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/homepage']); // Redirige vers l'accueil interne
    return false; // Bloque l'accès à la page de login
  }
  
  return true; // Laisse passer si c'est un visiteur (non connecté)
};