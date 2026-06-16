import { db, type QuizProgress, type QuizProgressReward } from "@/storage/db";

export async function getAllQuizProgress() {
  return db.quizProgress.toArray();
}

export async function getQuizProgressMap() {
  const entries = await getAllQuizProgress();
  return Object.fromEntries(entries.map((entry) => [entry.quizId, entry]));
}

export async function recordQuizAttempt(params: {
  quizId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  rewards: QuizProgressReward;
}) {
  const now = new Date().toISOString();
  const current = await db.quizProgress.get(params.quizId);
  const next: QuizProgress = {
    id: params.quizId,
    quizId: params.quizId,
    bestScore: Math.max(current?.bestScore ?? 0, params.score),
    attempts: (current?.attempts ?? 0) + 1,
    lastScore: params.score,
    lastCorrectAnswers: params.correctAnswers,
    lastTotalQuestions: params.totalQuestions,
    lastRewards: params.rewards,
    completedAt: params.score >= 60 ? now : current?.completedAt,
    updatedAt: now
  };

  await db.quizProgress.put(next);
  return next;
}
