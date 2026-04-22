import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livre } from '../models/livre';

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/books';
  keyword: string = '';
  livres: any[] = [];

  // Récupérer tous les livres
  getLivres() {
    return this.http.get<any>(
      `http://localhost:8080/api/books`
    );
  }

  // 1. Récupérer un livre spécifique par son ISBN
  getLivreByIsbn(isbn: string): Observable<Livre> {
    return this.http.get<Livre>(`${this.API_URL}/isbn/${isbn}`);
  }

  // 2. Recherche par mot-clé (titre ou auteur)
  // Utilise HttpParams pour construire proprement l'URL : ?keyword=monMotCle
  searchLivres(keyword: string) {
    return this.http.get<any>(
      `http://localhost:8080/api/books/search?keyword=${keyword}`
    );
  }

  searchBooks() {
    this.http.get(`http://localhost:8080/api/books/search?keyword=${this.keyword}`)
      .subscribe((res: any) => this.livres = res.content);
  }
}
