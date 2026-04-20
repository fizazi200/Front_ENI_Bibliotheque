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

  // Récupérer tous les livres
  getAllLivres(): Observable<Livre[]> {
    return this.http.get<Livre[]>(this.API_URL);
  }

  // 1. Récupérer un livre spécifique par son ISBN
  getLivreByIsbn(isbn: string): Observable<Livre> {
    return this.http.get<Livre>(`${this.API_URL}/isbn/${isbn}`);
  }

  // 2. Recherche par mot-clé (titre ou auteur)
  // Utilise HttpParams pour construire proprement l'URL : ?keyword=monMotCle
  searchLivres(keyword: string): Observable<Livre[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Livre[]>(`${this.API_URL}/search`, { params });
  }
}