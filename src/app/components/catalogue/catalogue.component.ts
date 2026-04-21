import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router'; // 1. On ajoute ActivatedRoute
import { LivreService } from '../../services/livre.service';
import { Livre } from '../../models/livre';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent implements OnInit {
  private livreService = inject(LivreService);
  private route = inject(ActivatedRoute); // 2. On injecte la route active

  livres: Livre[] = [];
  categoriesDisponibles: string[] = ['Science-Fiction', 'Dystopie', 'Conte', 'Fantastique', 'Horreur', 'Thriller'];

  selectedCategories: string[] = [];
  selectedStatus: string = 'all';
  currentKeyword: string = '';

  ngOnInit(): void {
    // 3. On vérifie s'il y a un paramètre 'q' dans l'URL (provenant de la Home)
    const query = this.route.snapshot.queryParamMap.get('q');
    
    if (query) {
      this.currentKeyword = query;
      // On lance directement le filtrage avec ce mot-clé
      this.appliquerFiltres();
    } else {
      this.chargerToutLeCatalogue();
    }
  }

  chargerToutLeCatalogue(): void {
    this.livreService.getAllLivres().subscribe({
      next: (donnees) => {
        this.livres = donnees;
      },
      error: (err) => console.error('Erreur catalogue :', err)
    });
  }

  onSearch(event: Event): void {
    this.currentKeyword = (event.target as HTMLInputElement).value;
    this.appliquerFiltres();
  }

  onCategoryToggle(event: Event, category: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.appliquerFiltres();
  }

  onFilterChange(event: Event, type: string): void {
    const value = (event.target as HTMLSelectElement).value;
    if (type === 'status') this.selectedStatus = value;
    this.appliquerFiltres();
  }

  reinitFiltres(): void {
    this.currentKeyword = '';
    this.selectedCategories = [];
    this.selectedStatus = 'all';
    this.chargerToutLeCatalogue();
  }

  appliquerFiltres(): void {
    this.livreService.getAllLivres().subscribe({
      next: (donnees) => {
        let resultats = donnees;

        // 4. On ajuste ici : si currentKeyword existe, on filtre (même si < 2 car ça peut venir de l'URL)
        if (this.currentKeyword.trim()) {
          const key = this.currentKeyword.toLowerCase();
          resultats = resultats.filter(l => 
            l.title.toLowerCase().includes(key) || 
            l.author.toLowerCase().includes(key)
          );
        }

        if (this.selectedCategories.length > 0) {
          resultats = resultats.filter(l => l.category && this.selectedCategories.includes(l.category));
        }

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