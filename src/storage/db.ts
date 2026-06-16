import Dexie, { type EntityTable } from "dexie";
import type {
  ContentPack,
  GachaPull,
  GameSettings,
  Player,
  PlayerCharacter,
  PlayerTitle,
  Badge
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
  }
}

export const db = new GuildQuestDatabase();
