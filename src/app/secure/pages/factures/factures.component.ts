import { Component, OnInit } from '@angular/core';import { HttpClient } from '@angular/common/http';
import { Facture } from '../../../core/models/facture';
import { FactureService } from '../../../core/services/facture.service';
import { Router } from '@angular/router';

interface FilterResponse {
  results: Facture[];
}


@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.css']
})

export class FacturesComponent {

  factures: Facture[] = [];
  

  newFacture: Facture = {
    id: 0,
    nom: '',
    numero: '',
    date: new Date(),
    montant_total: 0,
    logo: '',
    etat_facture: '',
    utilisateur: 0,
    lignes_factures: [],
    
  };

  currentPage = 1;
  pageSize = 5;
  totalFactures = 0;
  showFactureForm = false;
  showFilterForm = false;
  showInvoiceDetails = false;
  selectedFacture: Facture | null = null;
  errorMessage = '';  
  tags: string = '';
  notes: string = '';
  type_contact: string = '';
  etat_facture: 'payee' | 'impayee' | 'en_retard' = 'impayee'; // Déclaration correcte avec une valeur par défaut


  constructor(private http: HttpClient, private factureService: FactureService, private router: Router) {}

  ngOnInit(): void {
    this.getFactures();
  }

  resetFilters(): void {
    // Réinitialiser les champs de filtre
    this.notes = '';
    this.tags = '';
    this.type_contact = '';
    console.log('Filtres réinitialisés');
    this.getFactures(); // Réinitialiser la liste des contacts
  }
  

  getFactures(): void {
    this.factureService.getFactures().subscribe({
      next: (data: any) => {
        this.factures = data.results || [];
        console.log("liste facture récupéré avec succées");
        console.log(this.factures);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des factures:', err);
      }
    });
  }

  addFacture(): void {
    console.log('Nouvelle facture à ajouter:', this.newFacture);
    this.factureService.addfactures(this.newFacture).subscribe({
      next: (facture) => {
        alert('Facture ajoutée avec succès');
        console.log('Facture ajoutée avec succès:', facture);
        this.factures.push(facture);
        this.newFacture = {
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
        this.showFactureForm = false;
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la facture:', err);
        alert('Erreur lors de l\'ajout de la facture');
      }
    });
  }

  get paginatedFactures() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.factures.slice(startIndex, startIndex + this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    const totalPages = this.getTotalPages();
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  viewFacture(facture: Facture) {
    this.selectedFacture = facture;
    this.showInvoiceDetails = true;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalFactures / this.pageSize);
  }

  deleteFacture(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      this.factureService.deleteFacture(id).subscribe({
        next: () => {
          this.factures = this.factures.filter(facture => facture.id !== id);
          alert('Facture supprimée avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la facture:', err);
          alert('Erreur lors de la suppression de la facture');
        }
      });
    }
  }

  showDetailFacture(id: number): void {
    this.router.navigate(['/factures', id]); 
  }

  applyFilters(): void {
        const filters = {
          etat_facture: this.etat_facture
        };
    
        this.factureService.filterFactures(filters).subscribe({
          next: (response: FilterResponse): void => {
            this.factures = response.results;
            console.log('Factures filtrés:', this.factures); // Pour vérifier les données
            this.showFilterForm = false;
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des factures filtrés:', err);
            alert('Erreur lors de la récupération des factures filtrés');
          }
        });
      }
  
  
}
