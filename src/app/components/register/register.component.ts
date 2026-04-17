import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  authForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private toastr: ToastrService) {

    this.authForm = this.fb.group({

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],

      nom: [''],
      prenom: ['']
    });

    this.updateValidators();
  }

  redirectToConnexion() {
    this.router.navigate(['/login']);
  }

  private updateValidators() {


    const nom = this.authForm.get('nom');
    const prenom = this.authForm.get('prenom');

      nom?.setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[A-Za-zÀ-ÿ\s-]+$/)
      ]);

      prenom?.setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[A-Za-zÀ-ÿ\s-]+$/)
      ]);

      nom?.enable();
      prenom?.enable();



    nom?.updateValueAndValidity();
    prenom?.updateValueAndValidity();
  }

  onSubmit() {

    if (this.authForm.invalid) return;


      const registerData = {
        nom: this.authForm.value.nom,
        prenom: this.authForm.value.prenom,
        email: this.authForm.value.email,
        password: this.authForm.value.password
      };

      console.log("REGISTER :", registerData);
      this.errorMessage = null; // On réinitialise l'erreur avant de lancer l'appel

      this.authService.register(registerData).subscribe({
        next: (res)  => {
          console.log("SUCCESS:", res);
          this.toastr.success(res.message || "Inscription réussie ✅");
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error("Erreur Inscription", err);
          this.toastr.error(err.error?.message || "Erreur d'inscription", 'Échec');

          // On récupère le message renvoyé par Spring Boot (Response Body)
          // Si c'est du texte brut, c'est err.error
          if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = "Une erreur est survenue lors de l'inscription.";
          }
        }
      });
  }
    // 👉 appel backend Spring Boot ici

}
