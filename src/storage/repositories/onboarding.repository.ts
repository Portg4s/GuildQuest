import { db } from "@/storage/db";
import { defaultSettings, normalizeSettings } from "@/storage/repositories/settings.repository";

export async function hasSeenOnboarding() {
  const settings = await db.settings.get(defaultSettings.id);
  return Boolean(settings?.onboardingSeen);
}

export async function setOnboardingSeen(seen: boolean) {
  const current = normalizeSettings((await db.settings.get(defaultSettings.id)) ?? defaultSettings);
  const next = {
    ...current,
    onboardingSeen: seen,
    updatedAt: new Date().toISOString()
  };

  await db.settings.put(next);
  return next;
}
