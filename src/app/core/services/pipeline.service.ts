import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { Pipeline } from "../models/pipeline";

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  private API_URL = `${environment.API_URL}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token utilisé pour l\'authentification:', token); // Assurez-vous que le token est affiché ici
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur est survenue:', error.message);
    return throwError('Une erreur s\'est produite; veuillez réessayer plus tard.');
  }

  getPipelines(): Observable<Pipeline[]> {
    return this.http.get<Pipeline[]>(`${this.API_URL}/etapePipelines/opportunite`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }
  
  addPipeline(pipelineData: Pipeline): Observable<any> {
    return this.http.post(`${this.API_URL}/add-etapePipelines`, pipelineData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  deletePipeline(pipelineId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/pipelines/${pipelineId}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }
  

  updatePipeline(pipelineId
    : number, pipelineData: Partial<Pipeline>): Observable<any> {
    return this.http.put(`${this.API_URL}/pipelines/${pipelineId}`, pipelineData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }
}
