import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Opportunite, StatutOpportunite } from '../../../core/models/opportunite';
import { EtapePipeline, Pipeline } from '../../../core/models/pipeline';
import { OpportuniteService } from '../../../core/services/opportunite.service';
import { PipelineService } from '../../../core/services/pipeline.service';
import { Stage } from '../../../core/models/stage';
import { ContactService } from '../../../core/services/contact.service';
import { Contact } from '../../../core/models/contact';



@Component({
  selector: 'app-opportunites',
  templateUrl: './opportunites.component.html',
  styleUrls: ['./opportunites.component.css']
})   

export class OpportunitesComponent implements OnInit {
  pipelines: Pipeline[] = [];
  opportunites: Opportunite[] = []; 
  isFormVisible = false;
  etape_pipeline: string = ''; 
  errorMessage = '';
  successMessage = '';
  nom = '';
  date = '';
  statut = StatutOpportunite.A_FAIRE;
  montant: number | null = null;
  selectedPipelineId: number | null = null; 
  isDropdownVisible: boolean = false;
  selectedOpportunityId: number | null = null;
  selectedOpportunite: Opportunite | null = null;
  isOpportunityFormVisible: boolean = false;
    isModalVisible: { [key: number]: boolean } = {}; 
  isEditStepFormVisible: boolean = false;
  stepToEdit: Partial<Pipeline> = {};
  colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
  selectedColor: Record<string, string> = {};
  opportunitiesVisibility: Record<string, boolean> = {};
  pipelineVisibility: Record<string, boolean> = {};

  isEditing: boolean = false;


  contact: Contact[] = [];
  selectedContacts: number[] = []; // IDs des contacts sélectionnés
  isAssociateContactsFormVisible: boolean = false;
  currentOpportunityId: number | null = null;


  stages: Stage[] = [
    { id: 1, name: 'Prospect', opportunities: [] },
    { id: 2, name: 'Qualification', opportunities: [] },
    { id: 3, name: 'Proposition', opportunities: [] },
    { id: 4, name: 'Vente', opportunities: [] },
    { id: 5, name: 'Rétention', opportunities: [] },
  ];

  validEtapes: string[] = ['Prospect', 'Qualification', 'Proposition', 'Vente', 'Retention'];
  StatutOpportunite = StatutOpportunite;
  statutOptions: string[] = []; 

  constructor(
    private pipelineService: PipelineService,
    private opportuniteService: OpportuniteService,
    private cdr: ChangeDetectorRef,
    private changeDetectorRef: ChangeDetectorRef,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.getPipelines();
    this.statutOptions = Object.values(StatutOpportunite);  
    this.getAllOpportunites();
    this.getContacts();
  }


