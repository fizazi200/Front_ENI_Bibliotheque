import { Component } from '@angular/core';
import {Livre} from '../models/livre';

@Component({
  selector: 'app-detail-livre',
  imports: [],
  templateUrl: './detail-livre.component.html',
  styleUrl: './detail-livre.component.css'
})
export class DetailLivreComponent {
  selectedLivre: Livre | null = null;
  // 👁️ ouvrir modal


  // ❌ fermer modal
  fermerDetails(): void {
    this.selectedLivre = null;
    document.body.style.overflow = 'auto';
  }

  genererEtoiles(note: number): string {
    const fullStar = '⭐';
    return fullStar.repeat(Math.floor(note || 0));
  }

}
