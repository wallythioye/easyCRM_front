import { Component, OnInit } from '@angular/core';
import { Facture } from '../../../core/models/facture';
import { LigneFacture } from '../../../core/models/ligneFacture';
import { FactureService } from '../../../core/services/facture.service';
import { LigneFactureService } from '../../../core/services/ligneFacture.service';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-model-facture',
  templateUrl: './model-facture.component.html',
  styleUrls: ['./model-facture.component.css']
})
export class ModelFactureComponent implements OnInit {
  isFactureModelVisible: boolean = true;
  currentCity: string = 'Dakar'; 
  currentDate: string = new Date().toLocaleDateString();
  ligneFacture: LigneFacture = {
    id: 0,
    nom: '',
    quantite: 0,
    prix_unitaire: 0,
    tva: 0,
    total: 0,
    factureId: 0
  };
  facture: Facture = {
    id: 0,
    nom: '',
    numero: '',
    date: new Date(),
    montant_total: 0,
    logo: '',
    etat_facture: '',
    utilisateur: 0,
    date_echeance: '', 
    lignes_factures: []
  };
  
  newFacture: Facture = {
    id: 0,
    nom: '',
    numero: '',
    date: new Date(),
    montant_total: 0,
    logo: '',
    etat_facture: '',
    utilisateur: 0,
    lignes_factures: []
  };

  advanceAmount: number = 0;
  remainingAmount: number = 0;
  totalBeforeTax: number = 0; 
  vatRate: number = 18
  ; 
  totalVat: number = 0; 
  totalAfterTax: number = 0; 
  companyFooterText: string = 'Merci de votre visite chez easy-crm!';

  constructor(
    private factureService: FactureService,
    private ligneFactureService: LigneFactureService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}
  private getHeaders() {
    const token = localStorage.getItem('token'); 
    console.log('Token utilisé pour l\'authentification:', token);
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      console.error('ID de facture invalide');
      return;
    }
    this.getDetailFacture(id);
    this.currentDate = new Date().toISOString();
  }

  getDetailFacture(id: number): void {
    this.factureService.getDetailFacture(id).subscribe({
      next: (response: any) => {
        this.facture = response.results || this.facture;
          if (this.facture && this.facture.lignes_factures) {
          this.calculateTotals();
        } else {
          console.warn('Facture ou lignes de facture non définies');
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération de la facture :', error);
      }
    });
  }
  

  calculateLigneTotal() {
    if (this.ligneFacture.quantite && this.ligneFacture.prix_unitaire) {
      const totalHT = this.ligneFacture.quantite * this.ligneFacture.prix_unitaire;
      const tvaAmount = totalHT * (this.ligneFacture.tva / 100);
      this.ligneFacture.total = totalHT + tvaAmount;
    } else {
      this.ligneFacture.total = 0;
    }
  }
  
  calculateTotals() {
    if (this.facture) {
      this.totalBeforeTax = this.facture.lignes_factures.reduce((acc, ligne) => acc + (ligne.quantite * ligne.prix_unitaire), 0);
      this.totalVat = this.facture.lignes_factures.reduce((acc, ligne) => acc + ((ligne.quantite * ligne.prix_unitaire) * (ligne.tva / 100)), 0);
      this.totalAfterTax = this.totalBeforeTax + this.totalVat;
    }
  }

  calculateRemainingAmount(): void {
    if (this.facture) {
      this.remainingAmount = this.totalAfterTax - this.advanceAmount;
    }
  }
    
  telechargerFacture(): void {
    const id = this.facture.id; 
    this.factureService.downloadPDF(id).subscribe({
      next: (blob: Blob) => {
        saveAs(blob, `facture_${id}.pdf`);
      },
      error: (error: any) => {
        console.error('Erreur lors du téléchargement du PDF :', error);
      }
    });
  }
}
