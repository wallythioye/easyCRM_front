import { NgClass } from "@angular/common";
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth/auth.service";
import { JwtService } from './../../../core/services/jwtService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form:FormGroup
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private router: Router,private fb:FormBuilder,private authService:AuthService, private jwtService:JwtService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }
  
onSubmit(): void {
    console.log('form:', this.form);

    if (this.form.valid) {
        console.log('form is valid. Proceeding with login.');

        const credentials = {
            email: this.form.value.email,
            password: this.form.value.password
        };

        if (credentials.email && credentials.password) {
            this.authService.login(credentials.email, credentials.password).subscribe(
                (response: any) => {
                     

                    if (response.statuts === 200) {
                        this.successMessage = 'Connexion réussie. Redirection en cours...';
                        alert('Connexion réussie. Redirection en cours...');
                        this.authService.isAuthenticated = true;
                        localStorage.setItem('token', response.token);
                        console.log('Connexion reussit !:', response);
                        console.log('Token reçu:', response.token);

                        this.router.navigateByUrl('admin/contacts');
                    } else {
                        console.error('Erreur lors de la connexion:', response.message);
                        this.authService.isAuthenticated = false;
                        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
                        alert('Identifiants incorrects. Veuillez réessayer.');
                    }
                },
                (error: HttpErrorResponse) => {
                    console.error('Erreur lors de la connexion:', error);
                    alert('Erreur lors de la connexion');
                    if (error.status) {
                        console.log('Status:', error.status);
                        console.log('Message:', error.error.message);
                    }
                    this.authService.isAuthenticated = false;
                    this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
                    alert('Identifiants incorrects. Veuillez réessayer');
                }
            );
        } else {
            console.error('Email or password is null.');
            this.authService.isAuthenticated = false;
        }
    } else {
        console.error('form is null or not valid.');
        this.authService.isAuthenticated = false;
    }
}

  redirectToRegister() {
    this.router.navigate(['/register']);
  }


}
