import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  livres: Livre[] = [];

  // Liste des catégories pour le menu (à terme, peut venir du backend)
  categoriesDisponibles: string[] = ['Science-Fiction', 'Dystopie', 'Conte', 'Fantastique', 'Horreur', 'Thriller'];
  
  // État des filtres
  selectedCategories: string[] = []; // Tableau pour le multi-choix
  selectedStatus: string = 'all';
  currentKeyword: string = '';

  ngOnInit(): void {
    this.chargerLivres();
  }

  chargerLivres(): void {
    this.livreService.getAllLivres().subscribe({
      next: (donnees) => {
        // Mélange aléatoire et sélection des 3 premiers
        this.livres = donnees
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      },
      error: (err) => console.error('Erreur lors de la récupération :', err)
    });
  }

  // Gère la barre de recherche
  onSearch(event: Event): void {
    this.currentKeyword = (event.target as HTMLInputElement).value;
    this.appliquerFiltres();
  }

  // Gère l'ajout/retrait des catégories dans le tableau
  onCategoryToggle(event: Event, category: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      // On ajoute la catégorie si elle n'y est pas
      this.selectedCategories.push(category);
    } else {
      // On retire la catégorie
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.appliquerFiltres();
  }

  // Gère le changement des menus déroulants
  onFilterChange(event: Event, type: string): void {

    const value = (event.target as HTMLSelectElement).value;
    if (type === 'status') this.selectedStatus = value;
    this.appliquerFiltres();
  
  }

  // Méthode centrale qui décide quoi afficher
  appliquerFiltres(): void {
    // Si aucun critère n'est rempli, on remet les suggestions aléatoires
    if (this.currentKeyword.trim().length <= 2 && 
        this.selectedCategories.length === 0 && 
        this.selectedStatus === 'all') {
      this.chargerLivres();
      return;
    }

    // Sinon, on demande au service (ou on filtre localement si tu utilises les Mocks)
    this.livreService.getAllLivres().subscribe({
      next: (donnees) => {
        let resultats = donnees;

        // 1. Filtre par texte (si plus de 2 caractères)
        if (this.currentKeyword.trim().length > 2) {
          const key = this.currentKeyword.toLowerCase();
          resultats = resultats.filter(l => 
            l.title.toLowerCase().includes(key) || 
            l.author.toLowerCase().includes(key)
          );
        }

        // 2. Multi-filtre par catégories
        // On ajoute une vérification : l.category doit exister ET être dans le tableau
        if (this.selectedCategories.length > 0) {
          resultats = resultats.filter(l => l.category && this.selectedCategories.includes(l.category));
        }

        // 3. Filtre par disponibilité
        if (this.selectedStatus === 'available') {
          resultats = resultats.filter(l => l.availableCopies > 0);
        } else if (this.selectedStatus === 'unavailable') {
          resultats = resultats.filter(l => l.availableCopies === 0);
        }

        this.livres = resultats;
      }
    });
  }
}