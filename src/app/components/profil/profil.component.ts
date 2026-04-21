import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nom: [''],
      prenom: [''],
      email: ['']
    });

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.form.patchValue(user);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSubmit() {
    console.log("CLICK OK", this.form.value);

    this.authService.updateCurrentUser(this.form.value)
      .subscribe({
        next: (updatedUser) => {
          this.authService.setUser(updatedUser); // 🔥 TRÈS IMPORTANT
          this.toastr.success("Profil mis à jour ✅");
          this.router.navigate(['/homepage']);
        },
        error: (err) => {
          console.error("Erreur update", err);
        }
      });
  }



}
