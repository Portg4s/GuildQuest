import type { PlayerCharacter } from "@/domain/models";
import { db } from "@/storage/db";

export async function getStoredCollection() {
  return db.playerCharacters.toArray();
}

export async function saveCollection(collection: PlayerCharacter[]) {
  await db.playerCharacters.bulkPut(collection);
}

export async function savePlayerCharacter(playerCharacter: PlayerCharacter) {
  await db.playerCharacters.put(playerCharacter);
}
