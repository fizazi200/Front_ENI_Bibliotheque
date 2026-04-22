import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isLoginMode = signal(true);
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {

    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

  toggleMode() {
    this.router.navigate(['/register']);
  }

  private updateValidators() {
    const isLogin = this.isLoginMode();

    const nom = this.authForm.get('nom');
    const prenom = this.authForm.get('prenom');

    if (!isLogin) {
      nom?.setValidators([Validators.required]);
      prenom?.setValidators([Validators.required]);
      nom?.enable();
      prenom?.enable();
    } else {
      nom?.clearValidators();
      prenom?.clearValidators();
      nom?.setValue('');
      prenom?.setValue('');
      nom?.disable();
      prenom?.disable();
    }

    nom?.updateValueAndValidity();
    prenom?.updateValueAndValidity();
  }

  // 🔥 CORRECTION ICI
  onSubmit() {

    if (this.authForm.invalid) return;

    const loginData = {
      email: this.authForm.value.email,
      password: this.authForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: () => {

        // 🔥 récupérer le user après login
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            this.authService.setCurrentUser(user); // ✅ IMPORTANT

            this.toastr.success("Connexion réussie ✅");
            this.router.navigate(['/homepage']);
          },
          error: (err) => {
            console.error("Erreur récupération user", err);
          }
        });

      },
      error: (err) => {
        console.error("Erreur login", err);
      }
    });
  }
}
