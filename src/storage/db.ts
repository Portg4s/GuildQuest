import Dexie, { type EntityTable } from "dexie";
import type {
  ContentPack,
  GachaPull,
  GameSettings,
  Player,
  PlayerCharacter,
  PlayerTitle,
  Badge,
  DailyProgress,
  StreakState,
  ShopPurchase,
  DuelTeam,
  DuelHistoryEntry,
  ArenaProgress
} from "@/domain/models";

export type QuizProgress = {
  id: string;
  quizId: string;
  bestScore: number;
  attempts: number;
  lastScore?: number;
  lastCorrectAnswers?: number;
  lastTotalQuestions?: number;
  lastRewards?: QuizProgressReward;
  completedAt?: string;
  updatedAt: string;
};

export type QuizProgressReward = {
  xpGained: number;
  gemsGained: number;
  missionGemsGained?: number;
  levelBonusGems?: number;
};

export class GuildQuestDatabase extends Dexie {
  player!: EntityTable<Player, "id">;
  playerCharacters!: EntityTable<PlayerCharacter, "id">;
  quizProgress!: EntityTable<QuizProgress, "id">;
  gachaHistory!: EntityTable<GachaPull, "id">;
  unlockedBadges!: EntityTable<Badge, "id">;
  unlockedTitles!: EntityTable<PlayerTitle, "id">;
  settings!: EntityTable<GameSettings, "id">;
  installedPacks!: EntityTable<ContentPack, "id">;
  dailyProgress!: EntityTable<DailyProgress, "id">;
  streakState!: EntityTable<StreakState, "id">;
  shopPurchases!: EntityTable<ShopPurchase, "id">;
  duelTeam!: EntityTable<DuelTeam, "id">;
  duelHistory!: EntityTable<DuelHistoryEntry, "id">;
  arenaProgress!: EntityTable<ArenaProgress, "id">;

  constructor() {
    super("guildquest");
    this.version(1).stores({
      player: "id, username, rank, level, updatedAt",
      playerCharacters: "id, characterId, isActive, unlockedAt",
      quizProgress: "id, quizId, bestScore, completedAt, updatedAt",
      gachaHistory: "id, characterId, rarity, pulledAt",
      unlockedBadges: "id, unlockedAt",
      unlockedTitles: "id, unlockedAt",
      settings: "id, updatedAt",
      installedPacks: "id, version, installedAt"
    });
    this.version(2).stores({
      player: "id, username, rank, level, updatedAt",
      playerCharacters: "id, characterId, isActive, unlockedAt",
      quizProgress: "id, quizId, bestScore, completedAt, updatedAt",
      gachaHistory: "id, characterId, rarity, pulledAt",
      unlockedBadges: "id, unlockedAt",
      unlockedTitles: "id, unlockedAt",
      settings: "id, updatedAt",
      installedPacks: "id, version, installedAt",
      dailyProgress: "id, dateKey, updatedAt",
      streakState: "id, lastActiveDateKey, updatedAt",
      shopPurchases: "id, itemId, purchasedAt",
      duelTeam: "id, updatedAt",
      duelHistory: "id, opponentId, playedAt",
      arenaProgress: "id, rank, points, updatedAt"
    });
  }
}

export const db = new GuildQuestDatabase();
