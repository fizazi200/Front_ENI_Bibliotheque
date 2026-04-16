import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {

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

  toggleMode() {
    this.isLoginMode.update(v => !v);
    this.updateValidators();
  }

  private updateValidators() {

    const isLogin = this.isLoginMode();

    const nom = this.authForm.get('nom');
    const prenom = this.authForm.get('prenom');

    if (!isLogin) {

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

  onSubmit() {

    if (this.authForm.invalid) return;

    if (this.isLoginMode()) {

      const loginData = {
        email: this.authForm.value.email,
        password: this.authForm.value.password
      };

      console.log("LOGIN :", loginData);

    } else {

      const registerData = {
        nom: this.authForm.value.nom,
        prenom: this.authForm.value.prenom,
        email: this.authForm.value.email,
        password: this.authForm.value.password
      };

      console.log("REGISTER :", registerData);
    }

    // 👉 appel backend Spring Boot ici
  }
}
