import { Facture } from "./facture";

export interface LigneFacture {
  id: number;
  nom: string;
  quantite: number;
  prix_unitaire: number;
  tva: number;
  total: number;
  factureId: number; 
}
