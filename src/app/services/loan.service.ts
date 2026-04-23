import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = 'http://localhost:8080/api/loans';

  constructor(private http: HttpClient) {}

  borrowBook(bookId: number) {

    const token = localStorage.getItem('token_session');

    return this.http.post(
      `${this.apiUrl}/borrow/${bookId}`,
      {},
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    );
  }
}
