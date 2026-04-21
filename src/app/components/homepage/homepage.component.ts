import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importe Router
import { LivreService } from '../../services/livre.service';
import { Livre } from '../../models/livre';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent implements OnInit {
  private livreService = inject(LivreService);
  private router = inject(Router); // Injecte le Router

  livres: Livre[] = [];

  ngOnInit(): void {
    this.chargerLivres();
  }

  chargerLivres(): void {
    this.livreService.getLivres().subscribe({
      next: (donnees) => {
        // On garde ta petite astuce de mélange aléatoire pour les 3 suggestions
        this.livres = donnees
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      },
      error: (err) => console.error('Erreur lors de la récupération :', err)
    });
  }

  /**
   * C'est notre méthode "Propulseur"
   * Elle redirige vers le catalogue avec le mot-clé en paramètre
   */
  allerAuCatalogue(critere: string): void {
    if (critere.trim()) {
      // On navigue vers /catalogue?q=le-mot-clé
      this.router.navigate(['/catalogue'], { queryParams: { q: critere } });
    } else {
      // Si c'est vide, on va juste au catalogue normalement
      this.router.navigate(['/catalogue']);
    }
  }
}
