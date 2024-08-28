import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { Facture } from '../models/facture';
import { LigneFacture } from '../models/ligneFacture';


@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private API_URL = `${environment.API_URL}`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token'); // ou une autre méthode pour récupérer le token
    console.log('Token utilisé pour l\'authentification:', token);
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.API_URL}/factures-user`, { headers: this.getHeaders() });
  }

  addfactures(facture: Facture): Observable<Facture>{
    return this.http.post<Facture>(`${this.API_URL}/factures`, facture, { headers: this.getHeaders() });
  }

  getDetailFacture(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.API_URL}/factures/${id}`, { headers: this.getHeaders() });
  }

  filterFactures(filters: any): Observable<any> {
    console.log('Requête de filtrage envoyée avec les filtres:', filters);
    return this.http.post<any>(`${this.API_URL}/filter/factures`, filters, { headers: this.getHeaders() });
  }
  getFactureById(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.API_URL}/${id}`);
  }
  
  updateFacture(facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.API_URL}/factures/${facture.id}`, facture,{ headers: this.getHeaders() });
  }
  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/factures/${id}`, { headers: this.getHeaders() });
  }
  downloadPDF(id: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.API_URL}/factures/${id}/pdf`, { headers: this.getHeaders(), responseType: 'blob' as 'json' });
  }



}

