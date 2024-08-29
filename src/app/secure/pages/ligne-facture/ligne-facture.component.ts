// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { FactureService } from '../../../core/services/facture.service';
// import { Facture } from '../../../core/models/facture';
// import { LigneFactureService } from '../../../core/services/ligneFacture.service';
// import { LigneFacture } from '../../../core/models/ligneFacture';

// @Component({
//   selector: 'app-ligne-facture',
//   templateUrl: './ligne-facture.component.html',
//   styleUrls: ['./ligne-facture.component.css'],
// })
// export class LigneFactureComponent implements OnInit {
//   facture: Facture | undefined; // Propriété pour stocker la facture
//   isLigneFactureFormVisible = false; // Pour afficher ou masquer le formulaire d'ajout de ligne de facture
//   ligneFacture: LigneFacture  = {
//     id: 0,
//     nom: '',
//     quantite: 0,
//     prix_unitaire: 0,
//     tva: 0,
//     total: 0,
//     factureId: 0
//   } 
//   // new LigneFacture();

//   newFacture: Facture = {
//     id: 0,
//     nom: '',
//     numero: '',
//     date: new Date(),
//     montant_total: 0,
//     logo: '',
//     etat_facture: '',
//     utilisateur: 0,
//     lignes_factures
// : []
//   };


//   constructor(
//     private factureService: FactureService,
//     private ligneFactureService: LigneFactureService,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     const id = Number(this.route.snapshot.paramMap.get('id'));

//     if (isNaN(id)) {
//       console.error('ID de facture invalide');
//       return;
//     }

//     this.getDetailFacture(id);
//   }

//   getDetailFacture(id: number): void {
//     this.factureService.getDetailFacture(id).subscribe({
//       next: (response: any) => {
//         this.facture = response.results;
//         console.log('Facture:', this.facture);
//         if (this.facture && this.facture.lignes_factures) {
//           console.log('Lignes de facture:', this.facture.lignes_factures);
//         } else {
//           console.log('Aucune ligne de facture trouvée.');
//         }
//       },
//       error: (err) => {
//         console.error('Erreur lors de la récupération des lignes de facture', err);
//       }
//     });
//   }

//   toggleLigneFactureForm(): void {
//     this.isLigneFactureFormVisible = !this.isLigneFactureFormVisible;
//   }

//   ajoutLigneFacture(): void {
//     if (this.facture && this.facture.id) {
//       this.ligneFactureService.ajoutLigneFacture(this.ligneFacture, this.facture.id).subscribe({
//         next: (response) => {
//           console.log('Ligne de facture ajoutée avec succès:', response);
//           this.isLigneFactureFormVisible = false;
//           this.getDetailFacture(this.facture?.id!); // Rafraîchir les détails de la facture
//         },
//         error: (err) => {
//           console.error('Erreur lors de l\'ajout de la ligne de facture:', err);
//         }
//       });
//     }
//   }

//   openAddLigneFactureForm(): void {
//     this.isLigneFactureFormVisible = true;
//   }


  
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from '../../../core/services/facture.service';
import { Facture } from '../../../core/models/facture';
import { LigneFactureService } from '../../../core/services/ligneFacture.service';
import { LigneFacture } from '../../../core/models/ligneFacture';

@Component({
  selector: 'app-ligne-facture',
  templateUrl: './ligne-facture.component.html',
  styleUrls: ['./ligne-facture.component.css'],
})
export class LigneFactureComponent implements OnInit {
  facture: Facture | undefined;
  isLigneFactureFormVisible = false;
  isFactureModelVisible = false;
  ligneFacture: LigneFacture = {
    id: 0,
    nom: '',
    quantite: 0,
    prix_unitaire: 0,
    tva: 0,
    total: 0,
    factureId: 0
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

  totalBeforeTax: number = 0;
  totalVat: number = 0;
  totalAfterTax: number = 0;
  vatRate: number = 0;

  advanceAmount: number = 0;
  remainingAmount: number = 0;

  constructor(
    private factureService: FactureService,
    private ligneFactureService: LigneFactureService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      console.error('ID de facture invalide');
      return;
    }
    this.getDetailFacture(id);
  }

  getDetailFacture(id: number): void {
    this.factureService.getDetailFacture(id).subscribe({
      next: (response: any) => {
        this.facture = response.results;
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

  ajoutLigneFacture() {
    if (this.ligneFacture.id) {
      this.ligneFactureService.updateLigneFacture(this.ligneFacture).subscribe(
        (response) => {
          const index = this.facture!.lignes_factures.findIndex(l => l.id === response.id);
          if (index !== -1) {
            this.facture!.lignes_factures[index] = response;
          }
          this.calculateTotals();  
          this.updateMontantTotal();  // Update montant_total after totals calculation
          this.toggleLigneFactureForm();
          
          this.ligneFacture = { id: 0, nom: '', quantite: 0, prix_unitaire: 0, tva: 0, total: 0, factureId: this.facture!.id };
          alert('Ligne de facture mise à jour avec succès');
          this.getDetailFacture(this.facture!.id);
          
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la ligne de facture :', error);
          alert('Erreur lors de la mise à jour de la ligne de facture');
        }
      );
    } else {
      this.ligneFactureService.ajoutLigneFacture(this.ligneFacture, this.facture!.id).subscribe(
        (response) => {
          this.facture!.lignes_factures.push(response);
          this.calculateTotals();  
          this.updateMontantTotal();  // Update montant_total after totals calculation
          this.toggleLigneFactureForm();
          this.ligneFacture = { id: 0, nom: '', quantite: 0, prix_unitaire: 0, tva: 0, total: 0, factureId: this.facture!.id };
          alert('Ligne de facture ajoutée avec succès');
          this.getDetailFacture(this.facture!.id);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la ligne de facture :', error);
          alert('Erreur lors de l\'ajout de la ligne de facture');
        }
      );
    }
  }

  updateMontantTotal() {
    if (this.facture) {
      this.facture.montant_total = this.totalAfterTax;  // Update montant_total with totalAfterTax
      this.factureService.updateFacture(this.facture).subscribe({
        next: () => console.log('Montant total mis à jour avec succès'),
        error: (error) => console.error('Erreur lors de la mise à jour du montant total :', error)
      });
    }
  }


  toggleLigneFactureForm() {
    this.isLigneFactureFormVisible = !this.isLigneFactureFormVisible;
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

  editLigneFacture(ligne: LigneFacture): void {
    this.ligneFacture = { ...ligne };
    this.isLigneFactureFormVisible = true;
  }
  
  
  deleteLigneFacture(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ligne de facture ?')) {
      this.ligneFactureService.deleteLigneFacture(id).subscribe(
        () => {
          if (this.facture) {
            this.facture.lignes_factures = this.facture.lignes_factures.filter(l => l.id !== id);
            this.calculateTotals();
            alert('Ligne de facture supprimée avec succès');
            this.getDetailFacture(id);
          }
        },
        (error) => {
          console.error('Erreur lors de la suppression de la ligne de facture :', error);
          alert('Erreur lors de la suppression de la ligne de facture');
        }
      );
    }
  }
  calculateRemainingAmount(): void {
    if (this.facture) {
      this.remainingAmount = this.totalAfterTax - this.advanceAmount;
    }
  }
  
  showFactureModal() {
    this.isFactureModelVisible = true;
  }

  hideFactureModal() {
    this.isFactureModelVisible = false;
  }
  showDetailFacture(id: number): void {
    this.router.navigate(['/factures/models', id]); 
  }

  goBackToFacture() {
    this.router.navigateByUrl('/factures');
  }
  
  
}