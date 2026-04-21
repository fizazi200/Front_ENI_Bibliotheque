import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { ProfilComponent } from './components/profil/profil.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Page d'accueil
  { path: 'homepage', component: HomepageComponent, canActivate: [authGuard] },

  // Catalogue
  { path: 'catalogue', component: CatalogueComponent, canActivate: [authGuard] },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Profil
  { path: 'profil', component: ProfilComponent, canActivate: [authGuard] },

  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard
  { path: '**', redirectTo: 'login' }
];
