import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ResetPasswordService } from '../../../core/services/resetPassword.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {


  form: FormGroup;
  token: string | null = null;
  email: string | null = null;

  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private resetPasswordService: ResetPasswordService,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    });
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  passwordMatchValidator(formGroup: FormGroup): void {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.resetPasswordService.resetPassword({
        ...this.form.value,
        token: this.token,
        email: this.email
      }).subscribe(
        response => {
          alert('Mot de passe réinitialisé avec succès !');
          this.router.navigate(['/login']);
        },
        error => {
          alert('Erreur lors de la réinitialisation du mot de passe.');
        }
      );
    }
  }
}