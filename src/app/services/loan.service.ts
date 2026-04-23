import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpService} from './bibliohttp/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = 'http://localhost:8080/api/loans';

  constructor(private httpService: HttpService) {}
  getMyLoans() {
    return this.httpService.get(
      `${this.apiUrl}/my`
    );
  }
  borrowBook(bookId: number) {

    const token = localStorage.getItem('token_session');

    return this.httpService.post(
      `${this.apiUrl}/borrow/${bookId}`,
      null
    );
  }
}
