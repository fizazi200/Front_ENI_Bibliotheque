import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ReservationService} from '../../services/reservation.service';
import {LoanService} from '../../services/loan.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  reservations: any[] = [];
  isLoading: boolean = true;
  searchTermPrets: string = '';
  searchTermRes: string = '';
  private prets: any[] = [];
  constructor(private reservationService: ReservationService, private loanService   :LoanService) {

  }

  loading = false;
  //Charger depuis API
  loadLoans(){
    this.loanService.getMyLoans().subscribe({
      next: (data) => {

        // 🔥 mapping backend → UI
        this.prets = data.map((r: { id: any; dueDate:string,status:string,bookTitle: string; author: string; coverUrl: string; loanDate: any; }) => ({
          id: r.id,
          titre: r.bookTitle,
          auteur: r.author,
          dateLimite: r.dueDate,
          status: this.getStatusLabel(r.status),
        }));

        this.loading = false;
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  loadReservations() {
    this.loading = true;

    this.reservationService.getMyReservations().subscribe({
      next: (data) => {

        // 🔥 mapping backend → UI
        this.reservations = data.map((r: { id: any; book: { title: any; author: any; }; reservationDate: any; status: string; rankInLine: any; }) => ({
          id: r.id,
          titre: r.book?.title,
          auteur: r.book?.author,
          dateDemande: r.reservationDate,
          status: this.mapStatus(r.status),
          rank: r.rankInLine
        }));

        this.loading = false;
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  getStatusLabel(status: string): string {


    if (!status) return '';

    switch (status) {
      case 'ACTIVE': return 'En cours';
      case 'RETURNED': return 'Rendu';
      case 'OVERDUE': return 'En retard';
      default: return status;
    }
  }
  mapStatus(status: string): string {
    switch (status) {

      case 'PENDING':
        return 'En attente';

      case 'AVAILABLE':
        return 'Disponible';

      case 'CANCELED':
        return 'Annulée';

      default:
        return status;
    }
  }



  // --- ÉTATS DE TRI ---
  sortColRes: string | null = null;
  sortDirRes: 'asc' | 'desc' | null = null;

  sortColPrets: string | null = null;
  sortDirPrets: 'asc' | 'desc' | null = null;

  // --- STATISTIQUES DYNAMIQUES ---
  get totalPrets(): number { return this.prets.length; }
  get totalReservations(): number { return this.reservations.length; }
  get nbEnRetard(): number { return this.prets.filter(p => p.status === 'En retard').length; }

  // --- SYSTÈME DE NOTIFICATIONS ---
  get alertes() {
    const notifications: any[] = [];
    const enRetard = this.prets.filter(p => p.status === 'En retard');
    enRetard.forEach(p => {
      notifications.push({ type: 'danger', icon: '🚨', message: `Retard : "${p.titre}" (Dû le ${p.dateLimite})` });
    });
    const dispo = this.reservations.filter(r => r.status === 'Disponible');
    dispo.forEach(r => {
      notifications.push({ type: 'warning', icon: '🔔', message: `Disponible : "${r.titre}" est prêt !` });
    });
    notifications.push({ type: 'info', icon: 'ℹ️', message: "Pensez à renouveler vos livres à temps." });
    return notifications;
  }

  // --- MODAL & PAGINATION ---
  readonly itemsParPage = 5;
  pageRes = 1;
  pagePrets = 1;
  showConfirmModal = false;
  selectedPret: any = null;
  modalMode: 'confirm' | 'details' = 'details';

  ngOnInit() {
    setTimeout(() => { this.isLoading = false; }, 1500);
    this.loadReservations();
    this.loadLoans();
  }

  // --- LOGIQUE DE TRI ---
  toggleSortRes(column: string) {
    if (this.sortColRes === column) {
      this.sortDirRes = this.sortDirRes === 'asc' ? 'desc' : this.sortDirRes === 'desc' ? null : 'asc';
    } else {
      this.sortColRes = column;
      this.sortDirRes = 'asc';
    }
  }

  toggleSortPrets(column: string) {
    if (this.sortColPrets === column) {
      this.sortDirPrets = this.sortDirPrets === 'asc' ? 'desc' : this.sortDirPrets === 'desc' ? null : 'asc';
    } else {
      this.sortColPrets = column;
      this.sortDirPrets = 'asc';
    }
  }

  // --- GETTERS FILTRÉS & TRIÉS ---
  get resFiltrees() {
    let data = [...this.reservations].filter(r => r.titre.toLowerCase().includes(this.searchTermRes.toLowerCase()));
    if (this.sortColRes && this.sortDirRes) {
      data.sort((a: any, b: any) => {
        const valA = a[this.sortColRes!] || '';
        const valB = b[this.sortColRes!] || '';
        return this.sortDirRes === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return data;
  }

  get pretsFiltres() {
    let data = [...this.prets].filter(p => p.titre.toLowerCase().includes(this.searchTermPrets.toLowerCase()));
    if (this.sortColPrets && this.sortDirPrets) {
      data.sort((a: any, b: any) => {
        const valA = a[this.sortColPrets!] || '';
        const valB = b[this.sortColPrets!] || '';
        return this.sortDirPrets === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return data;
  }

  // --- PAGINATION ---
  get totalPagesRes() { return Math.ceil(this.resFiltrees.length / this.itemsParPage) || 1; }
  get reservationsAffichees() { return this.resFiltrees.slice((this.pageRes - 1) * this.itemsParPage, this.pageRes * this.itemsParPage); }

  get totalPagesPrets() { return Math.ceil(this.pretsFiltres.length / this.itemsParPage) || 1; }
  get pretsAffiches() { return this.pretsFiltres.slice((this.pagePrets - 1) * this.itemsParPage, this.pagePrets * this.itemsParPage); }

  // --- ACTIONS ---
  changerPageRes(dir: number) { this.pageRes += dir; }
  changerPagePrets(dir: number) { this.pagePrets += dir; }

  ouvrirDetails(item: any) {
    this.selectedPret = item;
    this.modalMode = 'details';
    this.showConfirmModal = true;
  }

  ouvrirConfirmation(pret: any) {
    this.selectedPret = pret;
    this.modalMode = 'confirm';
    this.showConfirmModal = true;
  }

  annulerConfirmation() {
    this.showConfirmModal = false;
    this.selectedPret = null;
  }

  confirmerRenouvellement() {
    if (this.selectedPret && this.modalMode === 'confirm') {
      this.selectedPret.confirm = true;
      setTimeout(() => { if(this.selectedPret) this.selectedPret.confirm = false; }, 2000);
    }
    this.showConfirmModal = false;
  }
}
