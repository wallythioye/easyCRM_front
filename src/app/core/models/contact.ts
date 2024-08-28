export class Contact {
  id?: number;
  nom: string;
  prenom: string;
  telephone: string;
  type_contact: 'Client' | 'Prospect' | 'Fournisseur';
  tags: string;
  email: string;
  adresse: string;
  notes: string;
  secteur_activite: string;

  constructor() {
    this.nom = '';
    this.prenom = '';
    this.telephone = '';
    this.type_contact = 'Client';
    this.tags = '';
    this.email = '';
    this.adresse = '';
    this.notes = '';
    this.secteur_activite = '';
  }
}
