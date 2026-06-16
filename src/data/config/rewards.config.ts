import type { MissionRank } from "@/domain/models";

export const missionRankRewards: Record<MissionRank, { xp: number; gems: number }> = {
  F: { xp: 50, gems: 20 },
  E: { xp: 75, gems: 30 },
  D: { xp: 100, gems: 40 },
  C: { xp: 150, gems: 60 },
  B: { xp: 220, gems: 90 },
  A: { xp: 350, gems: 140 },
  S: { xp: 500, gems: 220 }
};

export const scoreMultipliers = {
  failedUnder60: 0.2,
  validated60To79: 1,
  bonus80To99: 1.3,
  perfect100: 1.8
} as const;
