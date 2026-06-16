import type { CharacterRarity } from "@/domain/models";

export const gachaRates: Record<CharacterRarity, number> = {
  COMMON: 45,
  RARE: 30,
  EPIC: 15,
  LEGENDARY: 8,
  MYTHIC: 2
};

export const gachaCosts = {
  singlePullCost: 80,
  tenPullCost: 700
} as const;
