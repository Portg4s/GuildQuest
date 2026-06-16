import type { GuildRank } from "@/domain/models/GuildRank";

export type Player = {
  id: string;
  username: string;
  rank: GuildRank;
  level: number;
  xp: number;
  nextLevelXp: number;
  gems: number;
  magicDust: number;
  activeCharacterId?: string;
  unlockedBadgeIds: string[];
  unlockedTitleIds: string[];
  activeTitleId?: string;
  createdAt: string;
  updatedAt: string;
};
