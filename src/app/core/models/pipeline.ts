import { Opportunite } from "./opportunite";
import { Utilisateur } from "./utilisateur";

export interface Pipeline {
    id: number;
    etape_pipeline: string;
    utilisateur: Utilisateur;
    opportunites: Opportunite[];
    color?: string;
    order: number;
  }
  
  export enum EtapePipeline {
    Prospect = 'Prospect',
    Qualification = 'Qualification',
    Proposition = 'Proposition',
    Vente = 'Vente',
    Retention = 'Retention'
}