import { LigneFacture } from './ligneFacture';
import { FactureOpportunite } from './factureOpportunite';

export interface Facture {
  id: number;
  nom: string;
  numero: string;
  date: Date;
  montant_total: number;
  logo: string;
  etat_facture: string;
  utilisateur: number;
  lignes_factures: LigneFacture[];
  date_echeance?: string;
  factures_opportunites?: FactureOpportunite[];
}
