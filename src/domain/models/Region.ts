import type { Zone } from "@/domain/models/Zone";

export type Region = {
  id: string;
  name: string;
  description: string;
  order: number;
  zones: Zone[];
};
