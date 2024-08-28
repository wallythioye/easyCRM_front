import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { Opportunite } from '../models/opportunite';

@Injectable({
  providedIn: 'root'
})
export class OpportuniteService {
  
  private API_URL = `${environment.API_URL}`;

  constructor(private http: HttpClient) {}

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

  getAllOpportunites(): Observable<Opportunite[]> {
    return this.http.get<Opportunite[]>(`${this.API_URL}/opportunite`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError)); 
  }
  
  addOpportunite(opportuniteData: Opportunite): Observable<Opportunite> {
    return this.http.post<Opportunite>(`${this.API_URL}/opportunite`, opportuniteData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }  

  deleteOpportunite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/opportunite/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  UpdateOpportunity(id: number, opportuniteData: Opportunite): Observable<Opportunite> {
    console.log('Sending update request with data:', opportuniteData);
    return this.http.put<Opportunite>(`${this.API_URL}/opportunite/${id}`, opportuniteData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }  

  // la mise à jour du pipeline lors du glisser-déposer
  updateOpportunityStage(opportunityId: number, newStageId: number): Observable<Opportunite> {
    console.log('Mise à jour de l\'opportunité avec ID:', opportunityId, 'et nouvel ID de stage:', newStageId);
    return this.http.put<Opportunite>(`${this.API_URL}/opportunite/${opportunityId}`, 
      { pipelineId: newStageId }, 
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }


  updateOpportunityPipeline(opportunityId: number, newPipelineId: number): Observable<any> {
    const url = `${this.API_URL}/opportunites/${opportunityId}/stage`;
    return this.http.put(url, { pipelineId: newPipelineId }, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }



  // associateContacts(opportunityId: number, contactIds: number[]): Observable<Opportunite> {
  //   const url = `${this.API_URL}/opportunites/${opportunityId}/associer-contact`;
  //   return this.http.post<Opportunite>(url, { contact_ids: contactIds }, { headers: this.getAuthHeaders() })
  //     .pipe(catchError(this.handleError));
  // }


  associateContacts(opportunityId: number, contactIds: number[]): Observable<Opportunite> {
    return this.http.post<Opportunite>(`${this.API_URL}/opportunites/${opportunityId}/associer-contact`, { contact_ids: contactIds }, { headers: this.getAuthHeaders() });
  }
  
  getOpportuniteDetails(id: number): Observable<Opportunite> {
    return this.http.get<Opportunite>(`${this.API_URL}/opportunites/${id}/details`, { headers: this.getAuthHeaders() });
  }
  

}