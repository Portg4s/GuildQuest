import { badgeDefinitions } from "@/data/config/badges.config";
import { defaultTitleIds, titleDefinitions } from "@/data/config/titles.config";
import type { Badge, GachaPull, Player, PlayerCharacter, PlayerTitle } from "@/domain/models";
import type { LevelProgressionResult } from "@/domain/progression/level.service";
import type { RegionProgress } from "@/domain/progression/learning-progress.service";
import type { QuizScoreResult } from "@/domain/services/quiz.service";

function nowIso() {
  return new Date().toISOString();
}

function unlockBadges(candidateIds: string[], alreadyUnlockedIds: string[]) {
  const unlockedIds = new Set(alreadyUnlockedIds);

  return candidateIds
    .filter((id) => !unlockedIds.has(id))
    .map((id) => badgeDefinitions.find((badge) => badge.id === id))
    .filter((badge): badge is (typeof badgeDefinitions)[number] => Boolean(badge))
    .map<Badge>((badge) => ({ ...badge, unlockedAt: nowIso() }));
}

function unlockTitles(candidateIds: string[], alreadyUnlockedIds: string[]) {
  const unlockedIds = new Set([...defaultTitleIds, ...alreadyUnlockedIds]);

  return candidateIds
    .filter((id) => !unlockedIds.has(id))
    .map((id) => titleDefinitions.find((title) => title.id === id))
    .filter((title): title is (typeof titleDefinitions)[number] => Boolean(title))
    .map<PlayerTitle>((title) => ({ ...title, unlockedAt: nowIso() }));
}

export function getDefaultUnlockedTitles() {
  return titleDefinitions
    .filter((title) => defaultTitleIds.includes(title.id))
    .map<PlayerTitle>((title) => ({ ...title, unlockedAt: nowIso() }));
}

export function evaluateLearningUnlocks(params: {
  player: Player;
  scoreResult: QuizScoreResult;
  levelProgression: LevelProgressionResult;
  regionProgress: RegionProgress;
  unlockedBadgeIds: string[];
  unlockedTitleIds: string[];
}) {
  const badgeCandidates: string[] = [];
  const titleCandidates: string[] = [];

  if (params.scoreResult.score >= 60) badgeCandidates.push("first-quiz-success");
  if (params.scoreResult.score === 100) badgeCandidates.push("first-perfect");
  if (params.regionProgress.validatedQuizCount >= 5) {
    badgeCandidates.push("five-quiz-completed");
    titleCandidates.push("skill-hunter");
  }
  if (params.regionProgress.validatedQuizCount >= 10) badgeCandidates.push("ten-quiz-completed");
  if (params.regionProgress.progressPercent >= 50) titleCandidates.push("web-mage");
  if (params.regionProgress.completedZoneCount >= 1) {
    badgeCandidates.push("foundations-explorer");
    titleCandidates.push("foundations-strategist");
  }
  if (params.regionProgress.validatedQuizCount === params.regionProgress.quizCount) {
    badgeCandidates.push("foundations-master");
  }
  if (params.levelProgression.levelsGained > 0) badgeCandidates.push("first-level-up");
  if (params.player.level >= 5) {
    badgeCandidates.push("level-5");
    titleCandidates.push("rising-star");
  }
  if (params.player.level >= 10) badgeCandidates.push("level-10");

  return {
    newBadges: unlockBadges(badgeCandidates, params.unlockedBadgeIds),
    newTitles: unlockTitles(titleCandidates, params.unlockedTitleIds)
  };
}

export function evaluateGachaUnlocks(params: {
  pulls: GachaPull[];
  collection: PlayerCharacter[];
  unlockedBadgeIds: string[];
  unlockedTitleIds: string[];
}) {
  const badgeCandidates: string[] = [];
  const titleCandidates: string[] = [];

  if (params.pulls.length > 0) {
    badgeCandidates.push("first-invocation");
    titleCandidates.push("novice-summoner");
  }
  if (params.pulls.some((pull) => ["RARE", "EPIC", "LEGENDARY", "MYTHIC"].includes(pull.rarity))) {
    badgeCandidates.push("first-rare-character");
  }
  if (params.pulls.some((pull) => ["LEGENDARY", "MYTHIC"].includes(pull.rarity))) {
    badgeCandidates.push("first-legendary-character");
  }
  if (params.collection.length >= 5) {
    titleCandidates.push("guild-collector");
  }

  return {
    newBadges: unlockBadges(badgeCandidates, params.unlockedBadgeIds),
    newTitles: unlockTitles(titleCandidates, params.unlockedTitleIds)
  };
}
