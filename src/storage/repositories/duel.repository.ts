import type { ArenaProgress, ArenaRank, DuelHistoryEntry, DuelTeam } from "@/domain/models";
import { db } from "@/storage/db";

const DUEL_TEAM_ID = "preferred-team";
const ARENA_ID = "main-arena";
const arenaOrder: ArenaRank[] = ["Bronze", "Argent", "Or", "Saphir", "Legende"];

export function getArenaRank(points: number): ArenaRank {
  if (points >= 500) return "Legende";
  if (points >= 300) return "Saphir";
  if (points >= 160) return "Or";
  if (points >= 60) return "Argent";
  return "Bronze";
}

export async function getStoredDuelTeam() {
  return db.duelTeam.get(DUEL_TEAM_ID);
}

export async function saveDuelTeam(characterIds: string[]) {
  const team: DuelTeam = {
    id: DUEL_TEAM_ID,
    characterIds: characterIds.slice(0, 3),
    updatedAt: new Date().toISOString()
  };

  await db.duelTeam.put(team);
  return team;
}

export async function getStoredDuelHistory() {
  return db.duelHistory.orderBy("playedAt").reverse().limit(10).toArray();
}

export async function getStoredArenaProgress() {
  const stored = await db.arenaProgress.get(ARENA_ID);

  if (stored) return stored;

  const created: ArenaProgress = {
    id: ARENA_ID,
    rank: "Bronze",
    points: 0,
    bestRank: "Bronze",
    updatedAt: new Date().toISOString()
  };
  await db.arenaProgress.put(created);
  return created;
}

export async function recordDuelHistory(entry: Omit<DuelHistoryEntry, "id" | "playedAt">) {
  const currentArena = await getStoredArenaProgress();
  const nextPoints = Math.max(0, currentArena.points + entry.arenaPointsGained);
  const rank = getArenaRank(nextPoints);
  const bestRank = arenaOrder.indexOf(rank) > arenaOrder.indexOf(currentArena.bestRank) ? rank : currentArena.bestRank;
  const arena: ArenaProgress = {
    ...currentArena,
    rank,
    bestRank,
    points: nextPoints,
    updatedAt: new Date().toISOString()
  };
  const history: DuelHistoryEntry = {
    ...entry,
    id: `duel-${Date.now()}`,
    playedAt: new Date().toISOString()
  };

  await db.transaction("rw", [db.duelHistory, db.arenaProgress], async () => {
    await db.duelHistory.put(history);
    await db.arenaProgress.put(arena);
    const all = await db.duelHistory.orderBy("playedAt").reverse().toArray();
    const stale = all.slice(10);
    if (stale.length) await db.duelHistory.bulkDelete(stale.map((item) => item.id));
  });

  return { history, arena };
}
