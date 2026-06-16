import type { CharacterRarity } from "@/domain/models/CharacterRarity";

export type GachaPull = {
  id: string;
  characterId: string;
  rarity: CharacterRarity;
  cost: number;
  pulledAt: string;
};
