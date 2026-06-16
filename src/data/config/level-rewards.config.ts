export function calculateLevelGemBonus(levelReached: number) {
  return Math.round(75 * Math.pow(levelReached, 1.15));
}
