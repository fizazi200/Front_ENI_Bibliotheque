import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  authForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {

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

    // 👉 appel backend Spring Boot ici
  }
}
