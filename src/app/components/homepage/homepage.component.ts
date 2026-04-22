import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LivreService } from '../../services/livre.service';
import { Livre } from '../../models/livre';



@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  private livreService = inject(LivreService);

  keyword: string = '';
  livres: Livre[] = [];
  selectedLivre: Livre | null = null;
  ngOnInit(): void {
    this.getAllBooks();
  }

  // 📚 tous les livres
  getAllBooks(): void {
    this.livreService.getLivres().subscribe({
      next: (res: any) => {
        this.livres = res.content ?? res;
      },
      error: (err) => console.error(err)
    });
  }

  // 🔎 recherche
  searchBooks(): void {
    this.livreService.searchLivres(this.keyword).subscribe({
      next: (res: any) => {
        this.livres = res.content ?? res;
      },
      error: (err) => console.error(err)
    });
  }

  // 🎯 déclencheur barre de recherche
  onSearch(): void {
    if (this.keyword.trim() === '') {
      this.getAllBooks();
      return;
    }

    this.searchBooks();
  }


}
