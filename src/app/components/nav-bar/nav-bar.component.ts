//import { Component } from '@angular/core';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  // On n'importe que ce qui est utilisé dans le HTML (les directives)
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

user: any;
/*
ngOnInit() {
  this.user = this.authService.getUser();
  console.log(this.user);
}
*/
  ngOnInit() {
    this.authService.getCurrentUser$.subscribe((user: any) => {
      this.user = user;
    });
  }

  logout() {
    console.log('Déconnexion demandée');
    this.authService.logout();
    // On affiche un petit message
    this.toastr.info('Vous avez été déconnecté', 'À bientôt !');
    // On redirige vers le login
    this.router.navigate(['/login']);
  }

}
