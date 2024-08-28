import { Opportunite } from './opportunite';

export interface FactureOpportunite {
  id: number;
  facture_id: number;
  opportunite_id: number;
  opportunite: Opportunite;
}
