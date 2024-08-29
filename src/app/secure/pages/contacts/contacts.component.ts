import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Contact } from '../../../core/models/contact';
import { ContactService } from '../../../core/services/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface FilterResponse {
  results: Contact[];
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  newContact: Contact = new Contact();
  showContactForm = false;
  showFilterForm = false;
  tags: string = '';
  notes: string = '';
  type_contact: string = '';
  filterSecteurActivite: string = '';
  showViewModal = false;
  selectedContact: Contact = new Contact(); 
  isEditMode: boolean = false;
  
  
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  contactForm!: FormGroup; 


  constructor(
    private contactService: ContactService,
    private fb: FormBuilder

  ) {}

  ngOnInit(): void {
    this.getContact();
    this.initForm();  
  }
  get formTitle(): string {
    return this.isEditMode ? 'Modifier le contact' : 'Créer un contact';
  }
  initForm(): void {
    this.contactForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      type_contact: ['', Validators.required],
      tags: [''],
      notes: ['']
    });
  }


  resetFilters(): void {
    this.notes = '';
    this.tags = '';
    this.type_contact = '';
    console.log('Filtres réinitialisés');
    this.getContact(); 
  }

  getContact(): void {
    this.contactService.getContacts().subscribe({
      next: (data: any) => {
        console.log('Données reçues:', data);
        this.contacts = data.results || [];
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des contacts:', err);
      }
    });
  }

  createContact(): void {
    this.contactService.createContact(this.newContact).subscribe({
      next: (response) => {
        console.log('Réponse de l\'API:', response); 
        this.showContactForm = false;
        this.newContact = new Contact();
        alert('Contact créee avec succés');
        this.getContact(); 
      },
    });
  }
  updateContact() {
    this.contactService.updateContact(this.selectedContact).subscribe(
      response => {
        console.log('Contact mis à jour:', response);
      },
      error => {
        console.error('Erreur de mise à jour du contact:', error);
      }
    );
  }
  
  
  closeModal(): void {
    this.showViewModal = false;
    this.showContactForm = false;
  }
  
  editContact(contact: Contact): void {
    this.newContact = contact ;
    this.contactForm.patchValue(contact);  
    this.showContactForm = true;
  }

    viewItem(contact: Contact): void {
    this.selectedContact = contact;
    this.showViewModal = true;
  }

  deleteContact(contact: Contact): void {
    if (contact.id !== undefined) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le contact ${contact.prenom} ${contact.nom} ?`)) {
        this.contactService.deleteContact(contact.id).subscribe(() => {
          this.getContact();
        });
      }
    } else {
      console.error("Contact ID is undefined.");
    
    }
  }

  applyFilters(): void {
    const filters = {
      notes: this.notes,
      tags: this.tags,
      type_contact: this.type_contact
    };

    this.contactService.filterContacts(filters).subscribe({
      next: (response: FilterResponse): void => {
        this.contacts = response.results;
        console.log('Contacts filtrés:', this.contacts); 
        this.showFilterForm = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des contacts filtrés:', err);
      }
    });
  }
  

  downloadContactsCsv() {
    this.contactService.exportContacts().subscribe((data) => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }


  importContacts(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.contactService.importContacts(file).subscribe(
        response => {
          alert('Contacts importés avec succès.');
          console.log('Contacts importés avec succès.');
          this.getContact(); 
        },
        error => {
          alert('Erreur lors de l\'importation des contacts.');
          console.log('Erreur lors de l\'importation des contacts.', error);
        }
      );
    }
  }

  
}
