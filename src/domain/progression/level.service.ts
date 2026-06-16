import type { Player } from "@/domain/models";

export function getNextLevelXp(level: number) {
  return level * 100;
}

export function applyXpToLevel(level: number, xp: number) {
  let nextLevel = level;
  let remainingXp = xp;
  let nextLevelXp = getNextLevelXp(nextLevel);

  while (remainingXp >= nextLevelXp) {
    remainingXp -= nextLevelXp;
    nextLevel += 1;
    nextLevelXp = getNextLevelXp(nextLevel);
  }

  return {
    level: nextLevel,
    xp: remainingXp,
    nextLevelXp
  };
}

export function applyRewardsToPlayer(player: Player, xpGained: number, gemsGained: number): Player {
  const leveled = applyXpToLevel(player.level, player.xp + xpGained);

  return {
    ...player,
    level: leveled.level,
    xp: leveled.xp,
    nextLevelXp: leveled.nextLevelXp,
    gems: Math.max(0, player.gems + gemsGained),
    updatedAt: new Date().toISOString()
  };
}
