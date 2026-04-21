import {Component, Input, OnInit} from '@angular/core';
import { LivreService } from '../../services/livre.service';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-liste-livres',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './liste-livres.component.html',
  styleUrl: './liste-livres.component.css'
})
export class ListeLivresComponent implements OnInit {

  @Input() livres: any[] = [];


  constructor(private livreService: LivreService) {}

  ngOnInit(): void {
    this.getLivres();

  }

  // 🔥 GET livres depuis backend
  getLivres(): void {
    this.livreService.getLivres().subscribe({
      next: (data) => {
        console.log("DATA BACKEND:", data);

        this.livres = data.content; // 🔥 FIX ICI
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
