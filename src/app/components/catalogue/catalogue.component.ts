import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LivreService } from '../../services/livre.service';
import { Livre } from '../../models/livre';
import { ListeLivresComponent } from '../liste-livres/liste-livres.component';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, RouterModule, ListeLivresComponent],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent implements OnInit {

  private livreService = inject(LivreService);
  private route = inject(ActivatedRoute);

  livres: Livre[] = [];         // 🔥 affichage
  allLivres: Livre[] = [];     // 🔥 source brute

  selectedCategories: string[] = [];
  selectedStatus: string = 'all';
  currentKeyword: string = '';

  categoriesDisponibles: string[] = [
    'Science-Fiction',
    'Dystopie',
    'Conte',
    'Fantastique',
    'Horreur',
    'Thriller',
    'Non-fiction',
    'Historique'
  ];

  ngOnInit(): void {
    const query = this.route.snapshot.queryParamMap.get('q');

    if (query) {
      this.currentKeyword = query;
    }

    this.loadBooks();
  }

  // 🔥 appel backend UNIQUE
  loadBooks(): void {
    this.livreService.getLivres().subscribe({
      next: (data: any) => {
        // ⚠️ backend pageable => content
        this.allLivres = data?.content || data || [];
        this.applyFilters();
      },
      error: (err) => console.error('Erreur chargement livres', err)
    });
  }

  onSearch(event: Event): void {
    this.currentKeyword = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onCategoryToggle(event: Event, category: string): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }

    this.applyFilters();
  }

  onFilterChange(event: Event, type: string): void {
    const value = (event.target as HTMLSelectElement).value;

    if (type === 'status') {
      this.selectedStatus = value;
    }

    this.applyFilters();
  }

  resetFilters(): void {
    this.currentKeyword = '';
    this.selectedCategories = [];
    this.selectedStatus = 'all';

    // Décoche les checkboxes dans le DOM si nécessaire
    this.livres = [...this.allLivres];
  }

  // 🔥 FILTRAGE LOCAL
  applyFilters(): void {
    let result = [...this.allLivres];

    // 1. Recherche par mot-clé
    if (this.currentKeyword.trim()) {
      const key = this.currentKeyword.toLowerCase();

      result = result.filter(l =>
        l.title?.toLowerCase().includes(key) ||
        l.author?.toLowerCase().includes(key)
      );
    }

    // 2. Catégories (Correction Insensibilité à la casse & Normalisation MAJUSCULES)
    if (this.selectedCategories.length > 0) {
      const selectedUpper = this.selectedCategories.map(c => c.toUpperCase());
      
      result = result.filter(l => {
        const bookCategoryUpper = (l.category ?? '').toUpperCase();
        return selectedUpper.includes(bookCategoryUpper);
      });
    }

    // 3. Status
    if (this.selectedStatus === 'available') {
      result = result.filter(l => l.availableCopies > 0);
    } else if (this.selectedStatus === 'unavailable') {
      result = result.filter(l => l.availableCopies === 0);
    }

    this.livres = result;
  }
}