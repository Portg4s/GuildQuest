import { scoreMultipliers } from "@/data/config/rewards.config";

export function getScoreMultiplier(score: number) {
  if (score >= 100) return scoreMultipliers.perfect100;
  if (score >= 80) return scoreMultipliers.bonus80To99;
  if (score >= 60) return scoreMultipliers.validated60To79;
  return scoreMultipliers.failedUnder60;
}

export function calculateReward(baseAmount: number, score: number) {
  return Math.round(baseAmount * getScoreMultiplier(score));
}
