import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable } from 'rxjs';
import {  Contact } from '../models/contact';
import { environment } from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private API_URL = `${environment.API_URL}`;


  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token'); // ou une autre méthode pour récupérer le token
    console.log('Token utilisé pour l\'authentification:', token);
    return new HttpHeaders({
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getContacts(): Observable<Contact> {
    return this.http.get<Contact>(`${this.API_URL}/contacts`, { headers: this.getHeaders() });
  }

  getContactss(query: string = ''): Observable<Contact[]> {
    let url = this.API_URL;

    if (query) {
      url += `?query=${query}`;
    }

    return this.http.get<Contact[]>(`${this.API_URL}/contacts`, { headers: this.getHeaders() });
  }


  createContact(contact: Contact): Observable<Contact> {
  return this.http.post<Contact>(`${this.API_URL}/add-contact`, contact, { headers: this.getHeaders() });
  }

  updateContact(contact: Contact): Observable<any> {
    return this.http.put(`${this.API_URL}/contacts/${contact.id}`, contact, { headers: this.getHeaders() });
  }
  


  deleteContact(contactId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/contacts/${contactId}`, { headers: this.getHeaders() });
  }

  

  filterContacts(filters: any): Observable<any> {
    console.log('Requête de filtrage envoyée avec les filtres:', filters);
    return this.http.post<any>(`${this.API_URL}/filter/contacts`, filters, { headers: this.getHeaders() });
  }

  exportContacts() {
    return this.http.get(`${this.API_URL}/export-contacts`, { headers: this.getHeaders(), responseType: 'blob' });
  }

  importContacts(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<any>(`${this.API_URL}/import-contacts`, formData, { headers: this.getHeaders() });
  }
  
}