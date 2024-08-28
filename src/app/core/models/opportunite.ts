import { Contact } from "./contact";
import { FactureOpportunite } from "./factureOpportunite";

export interface Opportunite {
  id: number;
  nom: string;
  statut: StatutOpportunite;
  montant: number;
  date: string;
  pipeline_id: number; 
  contact?: Contact[];
  facturesOpportunites?: FactureOpportunite[];
}


  // opportunite.ts
export enum StatutOpportunite {
    A_FAIRE = 'À faire',
    EN_COURS = 'En cours',
    EN_ATTENTE = 'En attente',
    EN_REVUE = 'En revue',
    TERMINE = 'Terminé'
}
