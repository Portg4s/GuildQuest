import type { GachaPull } from "@/domain/models";
import { db } from "@/storage/db";

export async function getStoredGachaHistory() {
  return db.gachaHistory.orderBy("pulledAt").reverse().toArray();
}

export async function saveGachaPulls(pulls: GachaPull[]) {
  await db.gachaHistory.bulkPut(pulls);
}
