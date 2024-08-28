import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LigneFacture } from '../models/ligneFacture';

@Injectable({
  providedIn: 'root'
})
export class LigneFactureService {

  private API_URL = `${environment.API_URL}`;


  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token utilisé pour l\'authentification:', token); 
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur est survenue:', error.message);
    return throwError('Une erreur s\'est produite; veuillez réessayer plus tard.');
  }

  ajoutLigneFacture(ligneFacture: LigneFacture, factureId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.API_URL}/ligneFactures/${factureId}`, ligneFacture, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLigneFacture(ligneFacture: LigneFacture): Observable<LigneFacture> {
    const headers = this.getAuthHeaders();
    return this.http.put<LigneFacture>(`${this.API_URL}/lignes-factures/${ligneFacture.id}`, ligneFacture, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteLigneFacture(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.API_URL}/lignes-factures/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
