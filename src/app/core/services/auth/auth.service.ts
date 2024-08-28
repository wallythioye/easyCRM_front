import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Token } from '../../models/token';
import { Utilisateur } from "../../models/utilisateur";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isAuthenticated=true
  email:string|null=null;
  password:string|null=null;
  prenom:string|null=null;
  nom:string|null=null;

  constructor(private http:HttpClient,private router: Router) {}
  
  private API_URL = `${environment.API_URL}`

  getHeadersWithAuthorization(): HttpHeaders {
    const token = localStorage.getItem('token');

    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      });
    }

    console.error('Token is null. User is not authenticated.');
    return new HttpHeaders();
  }

  login( userEmail: string,  userPassword: string ): Observable<Token> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });  
    //var data = {"email":"\""+email+"\"", "password":"\""+password+"\""};
    var data = {"email":userEmail, "password":userPassword};
    return this.http.post<Token>(`${this.API_URL}/login`, data, { headers });
  }


  register(formData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, formData);
  }

  getUser(): Observable<Utilisateur> {
    const headers = this.getHeadersWithAuthorization();
    return this.http.get<Utilisateur>(`${this.API_URL}/user`, { headers });
  }

  logout(): void {

    localStorage.removeItem('token'); 
        this.router.navigate(['/login']); 
      }

}