  getAllOpportunites(): void {
    this.opportuniteService.getAllOpportunites().subscribe(
      (response: any) => {
        if (response && response.results) {
          this.opportunites = [
            ...response.results.Prospect || [],
            ...response.results.Qualification || [],
            ...response.results.Proposition || [],
            ...response.results.Vente || [],
            ...response.results.Retention || []
          ];
          console.log('Opportunités:', this.opportunites);
        } else {
          console.error('Erreur lors de la récupération des opportunités:', response);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des opportunités:', error);
      }
    );
  }
 
  selectOpportunite(opportuniteId: number): void {
    this.opportuniteService.getOpportuniteDetails(opportuniteId).subscribe(
      (response: any) => {
        if (response && response.results) {
          this.selectedOpportunite = response.results;
          console.log('Opportunité et contacts:', this.selectedOpportunite);
        } else {
          console.error('Erreur lors de la récupération des détails de l\'opportunité:', response);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des détails de l\'opportunité:', error);
      }
    );
  }

  closeDetailOpportuniteForm(): void {
    this.selectedOpportunite = null;
  }

  
  loadPipelines(): void {
    this.pipelineService.getPipelines().subscribe(
      (data: Pipeline[]) => this.pipelines = data,
      (error) => console.error('Failed to load pipelines', error)
    );
  }

  getPipelines(): void {
    this.pipelineService.getPipelines().subscribe(
      (response: any) => {
        if (response && response.results && Array.isArray(response.results)) {
          this.pipelines = response.results.map((pipeline: Pipeline) => ({
            ...pipeline,
            opportunites: pipeline.opportunites || []
          }));
  
          console.log('Pipelines:', this.pipelines);
        } else {
          console.error('Les données récupérées ne sont pas un tableau:', response);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des pipelines:', error);
      }
    );
  }
    getOpportunitesByPipelineId(pipelineId: number): Opportunite[] {
    return this.opportunites.filter(opportunite => opportunite.pipeline_id === pipelineId);
  }


  onDropPipeline(event: CdkDragDrop<Pipeline[]>): void {
    moveItemInArray(this.pipelines, event.previousIndex, event.currentIndex);
    this.updatePipelineOrder();
  }
  


  updatePipelineOrder(): void {
    this.pipelines.forEach((pipeline, index) => {
      pipeline.order = index; 
      this.pipelineService.updatePipeline(pipeline.id, pipeline).subscribe(
        response => console.log(`Pipeline ${pipeline.id} updated successfully`, response),
        error => console.error(`Error updating pipeline ${pipeline.id}`, error)
      );
    });
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const opportunity = event.previousContainer.data[event.previousIndex];
      const newPipelineId = parseInt(event.container.id, 10);
  
      if (isNaN(newPipelineId)) {
        console.error(`Invalid pipeline ID: ${event.container.id}`);
        return;
      }
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        this.opportuniteService.updateOpportunityPipeline(opportunity.id, newPipelineId).subscribe({
        next: (response) => {
          console.log(`Successfully updated opportunity with ID: ${opportunity.id} and new pipeline ID: ${newPipelineId}`);
          this.updateLocalOpportunity(opportunity.id, newPipelineId);
        },
        error: (error) => {
          console.error('Error updating opportunity:', error);
          transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex, event.previousIndex);
        }
      });
    }
  }



  
  updateLocalOpportunity(opportunityId: number, newPipelineId: number) {
    const opportunity = this.opportunites.find(o => o.id === opportunityId);
    if (opportunity) {
      opportunity.pipeline_id = newPipelineId;
      this.changeDetectorRef.detectChanges();
    }
  }

  refreshOpportunities() {
    this.opportuniteService.getAllOpportunites().subscribe(
      (data) => {
        this.opportunites = data; 
      },
      (error) => {
        console.error('Error fetching opportunities:', error);
      }
    );
  }

  updateOpportunityPipeline(opportunity: Opportunite, pipelineId: number) {
    if (!opportunity) {
      console.error('Opportunité non définie');
      return;
    }
    console.log('Updating opportunity:', opportunity);
      opportunity.pipeline_id = pipelineId;
    this.opportuniteService.UpdateOpportunity(opportunity.id, opportunity).subscribe(
      response => {
        console.log('Opportunity updated successfully', response);
        alert('Opportunité modifié avec succées');
      },
      error => {
        console.error('Error updating opportunity', error);
        alert('Erreur lors de la modification de l\'opportunité');
      }
    );
  }


  drop(event: CdkDragDrop<Opportunite[]>) {
    const previousElement = event.previousContainer.element.nativeElement.parentElement;
    const newElement = event.container.element.nativeElement.parentElement;

    if (previousElement && newElement) {
      const previousPipelineId = previousElement.getAttribute('data-pipeline-id');
      const newPipelineId = newElement.getAttribute('data-pipeline-id');

      if (previousPipelineId && newPipelineId) {
        const movedOpportunity = event.item.data;
        console.log('Drop event:', event);
        console.log('Moved Opportunity:', movedOpportunity);
        console.log('New Pipeline ID:', newPipelineId);
        this.opportuniteService.updateOpportunityStage(movedOpportunity.id, Number(newPipelineId))
          .subscribe(
            (updatedOpportunity: Opportunite) => {
              movedOpportunity.pipelineId = Number(newPipelineId);

              if (event.previousContainer === event.container) {
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
              } else {
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
              }
              this.cdr.detectChanges();
            },
            error => {
              console.error('Erreur lors de la mise à jour de l\'opportunité:', error);
            }
          );
      } else {
        console.error('Invalid pipeline ID:', event.container.id);
      }
    } else {
      console.error('Previous or new element is null');
    }
  }

