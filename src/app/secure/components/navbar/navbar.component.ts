import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Utilisateur } from '../../../core/models/utilisateur';
import { ContactService } from '../../../core/services/contact.service';
import { Contact } from '../../../core/models/contact';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  itemImage= "../public/assets/images/user.jpg";

  utilisateurs: Utilisateur | null = null;

  contacts: Contact[] = [];

  searchQuery: string = '';




  constructor(private authService: AuthService, private contactService: ContactService) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe(
      (utilisateurs: Utilisateur) => {
        console.log('Utilisateur récupéré:', utilisateurs);  // Ajoute ce log
        this.utilisateurs = utilisateurs;
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
      }
    );
  }

  applyFilters(): void {
    const filters = {
      search: this.searchQuery  // Utilise la nouvelle barre de recherche
    };
  
    this.contactService.filterContacts(filters).subscribe({
      next: (data: any) => {
        this.contacts = data.results || [];
        console.log('Contacts filtrés:', this.contacts);  // Vérifiez les contacts filtrés
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des contacts filtrés:', err);
      }
    });
  }
  
  

}
