import { missionRankRewards } from "@/data/config/rewards.config";
import type { ContentPack, Quiz } from "@/domain/models";
import type { QuizProgress } from "@/storage/db";

export type Mission = {
  quiz: Quiz;
  regionName: string;
  zoneName: string;
  baseXp: number;
  baseGems: number;
  progress?: QuizProgress;
};

export function buildMissionsFromPack(pack: ContentPack, progressByQuizId: Record<string, QuizProgress>) {
  return pack.quizzes.map<Mission>((quiz) => {
    const region = pack.regions.find((candidate) =>
      candidate.zones.some((zone) => zone.id === quiz.zoneId)
    );
    const zone = region?.zones.find((candidate) => candidate.id === quiz.zoneId);
    const reward = missionRankRewards[quiz.rank];

    return {
      quiz,
      regionName: region?.name ?? "Region inconnue",
      zoneName: zone?.name ?? "Zone inconnue",
      baseXp: reward.xp,
      baseGems: reward.gems,
      progress: progressByQuizId[quiz.id]
    };
  });
}