  updatePipelineData(previousPipelineId: string, newPipelineId: string, movedOpportunity: Opportunite) {
    const previousPipeline = this.pipelines.find(pipeline => pipeline.id === Number(previousPipelineId));
    const newPipeline = this.pipelines.find(pipeline => pipeline.id === Number(newPipelineId));

    if (previousPipeline && newPipeline) {
      previousPipeline.opportunites = previousPipeline.opportunites.filter(opportunite => opportunite.id !== movedOpportunity.id);
      newPipeline.opportunites.push(movedOpportunity);
      this.pipelines = this.pipelines.map(pipeline => {
        if (pipeline.id === Number(previousPipelineId)) {
          return previousPipeline;
        }
        if (pipeline.id === Number(newPipelineId)) {
          return newPipeline;
        }
        return pipeline;
      });
    }
  }

  loadOpportunites() {
    this.opportuniteService.getAllOpportunites().subscribe(
      (data) => {
        this.opportunites = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des opportunités', error);
      }
    );
  }
  
  
  toggleMenuVisibility(pipelineId: number) {
    this.isModalVisible[pipelineId] = !this.isModalVisible[pipelineId];
  }

  changeColor(pipelineId: number, color: string) {
    this.selectedColor[pipelineId.toString()] = color;
  }

  SaveColor(pipelineId: number) {
    const pipelineIdStr = pipelineId.toString();
    if (this.selectedColor[pipelineIdStr]) {
      this.applyPipelineColor(pipelineIdStr, this.selectedColor[pipelineIdStr]);
      const updatedPipeline = this.pipelines.find(p => p.id === pipelineId);
      if (updatedPipeline) {
        updatedPipeline.color = this.selectedColor[pipelineIdStr];
        this.pipelineService.updatePipeline(updatedPipeline.id, updatedPipeline).subscribe(
          response => {
            console.log('Pipeline color updated successfully', response);
            this.getPipelines(); 
          },
          error => {
            console.error('Failed to update pipeline color', error);
          }
        );
      }
    }
    this.opportunitiesVisibility[pipelineIdStr] = false;
  }

applyPipelineColor(pipelineId: string, color: string) {
    const pipeline = this.pipelines.find(p => p.id.toString() === pipelineId);
    if (pipeline) {
      pipeline.color = color;
    }
}

updatePipelineColor(pipelineId: number, newColor: string) {
  const updatedData = { color: newColor }; 
  this.pipelineService.updatePipeline(pipelineId, updatedData).subscribe(
    response => {
      if (response.statuts === 200) {
        const updatedPipeline = response.results;
        console.log('Updated pipeline:', updatedPipeline);
        this.pipelines = this.pipelines.map(pipeline =>
          pipeline.id === updatedPipeline.id ? { ...pipeline, color: newColor } : pipeline
        );
        console.log('Updated pipelines state:', this.pipelines);
        this.cdr.detectChanges();  
      } else {
        console.error('Failed to update pipeline color');
      }
    },
    error => {
      console.error('Error updating pipeline color:', error);  
    }
  );
}


  toggleIconsVisibility(opportuniteId: number) {
    this.opportunitiesVisibility[opportuniteId] = !this.opportunitiesVisibility[opportuniteId];
  }

  togglePipelineIconsVisibility(pipelineId: number) {
    this.pipelineVisibility[pipelineId] = !this.pipelineVisibility[pipelineId];
  }
  
