import type { Player } from "@/domain/models";
import { calculateLevelGemBonus } from "@/data/config/level-rewards.config";

export type LevelProgressionResult = {
  previousLevel: number;
  newLevel: number;
  levelsGained: number;
  currentXp: number;
  nextLevelXp: number;
  bonusGems: number;
  reachedLevels: number[];
};

export type PlayerRewardApplication = {
  player: Player;
  levelProgression: LevelProgressionResult;
  missionGemsGained: number;
  totalGemsGained: number;
};

export function getNextLevelXp(level: number) {
  return level * 100;
}

export function applyXpToLevel(level: number, xp: number) {
  let nextLevel = level;
  let remainingXp = xp;
  let nextLevelXp = getNextLevelXp(nextLevel);
  const reachedLevels: number[] = [];

  while (remainingXp >= nextLevelXp) {
    remainingXp -= nextLevelXp;
    nextLevel += 1;
    reachedLevels.push(nextLevel);
    nextLevelXp = getNextLevelXp(nextLevel);
  }

  return {
    level: nextLevel,
    xp: remainingXp,
    nextLevelXp,
    reachedLevels
  };
}

export function applyRewardsToPlayerDetailed(
  player: Player,
  xpGained: number,
  gemsGained: number
): PlayerRewardApplication {
  const leveled = applyXpToLevel(player.level, player.xp + xpGained);
  const bonusGems = leveled.reachedLevels.reduce(
    (total, levelReached) => total + calculateLevelGemBonus(levelReached),
    0
  );
  const totalGemsGained = gemsGained + bonusGems;

  const updatedPlayer = {
    ...player,
    level: leveled.level,
    xp: leveled.xp,
    nextLevelXp: leveled.nextLevelXp,
    gems: Math.max(0, player.gems + totalGemsGained),
    updatedAt: new Date().toISOString()
  };

  return {
    player: updatedPlayer,
    missionGemsGained: gemsGained,
    totalGemsGained,
    levelProgression: {
      previousLevel: player.level,
      newLevel: leveled.level,
      levelsGained: leveled.level - player.level,
      currentXp: leveled.xp,
      nextLevelXp: leveled.nextLevelXp,
      bonusGems,
      reachedLevels: leveled.reachedLevels
    }
  };
}

export function applyRewardsToPlayer(player: Player, xpGained: number, gemsGained: number): Player {
  return applyRewardsToPlayerDetailed(player, xpGained, gemsGained).player;
}
