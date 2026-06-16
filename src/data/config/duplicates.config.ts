import type { CharacterRarity } from "@/domain/models";

export type DuplicateReward = {
  fragments: number;
  magicDust: number;
};

export const duplicateRewards: Record<CharacterRarity, DuplicateReward> = {
  COMMON: { fragments: 5, magicDust: 10 },
  RARE: { fragments: 10, magicDust: 25 },
  EPIC: { fragments: 20, magicDust: 60 },
  LEGENDARY: { fragments: 50, magicDust: 150 },
  MYTHIC: { fragments: 100, magicDust: 300 }
};
