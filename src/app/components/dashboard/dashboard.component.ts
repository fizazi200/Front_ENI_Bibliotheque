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
    { titre: 'UML 2.5', dateDemande: '07/05/2026', status: 'En attente' },
    { titre: 'Design Patterns', dateDemande: '10/05/2026', status: 'Disponible' },
    { titre: 'Clean Code', dateDemande: '12/05/2026', status: 'Annulée' },
    { titre: 'Refactoring', dateDemande: '14/05/2026', status: 'En attente' },
    { titre: 'Docker pour les nuls', dateDemande: '15/05/2026', status: 'En attente' },
    { titre: 'Kubernetes 101', dateDemande: '16/05/2026', status: 'En attente' }
  ];

  prets: any[] = [
    { titre: 'SQL Guide', dateLimite: '21/04/2026', status: 'En retard', urgent: true, progress: 100 },
    { titre: 'Angular Pro', dateLimite: '15/06/2026', status: 'En cours', urgent: false, progress: 30 },
    { titre: 'Clean Code', dateLimite: '24/04/2026', status: 'En cours', urgent: true, progress: 95 },
    { titre: 'Git Master', dateLimite: '10/04/2026', status: 'Rendu', urgent: false, progress: 100 },
    { titre: 'Algorithmique Avancée', dateLimite: '30/05/2026', status: 'En cours', urgent: false, progress: 40 },
    { titre: 'The Pragmatic Programmer', dateLimite: '25/04/2026', status: 'En cours', urgent: true, progress: 90 },
    { titre: 'Node.js Expert', dateLimite: '28/04/2026', status: 'En cours', urgent: true, progress: 85 },
    { titre: 'Maîtriser GitHub', dateLimite: '05/05/2026', status: 'En cours', urgent: false, progress: 60 },
    { titre: 'Cybersécurité', dateLimite: '28/04/2026', status: 'En cours', urgent: true, progress: 88 },
    { titre: 'TypeScript Handbook', dateLimite: '20/06/2026', status: 'En cours', urgent: false, progress: 15 },
    { titre: 'React Native Expert', dateLimite: '14/05/2026', status: 'En cours', urgent: false, progress: 45 },
    { titre: 'Microservices', dateLimite: '02/05/2026', status: 'En cours', urgent: true, progress: 92 }
  ];

  // --- STATISTIQUES DYNAMIQUES ---
  get totalPrets(): number { return this.prets.length; }
  get totalReservations(): number { return this.reservations.length; }
  get nbEnRetard(): number { return this.prets.filter(p => p.status === 'En retard').length; }

  // --- SYSTÈME DE NOTIFICATIONS DYNAMIQUE ---
  get alertes() {
    const notifications: any[] = [];

    // 1. Alertes Retard (Rouge / Danger)
    const enRetard = this.prets.filter(p => p.status === 'En retard');
    enRetard.forEach(p => {
      notifications.push({
        type: 'danger',
        icon: '🚨',
        message: `Retard : "${p.titre}" (Dû le ${p.dateLimite})`
      });
    });

    // 2. Alertes Disponibilité (Jaune / Warning)
    const dispo = this.reservations.filter(r => r.status === 'Disponible');
    dispo.forEach(r => {
      notifications.push({
        type: 'warning',
        icon: '🔔',
        message: `Disponible : "${r.titre}" est prêt à être récupéré !`
      });
    });

    // 3. Infos générales (Bleu / Info)
    notifications.push({
      type: 'info',
      icon: 'ℹ️',
      message: "Pensez à renouveler vos livres avant la date limite."
    });

    return notifications;
  }

  // Configuration Pagination
  readonly itemsParPage = 5;
  pageRes = 1;
  pagePrets = 1;

  // États Modal
  showConfirmModal = false;
  selectedPret: any = null;

  ngOnInit() {
    setTimeout(() => { this.isLoading = false; }, 1500);
  }

  // --- LOGIQUE FILTRES & PAGINATION ---
  get resFiltrees() {
    return this.reservations.filter(r => r.titre.toLowerCase().includes(this.searchTermRes.toLowerCase()));
  }

  get totalPagesRes(): number {
    return Math.ceil(this.resFiltrees.length / this.itemsParPage) || 1;
  }

  get reservationsAffichees() {
    const debut = (this.pageRes - 1) * this.itemsParPage;
    return this.resFiltrees.slice(debut, debut + this.itemsParPage);
  }

  get pretsFiltres() {
    return this.prets.filter(p => p.titre.toLowerCase().includes(this.searchTermPrets.toLowerCase()));
  }

  get totalPagesPrets(): number {
    return Math.ceil(this.pretsFiltres.length / this.itemsParPage) || 1;
  }

  get pretsAffiches() {
    const debut = (this.pagePrets - 1) * this.itemsParPage;
    return this.pretsFiltres.slice(debut, debut + this.itemsParPage);
  }

  // --- ACTIONS ---
  changerPageRes(direction: number) { this.pageRes += direction; }
  changerPagePrets(direction: number) { this.pagePrets += direction; }

  ouvrirConfirmation(pret: any) {
    this.selectedPret = pret;
    this.showConfirmModal = true;
  }

  annulerConfirmation() {
    this.showConfirmModal = false;
    this.selectedPret = null;
  }

  confirmerRenouvellement() {
    if (this.selectedPret) {
      this.selectedPret.confirm = true;
      setTimeout(() => { if(this.selectedPret) this.selectedPret.confirm = false; }, 2000);
    }
    this.showConfirmModal = false;
  }
}