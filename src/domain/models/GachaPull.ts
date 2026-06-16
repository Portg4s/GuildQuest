import type { CharacterRarity } from "@/domain/models/CharacterRarity";

export type GachaPull = {
  id: string;
  characterId: string;
  rarity: CharacterRarity;
  cost: number;
  isDuplicate: boolean;
  fragmentsGained: number;
  magicDustGained: number;
  pulledAt: string;
};
