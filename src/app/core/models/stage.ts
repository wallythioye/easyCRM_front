import { Opportunite } from "./opportunite";

export interface Stage {
    id: number;
    name: string;
    opportunities: Opportunite[];
  }