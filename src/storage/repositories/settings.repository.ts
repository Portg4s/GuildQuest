import type { GameSettings } from "@/domain/models";
import { db } from "@/storage/db";

export const SETTINGS_ID = "settings-main";

export const defaultSettings: GameSettings = {
  id: SETTINGS_ID,
  animationsEnabled: true,
  soundEnabled: false,
  reducedMotion: false,
  animationSpeed: "normal",
  showIntroSplash: true,
  language: "fr",
  updatedAt: new Date().toISOString()
};

export async function getStoredSettings() {
  return db.settings.get(SETTINGS_ID);
}

export async function saveSettings(settings: GameSettings) {
  await db.settings.put({
    ...settings,
    updatedAt: new Date().toISOString()
  });
}

export function normalizeSettings(settings?: Partial<GameSettings>): GameSettings {
  return {
    ...defaultSettings,
    ...settings,
    id: SETTINGS_ID,
    animationSpeed: settings?.animationSpeed ?? (settings?.reducedMotion ? "reduced" : "normal"),
    updatedAt: settings?.updatedAt ?? new Date().toISOString()
  };
}
