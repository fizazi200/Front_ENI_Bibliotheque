import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  isLoading: boolean = true;
  searchTermPrets: string = '';
  searchTermRes: string = '';

  reservations = [
    { titre: 'UML 2.5', dateDemande: '07/05/2026', status: 'En attente', auteur: 'Pascal Roques' },
    { titre: 'Design Patterns', dateDemande: '10/05/2026', status: 'Disponible', auteur: 'Erich Gamma' },
    { titre: 'Clean Code', dateDemande: '12/05/2026', status: 'Annulée', auteur: 'Robert C. Martin' },
    { titre: 'Refactoring', dateDemande: '14/05/2026', status: 'En attente', auteur: 'Martin Fowler' },
    { titre: 'Docker pour les nuls', dateDemande: '15/05/2026', status: 'En attente', auteur: 'J.G. Fischer' },
    { titre: 'Kubernetes 101', dateDemande: '16/05/2026', status: 'En attente', auteur: 'Nigel Poulton' }
  ];

  prets: any[] = [
    { titre: 'SQL Guide', dateLimite: '21/04/2026', status: 'En retard', urgent: true, progress: 100, auteur: 'Joe Celko' },
    { titre: 'Angular Pro', dateLimite: '15/06/2026', status: 'En cours', urgent: false, progress: 30, auteur: 'Adam Freeman' },
    { titre: 'Clean Code', dateLimite: '24/04/2026', status: 'En cours', urgent: true, progress: 95, auteur: 'Robert C. Martin' },
    { titre: 'Git Master', dateLimite: '10/04/2026', status: 'Rendu', urgent: false, progress: 100, auteur: 'Scott Chacon' },
    { titre: 'Algorithmique Avancée', dateLimite: '30/05/2026', status: 'En cours', urgent: false, progress: 40, auteur: 'T. Cormen' },
    { titre: 'The Pragmatic Programmer', dateLimite: '25/04/2026', status: 'En cours', urgent: true, progress: 90, auteur: 'Andrew Hunt' },
    { titre: 'Node.js Expert', dateLimite: '28/04/2026', status: 'En cours', urgent: true, progress: 85, auteur: 'David Mark' },
    { titre: 'Maîtriser GitHub', dateLimite: '05/05/2026', status: 'En cours', urgent: false, progress: 60, auteur: 'Ben Straub' },
    { titre: 'Cybersécurité', dateLimite: '28/04/2026', status: 'En cours', urgent: true, progress: 88, auteur: 'Bruce Schneier' },
    { titre: 'TypeScript Handbook', dateLimite: '20/06/2026', status: 'En cours', urgent: false, progress: 15, auteur: 'Anders Hejlsberg' },
    { titre: 'React Native Expert', dateLimite: '14/05/2026', status: 'En cours', urgent: false, progress: 45, auteur: 'Mauricio Fortunato' },
    { titre: 'Microservices', dateLimite: '02/05/2026', status: 'En cours', urgent: true, progress: 92, auteur: 'Sam Newman' }
  ];

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