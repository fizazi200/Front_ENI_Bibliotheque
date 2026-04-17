import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, FooterBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ENI_bibliotheque';
  public authService = inject(AuthService);
}
