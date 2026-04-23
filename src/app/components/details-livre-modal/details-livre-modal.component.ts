import {Component, Input, Output,EventEmitter} from '@angular/core';
import {LoanResponse} from '../../models/LoanResponse';
import {LoanService} from '../../services/loan.service';
import {ToastrService} from 'ngx-toastr';
import {HttpErrorResponse} from '@angular/common/http';
import {ReservationService} from '../../services/reservation.service';
@Component({
  selector: 'app-details-livre-modal',
  imports: [],
  templateUrl: './details-livre-modal.component.html',
  styleUrl: './details-livre-modal.component.css'
})
export class DetailsLivreModalComponent {

  @Input() selectedLivre: any;
  @Output() closeModal = new EventEmitter<void>();
  constructor(
    private loanService: LoanService,
    private reservationService: ReservationService,

    private toastr: ToastrService
  ) {}
  fermerDetails(): void {
    this.selectedLivre = null;
    document.body.style.overflow = 'auto';
    this.closeModal.emit();
  }
  genererEtoiles(note: number): string {
    const fullStar = '⭐';
    return fullStar.repeat(Math.floor(note || 0));
  }

  loading = false;



  borrow(bookId: number) {
    this.loading = true;
    const token = localStorage.getItem('token_session');

    console.log("TOKEN =>", token); // 👈 ici
    this.loanService.borrowBook(bookId).subscribe({
      next: (res: any) => {

        this.toastr.success(
          `Retour prévu le ${res.dueDate}`,
          res.message
        );

        this.loading = false;
        this.loadBooks();
      },

      error: (err: any) => {

        console.log("FULL ERROR => ", err);
        console.log("BACKEND RESPONSE => ", err.error);

        this.toastr.error(
          err.error?.message || 'Erreur lors de l’emprunt',
          'Erreur ❌'
        );

        this.loading = false;
      }
    });
  }

  loadBooks() {
    // reload books from API
  }


reserve(bookId: number) {
  this.loading = true;

  const token = localStorage.getItem('token_session');
  console.log("TOKEN =>", token);
  //this.reservationService.getMyReservations().subscribe();
  this.reservationService.reserveBook(bookId).subscribe({
    next: (res: any) => {

      console.log("RES =>", res);

      // ✔ backend renvoie toujours PENDING
      if (res.status === 'PENDING') {
        this.toastr.success(
          'Réservation enregistrée avec succès ✅',
          'Succès'
        );
      }

      this.loading = false;
      this.loadBooks(); // refresh liste livres
    },

    error: (err: HttpErrorResponse) => {
      console.error(err);

      this.toastr.error(
        err.error || 'Erreur lors de la réservation ❌',
        'Erreur'
      );

      this.loading = false;
    }
  });
}




}

