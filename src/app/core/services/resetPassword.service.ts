import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private API_URL = `${environment.API_URL}`;

  constructor(private http: HttpClient) {}


  sendResetLink(data: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/password/email`, data);
  }

  resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/password/reset`, data);
  }


}