  toggleOpportunityIconsVisibility(opportuniteId: number) {
    this.opportunitiesVisibility[opportuniteId] = !this.opportunitiesVisibility[opportuniteId];
  }
  

  openAddOpportunityForm(pipelineId: number): void {
    this.selectedPipelineId = pipelineId;
    this.isOpportunityFormVisible = true;
  }

  deletePipeline(pipelineId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette pipeline ?')){
    this.pipelineService.deletePipeline(pipelineId).subscribe(
      () => {
        this.pipelines = this.pipelines.filter(pipeline => pipeline.id !== pipelineId);
        console.log('Pipeline deleted successfully');
        alert('Pipeline supprimé avec succée');
      },
      (error) => console.error('Failed to delete pipeline', error)
      
    );
  }
}

  openUpdatePipelineForm(pipelineId: number): void {
    const pipeline = this.pipelines.find(p => p.id === pipelineId);
    if (pipeline) {
      this.stepToEdit = { ...pipeline }; 
      this.isEditStepFormVisible = true;
    }
  }

  closeEditStepForm(): void {
    this.isEditStepFormVisible = false;
  }

  saveEditedStep(): void {
    this.pipelineService.updatePipeline(this.stepToEdit.id!, this.stepToEdit).subscribe(
      () => {
        this.loadPipelines();
        this.isEditStepFormVisible = false;
        console.log('Pipeline updated successfully');
        alert('Pipeline avec succées');
      },
      (error) => console.error('Failed to update pipeline', error)
    );
  }




  openForm(): void {
    this.isFormVisible = true;
  }

  closeForm(): void {
    this.isFormVisible = false;
  }

  openOpportunityForm(): void {
    this.isOpportunityFormVisible = true;
  }

  closeOpportunityForm(): void {
    this.isOpportunityFormVisible = false;
  }

  deleteOpportunite(opportuniteId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette opportunité ?')) {
      this.opportuniteService.deleteOpportunite(opportuniteId).subscribe(
        () => {
          this.opportunites = this.opportunites.filter(opportunite => opportunite.id !== opportuniteId);
          this.successMessage = 'Opportunité supprimée avec succès!';
          console.log('Opportunité supprimée avec succès!');
          alert('Opportunité supprimée avec succès!');
        },
        error => {
          this.errorMessage = 'Erreur lors de la suppression de l\'opportunité';
          console.log('Erreur lors de la suppression de l\'opportunité');
          alert('Erreur lors de la suppression de l\'opportunité');
        }
      );
    }
  }


  //Méthode Modification opportunité original
  UpdateOpportunity(opportuniteId: number, updatedData: Opportunite): void {
    console.log('Données envoyées pour la mise à jour:', updatedData);
    this.opportuniteService.UpdateOpportunity(opportuniteId, updatedData).subscribe(
      response => {
        console.log('Réponse du backend:', response);
        const index = this.opportunites.findIndex(opportunite => opportunite.id === opportuniteId);
        if (index > -1) {
          this.opportunites[index] = response;
        }
        this.successMessage = 'Opportunité mise à jour avec succès!';
        alert('Opportunité mise à jour avec succès!');
        this.getAllOpportunites();
        this.closeOpportunityForm();
      },
      error => {
        console.error('Erreur lors de la mise à jour de l\'opportunité:', error);
        this.errorMessage = 'Erreur lors de la mise à jour de l\'opportunité';
        alert('Erreur lors de la mise à jour de l\'opportunité');
      }
    );
  }

  toggleDropdown(opportuniteId: number): void {
    this.isDropdownVisible = !this.isDropdownVisible;
    this.selectedOpportunityId = opportuniteId;
  }

  openUpdateOpportunityForm(opportuniteId: number): void {
    this.selectedOpportunityId = opportuniteId;
    const opportunite = this.opportunites.find(o => o.id === opportuniteId);
    if (opportunite) {
      this.nom = opportunite.nom;
      this.date = opportunite.date;
      this.statut = opportunite.statut;
      this.montant = opportunite.montant;
      this.selectedPipelineId = opportunite.pipeline_id;
      this.isOpportunityFormVisible = true;
    }
  }

  saveOpportunity(): void {
    if (!this.nom.trim() || !this.date.trim() || this.montant === null || this.selectedPipelineId === null) {
      alert('Tous les champs sont requis.');
      return;
    }

    const newOpportunity: Opportunite = {
      id: this.selectedOpportunityId!,
      nom: this.nom,
      date: this.date,
      statut: this.statut,
      montant: this.montant!,
      pipeline_id: this.selectedPipelineId!
    };

    if (this.selectedOpportunityId) {
      this.UpdateOpportunity(this.selectedOpportunityId, newOpportunity);
    } else {
      this.opportuniteService.addOpportunite(newOpportunity).subscribe(
        response => {
          this.opportunites.push(response);
          this.successMessage = 'Opportunité créée avec succès!';
          console.log('Opportunité créée avec succès!');
          alert('Opportunité créée avec succès!');
          this.getAllOpportunites();
          this.closeOpportunityForm();
        },
        error => {
          this.errorMessage = 'Erreur lors de la création de l\'opportunité';
          console.log('Erreur lors de la création de l\'opportunité');
          alert('Erreur lors de la création de l\'opportunité');
        }
      );
    }
  }

  saveStep(): void {
    if (!this.etape_pipeline.trim()) {
      alert('Le nom de l\'étape est requis.');
      return;
    }

    if (!this.validEtapes.includes(this.etape_pipeline)) {
      alert('Étape invalide. Les étapes valides sont : ' + this.validEtapes.join(', '));
      return;
    }
    const newStep: Pipeline = { 
      id: 0, 
      etape_pipeline: this.etape_pipeline as any, 
      utilisateur: { id: 0, prenom: '', nom: '', email: '', password: '' },
      opportunites: [],
      order: 0 
    };
    this.pipelineService.addPipeline(newStep).subscribe(
      response => {
        this.pipelines.push(response);
        this.successMessage = 'Étape créée avec succès!';
        alert('Étape de pipeline créée avec succès!');
        this.getPipelines();
        this.closeForm();
      },
      error => {
        this.errorMessage = 'Erreur lors de la création de l\'étape';
        console.log('Erreur lors de la création de l\'étape');
        alert('Erreur lors de la création de l\'étape');
      }
    );
  }

  getContacts(): void {
    this.contactService.getContactss().subscribe(
      (response: any) => {
        if (response && response.results) {
          this.contact = response.results;
          console.log('Contacts:', this.contact);
        } else {
          console.error('Erreur lors de la récupération des contacts:', response);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des contacts:', error);
      }
    );
  }


  associateContacts(): void {
    if (this.currentOpportunityId !== null && this.selectedContacts.length > 0) {
      this.opportuniteService.associateContacts(this.currentOpportunityId, this.selectedContacts).subscribe(
        (response) => {
          console.log('Contacts associés avec succès!');
          alert('Contacts associés avec succès!');
          this.isAssociateContactsFormVisible = false;
          this.getAllOpportunites(); // Met à jour les opportunités
        },
        (error) => {
          console.error('Erreur lors de l\'association des contacts:', error);
          alert('Erreur lors de l\'association des contacts');
        }
      );
    } else {
      console.error('Aucune opportunité sélectionnée ou aucun contact sélectionné');
      alert('Aucune opportunité sélectionnée ou aucun contact sélectionné');
    }
  }
  

openAssociateContactsForm(opportunityId: number): void {
    this.currentOpportunityId = opportunityId;
    this.isAssociateContactsFormVisible = true;
  }

  onContactSelect(event: any): void {
    const contactId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      this.selectedContacts.push(contactId);
    } else {
      this.selectedContacts = this.selectedContacts.filter(id => id !== contactId);
    }
  }

}