import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from '../../../core/services/resetPassword.service';

@Component({
  selector: 'app-mdpasse',
  templateUrl: './mdpasse.component.html',
  styleUrls: ['./mdpasse.component.css']
})
export class MdpasseComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }


  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
 
  onSubmit() {
    if (this.form.valid) {
      this.resetPasswordService.sendResetLink(this.form.value).subscribe(
        response => {
          alert('Lien de réinitialisation envoyé avec succès !');
          console.log('Lien de réinitialisation envoyé avec succès !');
        },
        error => {
          alert('Erreur lors de l\'envoi du lien.');
          console.log('Erreur lors de l\'envoi du lien.');

        }
      );
    }
  }
}