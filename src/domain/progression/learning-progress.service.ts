import type { ContentPack, Quiz, Region, SkillNode, Zone } from "@/domain/models";
import type { QuizProgress } from "@/storage/db";

export type QuizLearningStatus = "Non tente" | "Echoue" | "Valide" | "Parfait";
export type ZoneLearningStatus = "Non commence" | "En cours" | "Termine";

export type ZoneProgress = {
  zone: Zone;
  quizCount: number;
  attemptedQuizCount: number;
  validatedQuizCount: number;
  perfectQuizCount: number;
  progressPercent: number;
  status: ZoneLearningStatus;
};

export type RegionProgress = {
  region: Region;
  zoneCount: number;
  completedZoneCount: number;
  quizCount: number;
  attemptedQuizCount: number;
  validatedQuizCount: number;
  perfectQuizCount: number;
  progressPercent: number;
  zones: ZoneProgress[];
};

export type SkillNodeProgress = {
  node: SkillNode;
  quizzes: Quiz[];
  bestScore: number;
  status: ZoneLearningStatus;
  progressPercent: number;
};

export function getQuizStatus(quizId: string, progressByQuizId: Record<string, QuizProgress>): QuizLearningStatus {
  const progress = progressByQuizId[quizId];

  if (!progress || progress.attempts === 0) return "Non tente";
  if (progress.bestScore >= 100) return "Parfait";
  if (progress.bestScore >= 60) return "Valide";
  return "Echoue";
}

export function calculateZoneProgress(
  zone: Zone,
  progressByQuizId: Record<string, QuizProgress>
): ZoneProgress {
  const quizCount = zone.quizIds.length;
  const attemptedQuizCount = zone.quizIds.filter((quizId) => progressByQuizId[quizId]?.attempts > 0).length;
  const validatedQuizCount = zone.quizIds.filter((quizId) => (progressByQuizId[quizId]?.bestScore ?? 0) >= 60).length;
  const perfectQuizCount = zone.quizIds.filter((quizId) => (progressByQuizId[quizId]?.bestScore ?? 0) >= 100).length;
  const progressPercent = quizCount === 0 ? 0 : Math.round((validatedQuizCount / quizCount) * 100);
  const status: ZoneLearningStatus =
    validatedQuizCount === quizCount && quizCount > 0
      ? "Termine"
      : attemptedQuizCount > 0
        ? "En cours"
        : "Non commence";

  return {
    zone,
    quizCount,
    attemptedQuizCount,
    validatedQuizCount,
    perfectQuizCount,
    progressPercent,
    status
  };
}

export function calculateRegionProgress(
  region: Region,
  progressByQuizId: Record<string, QuizProgress>
): RegionProgress {
  const zones = region.zones.map((zone) => calculateZoneProgress(zone, progressByQuizId));
  const quizCount = zones.reduce((total, zone) => total + zone.quizCount, 0);
  const attemptedQuizCount = zones.reduce((total, zone) => total + zone.attemptedQuizCount, 0);
  const validatedQuizCount = zones.reduce((total, zone) => total + zone.validatedQuizCount, 0);
  const perfectQuizCount = zones.reduce((total, zone) => total + zone.perfectQuizCount, 0);
  const completedZoneCount = zones.filter((zone) => zone.status === "Termine").length;

  return {
    region,
    zoneCount: zones.length,
    completedZoneCount,
    quizCount,
    attemptedQuizCount,
    validatedQuizCount,
    perfectQuizCount,
    progressPercent: quizCount === 0 ? 0 : Math.round((validatedQuizCount / quizCount) * 100),
    zones
  };
}

export function calculatePackProgress(pack: ContentPack, progressByQuizId: Record<string, QuizProgress>) {
  const regions = pack.regions.map((region) => calculateRegionProgress(region, progressByQuizId));
  const quizCount = regions.reduce((total, region) => total + region.quizCount, 0);
  const validatedQuizCount = regions.reduce((total, region) => total + region.validatedQuizCount, 0);
  const perfectQuizCount = regions.reduce((total, region) => total + region.perfectQuizCount, 0);

  return {
    pack,
    regions,
    quizCount,
    validatedQuizCount,
    perfectQuizCount,
    progressPercent: quizCount === 0 ? 0 : Math.round((validatedQuizCount / quizCount) * 100)
  };
}

export function getQuizzesForZone(pack: ContentPack, zone: Zone) {
  return zone.quizIds
    .map((quizId) => pack.quizzes.find((quiz) => quiz.id === quizId))
    .filter((quiz): quiz is Quiz => Boolean(quiz));
}

export function getSkillNodesForZone(pack: ContentPack, zoneId: string) {
  return pack.skillNodes
    .filter((node) => node.zoneId === zoneId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function calculateSkillNodeProgress(
  node: SkillNode,
  pack: ContentPack,
  progressByQuizId: Record<string, QuizProgress>
): SkillNodeProgress {
  const quizIds = node.quizIds ?? [];
  const quizzes = quizIds
    .map((quizId) => pack.quizzes.find((quiz) => quiz.id === quizId))
    .filter((quiz): quiz is Quiz => Boolean(quiz));
  const bestScore = quizIds.reduce((best, quizId) => Math.max(best, progressByQuizId[quizId]?.bestScore ?? 0), 0);
  const validatedQuizCount = quizIds.filter((quizId) => (progressByQuizId[quizId]?.bestScore ?? 0) >= 60).length;
  const attemptedQuizCount = quizIds.filter((quizId) => progressByQuizId[quizId]?.attempts > 0).length;
  const progressPercent = quizIds.length === 0 ? 0 : Math.round((validatedQuizCount / quizIds.length) * 100);
  const status: ZoneLearningStatus =
    validatedQuizCount === quizIds.length && quizIds.length > 0
      ? "Termine"
      : attemptedQuizCount > 0
        ? "En cours"
        : "Non commence";

  return {
    node,
    quizzes,
    bestScore,
    status,
    progressPercent
  };
}
