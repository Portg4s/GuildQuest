import type { Player } from "@/domain/models";
import { db } from "@/storage/db";

const PLAYER_ID = "player-leb";

export async function getStoredPlayer() {
  return db.player.get(PLAYER_ID);
}

export async function savePlayer(player: Player) {
  await db.player.put(player);
}
