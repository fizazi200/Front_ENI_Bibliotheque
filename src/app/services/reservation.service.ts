import { Injectable } from '@angular/core';
import {HttpService} from './bibliohttp/http.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private httpService: HttpService) {}

  // 📌 1. Créer une réservation
  reserveBook(bookId: number) {
    return this.httpService.post(
      this.apiUrl+'/'+bookId,
     null
    );
  }

  // 📌 2. Mes réservations
  getMyReservations() {
    return this.httpService.get(
      `${this.apiUrl}/my`
    );
  }

  // 📌 3. Supprimer / annuler une réservation
  deleteReservation(reservationId: number) {
    return this.httpService.delete(
      `${this.apiUrl}/${reservationId}`
    );
  }
}
