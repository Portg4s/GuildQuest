import type { Badge, PlayerTitle } from "@/domain/models";
import { db } from "@/storage/db";

export async function getStoredBadges() {
  return db.unlockedBadges.toArray();
}

export async function getStoredTitles() {
  return db.unlockedTitles.toArray();
}

export async function saveUnlockedBadges(badges: Badge[]) {
  if (badges.length === 0) return;
  await db.unlockedBadges.bulkPut(badges);
}

export async function saveUnlockedTitles(titles: PlayerTitle[]) {
  if (titles.length === 0) return;
  await db.unlockedTitles.bulkPut(titles);
}
