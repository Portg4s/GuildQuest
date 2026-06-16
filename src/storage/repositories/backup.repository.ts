import type { Badge, ContentPack, GachaPull, GameSettings, Player, PlayerCharacter, PlayerTitle } from "@/domain/models";
import { getDefaultUnlockedTitles } from "@/domain/progression/achievements.service";
import { defaultPlayer } from "@/stores/player.store";
import { db, type QuizProgress } from "@/storage/db";
import { defaultSettings } from "@/storage/repositories/settings.repository";

export const BACKUP_VERSION = 1;
export const BACKUP_APP_NAME = "GuildQuest";

export type GuildQuestBackupData = {
  player: Player[];
  playerCharacters: PlayerCharacter[];
  quizProgress: QuizProgress[];
  gachaHistory: GachaPull[];
  unlockedBadges: Badge[];
  unlockedTitles: PlayerTitle[];
  settings: GameSettings[];
  installedPacks: ContentPack[];
};

export type GuildQuestBackup = {
  metadata: {
    appName: typeof BACKUP_APP_NAME;
    backupVersion: number;
    exportedAt: string;
    schemaVersion: number;
  };
  data: GuildQuestBackupData;
};

export async function createFullBackup(): Promise<GuildQuestBackup> {
  const [
    player,
    playerCharacters,
    quizProgress,
    gachaHistory,
    unlockedBadges,
    unlockedTitles,
    settings,
    installedPacks
  ] = await Promise.all([
    db.player.toArray(),
    db.playerCharacters.toArray(),
    db.quizProgress.toArray(),
    db.gachaHistory.toArray(),
    db.unlockedBadges.toArray(),
    db.unlockedTitles.toArray(),
    db.settings.toArray(),
    db.installedPacks.toArray()
  ]);

  return {
    metadata: {
      appName: BACKUP_APP_NAME,
      backupVersion: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      schemaVersion: 1
    },
    data: {
      player,
      playerCharacters,
      quizProgress,
      gachaHistory,
      unlockedBadges,
      unlockedTitles,
      settings,
      installedPacks
    }
  };
}

export function validateBackup(candidate: unknown): candidate is GuildQuestBackup {
  if (!candidate || typeof candidate !== "object") return false;

  const backup = candidate as Partial<GuildQuestBackup>;
  const metadata = backup.metadata;
  const data = backup.data;

  if (!metadata || metadata.appName !== BACKUP_APP_NAME) return false;
  if (typeof metadata.backupVersion !== "number" || metadata.backupVersion < 1) return false;
  if (!data || typeof data !== "object") return false;

  return [
    data.player,
    data.playerCharacters,
    data.quizProgress,
    data.gachaHistory,
    data.unlockedBadges,
    data.unlockedTitles,
    data.settings,
    data.installedPacks
  ].every(Array.isArray);
}

export function summarizeBackup(backup: GuildQuestBackup) {
  return {
    exportedAt: backup.metadata.exportedAt,
    backupVersion: backup.metadata.backupVersion,
    playerCount: backup.data.player.length,
    characterCount: backup.data.playerCharacters.length,
    quizProgressCount: backup.data.quizProgress.length,
    gachaPullCount: backup.data.gachaHistory.length,
    badgeCount: backup.data.unlockedBadges.length,
    titleCount: backup.data.unlockedTitles.length
  };
}

export async function importFullBackup(backup: GuildQuestBackup) {
  if (!validateBackup(backup)) {
    throw new Error("Sauvegarde GuildQuest invalide.");
  }

  await db.transaction(
    "rw",
    [
      db.player,
      db.playerCharacters,
      db.quizProgress,
      db.gachaHistory,
      db.unlockedBadges,
      db.unlockedTitles,
      db.settings,
      db.installedPacks
    ],
    async () => {
      await Promise.all([
        db.player.clear(),
        db.playerCharacters.clear(),
        db.quizProgress.clear(),
        db.gachaHistory.clear(),
        db.unlockedBadges.clear(),
        db.unlockedTitles.clear(),
        db.settings.clear(),
        db.installedPacks.clear()
      ]);

      await Promise.all([
        db.player.bulkPut(backup.data.player),
        db.playerCharacters.bulkPut(backup.data.playerCharacters),
        db.quizProgress.bulkPut(backup.data.quizProgress),
        db.gachaHistory.bulkPut(backup.data.gachaHistory),
        db.unlockedBadges.bulkPut(backup.data.unlockedBadges),
        db.unlockedTitles.bulkPut(backup.data.unlockedTitles),
        db.settings.bulkPut(backup.data.settings),
        db.installedPacks.bulkPut(backup.data.installedPacks)
      ]);
    }
  );
}

export async function resetAllLocalData() {
  const defaultTitles = getDefaultUnlockedTitles();

  await db.transaction(
    "rw",
    [
      db.player,
      db.playerCharacters,
      db.quizProgress,
      db.gachaHistory,
      db.unlockedBadges,
      db.unlockedTitles,
      db.settings,
      db.installedPacks
    ],
    async () => {
      await Promise.all([
        db.player.clear(),
        db.playerCharacters.clear(),
        db.quizProgress.clear(),
        db.gachaHistory.clear(),
        db.unlockedBadges.clear(),
        db.unlockedTitles.clear(),
        db.settings.clear(),
        db.installedPacks.clear()
      ]);

      await Promise.all([
        db.player.put({
          ...defaultPlayer,
          updatedAt: new Date().toISOString()
        }),
        db.unlockedTitles.bulkPut(defaultTitles),
        db.settings.put(defaultSettings)
      ]);
    }
  );
}

export function createBackupFileName(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `guildquest-backup-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}.json`;
}
