import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import {Router} from 'express';


export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  const router = inject(Router);

  if (authService.isLoggedIn()) {

    return true;

  } else {

    // Il est crucial de retourner explicitement quelque chose ici

    router.navigate(['/login']);

    return false; // On informe Angular que l'accès est refusé

  }

};
