import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth/auth.service";
import {RestResponse} from "../../../core/models/rest.response";
import {RegisterRequest} from "../../../core/models/auth.models";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, NgClass
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form:FormGroup;
  errors:any;
  constructor(private router: Router,private fb:FormBuilder,private authService:AuthService) {
    this.form = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      this.authService.register(formData).subscribe((res:RestResponse<RegisterRequest>) => {
        if(res.statuts==200){
          //les infos du token
          this.authService.isAuthenticated=true;
          this.authService.email=res.results.email
          this.authService.prenom=res.results.prenom
          this.authService.nom=res.results.nom
          this.authService.password=res.results.password
          localStorage.setItem("token",res.results.token) 


          this.router.navigateByUrl('login');

        } else {
          this.authService.isAuthenticated=false;
          this.form.markAllAsTouched();
          console.log("erreur");
        }
    });
  }
  }
  //fin
}
