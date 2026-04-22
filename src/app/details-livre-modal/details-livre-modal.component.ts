import {Component, Input, Output,EventEmitter} from '@angular/core';
@Component({
  selector: 'app-details-livre-modal',
  imports: [],
  templateUrl: './details-livre-modal.component.html',
  styleUrl: './details-livre-modal.component.css'
})
export class DetailsLivreModalComponent {

  @Input() selectedLivre: any;
  @Output() closeModal = new EventEmitter<void>();
  constructor() {
  }
  fermerDetails(): void {
    this.selectedLivre = null;
    document.body.style.overflow = 'auto';
    this.closeModal.emit();
  }
  genererEtoiles(note: number): string {
    const fullStar = '⭐';
    return fullStar.repeat(Math.floor(note || 0));
  }
}
