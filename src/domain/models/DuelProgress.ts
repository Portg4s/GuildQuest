import type { CharacterRarity } from "@/domain/models/CharacterRarity";

export type ArenaRank = "Bronze" | "Argent" | "Or" | "Saphir" | "Legende";

export type DuelTeam = {
  id: string;
  characterIds: string[];
  updatedAt: string;
};

export type DuelHistoryEntry = {
  id: string;
  opponentId: string;
  opponentName: string;
  won: boolean;
  xpGained: number;
  gemsGained: number;
  arenaPointsGained: number;
  teamCharacterIds: string[];
  playedAt: string;
};

export type ArenaProgress = {
  id: string;
  rank: ArenaRank;
  points: number;
  bestRank: ArenaRank;
  updatedAt: string;
};

export type DuelBotCardSeed = {
  name: string;
  rarity: CharacterRarity;
  element: string;
  power: number;
};
