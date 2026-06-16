import { missionRankRewards } from "@/data/config/rewards.config";
import type { MissionRank } from "@/domain/models";
import { calculateReward, getScoreMultiplier } from "@/utils/calculations";

export type RewardResult = {
  baseXp: number;
  baseGems: number;
  multiplier: number;
  xpGained: number;
  gemsGained: number;
};

export function calculateMissionRewards(rank: MissionRank, score: number): RewardResult {
  const baseReward = missionRankRewards[rank];

  return {
    baseXp: baseReward.xp,
    baseGems: baseReward.gems,
    multiplier: getScoreMultiplier(score),
    xpGained: calculateReward(baseReward.xp, score),
    gemsGained: calculateReward(baseReward.gems, score)
  };
}
