import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import {authGuard} from './guards/auth.guard';
import {ProfilComponent} from './components/profil/profil.component';

export const routes: Routes = [

  // On protège la homepage : l'accès est interdit si le Guard renvoie false
  { path: 'homepage', component: HomepageComponent, canActivate: [authGuard] },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },
  { path: 'profil', component: ProfilComponent, canActivate: [authGuard] },

  // Si l'utilisateur arrive sur la racine (http://localhost:4200/), on l'envoie vers le login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Si l'utilisateur tape n'importe quoi dans l'URL, on le renvoie vers le login
  { path: '**', redirectTo: 'login' }

];
