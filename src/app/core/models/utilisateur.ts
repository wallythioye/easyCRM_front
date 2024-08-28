import { Contact } from "./contact";
import { Facture } from "./facture";
import { Pipeline } from "./pipeline";

export interface Utilisateur {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    password: string;
    contacts?: Contact[];
    pipelines?: Pipeline[];
    factures?: Facture[];
  }