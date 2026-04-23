import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Livre } from '../../models/livre';
import {DetailsLivreModalComponent} from '../details-livre-modal/details-livre-modal.component';

@Component({
  selector: 'app-liste-livres',
  standalone: true,
  imports: [CommonModule, RouterModule, DetailsLivreModalComponent],
  templateUrl: './liste-livres.component.html',
  styleUrl: './liste-livres.component.css'
})
export class ListeLivresComponent {

  // 📥 données venant du parent
  @Input() livres: Livre[] = [];

  // 📖 modal détail
  selectedLivre: Livre | null = null;

  // 🔍 reset filtres (appel depuis HTML)
  reinitFiltres(): void {
    // ⚠️ ici tu ne dois PAS charger API
    // juste notifier le parent (option propre)
    console.log("reset filtres");
  }

  // 👁️ ouvrir modal
  ouvrirDetails(livre: Livre): void {
    this.selectedLivre = livre;
    document.body.style.overflow = 'hidden';
  }

  fermerDetails(): void {
    this.selectedLivre = null;
    document.body.style.overflow = 'auto';
  }
  genererEtoiles(note: number): string {
    const fullStar = '⭐';
    return fullStar.repeat(Math.floor(note || 0));
  }
}
