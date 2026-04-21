import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { CatalogueComponent } from './components/catalogue/catalogue.component'; // Importation à ajouter
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  // Page d'accueil (Suggestions)
  { path: 'homepage', component: HomepageComponent, canActivate: [authGuard] },

  // Nouvelle page Catalogue (Recherche et filtres)
  { path: 'catalogue', component: CatalogueComponent, canActivate: [authGuard] },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  // Redirection par défaut vers le login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard : toute URL inconnue renvoie vers le login
  { path: '**', redirectTo: 'login' }

];
