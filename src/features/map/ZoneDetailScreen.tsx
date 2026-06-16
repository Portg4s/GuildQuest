import { motion } from "framer-motion";
import { ArrowLeft, Play, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentPack, Quiz, Zone } from "@/domain/models";
import {
  calculateSkillNodeProgress,
  calculateZoneProgress,
  getQuizStatus,
  getQuizzesForZone,
  getSkillNodesForZone
} from "@/domain/progression/learning-progress.service";
import type { QuizProgress } from "@/storage/db";
import { StatusBadge } from "@/features/map/MapScreen";

type ZoneDetailScreenProps = {
  pack: ContentPack;
  zone: Zone;
  progressByQuizId: Record<string, QuizProgress>;
  onBackMap: () => void;
  onStartQuiz: (quiz: Quiz) => void;
};

export function ZoneDetailScreen({
  pack,
  zone,
  progressByQuizId,
  onBackMap,
  onStartQuiz
}: ZoneDetailScreenProps) {
  const zoneProgress = calculateZoneProgress(zone, progressByQuizId);
  const nodes = getSkillNodesForZone(pack, zone.id).map((node) =>
    calculateSkillNodeProgress(node, pack, progressByQuizId)
  );
  const fallbackQuizzes = getQuizzesForZone(pack, zone);

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Exploration de zone</p>
          <h1 className="guild-title text-3xl">{zone.name}</h1>
          <p className="mt-2 text-sm text-slate-300">{zone.description}</p>
        </div>
        <Button variant="guild" onClick={onBackMap}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Carte
        </Button>
      </header>

      <article className="guild-panel magic-border p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rune-mark grid size-11 place-items-center rounded-xl border border-teal-200/25 bg-teal-300/15 text-teal-100">
              <Route className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Progression de zone</p>
              <p className="text-2xl font-black text-white">{zoneProgress.progressPercent}%</p>
            </div>
          </div>
          <StatusBadge status={zoneProgress.status} />
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-200 to-amber-300 shadow-glow"
            style={{ width: `${zoneProgress.progressPercent}%` }}
          />
        </div>
      </article>

      <div className="space-y-4">
        {(nodes.length > 0 ? nodes : []).map((nodeProgress, index) => (
          <motion.article
            key={nodeProgress.node.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.28 }}
            className="guild-card relative p-4"
          >
            {index < nodes.length - 1 && (
              <div className="absolute left-8 top-full h-4 w-px bg-teal-300/30" aria-hidden="true" />
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-full border border-teal-200/40 bg-teal-300/15 text-sm font-black text-teal-100">
                    {index + 1}
                  </div>
                  <h2 className="text-xl font-black text-white">{nodeProgress.node.label}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{nodeProgress.node.description}</p>
              </div>
              <StatusBadge status={nodeProgress.status} />
            </div>

            <div className="mt-4 grid gap-3">
              {nodeProgress.quizzes.map((quiz) => (
                <QuizLaunchRow
                  key={quiz.id}
                  quiz={quiz}
                  bestScore={progressByQuizId[quiz.id]?.bestScore}
                  status={getQuizStatus(quiz.id, progressByQuizId)}
                  onStartQuiz={onStartQuiz}
                />
              ))}
            </div>
          </motion.article>
        ))}

        {nodes.length === 0 && fallbackQuizzes.map((quiz) => (
          <QuizLaunchRow
            key={quiz.id}
            quiz={quiz}
            bestScore={progressByQuizId[quiz.id]?.bestScore}
            status={getQuizStatus(quiz.id, progressByQuizId)}
            onStartQuiz={onStartQuiz}
          />
        ))}
      </div>
    </section>
  );
}

function QuizLaunchRow({
  quiz,
  bestScore,
  status,
  onStartQuiz
}: {
  quiz: Quiz;
  bestScore?: number;
  status: string;
  onStartQuiz: (quiz: Quiz) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/55 p-3 transition hover:border-teal-200/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">Rang {quiz.rank}</p>
          <h3 className="mt-1 font-black text-white">{quiz.title}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {quiz.questions.length} questions - meilleur score : {bestScore !== undefined ? `${bestScore}%` : "non tente"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={status} />
          <Button onClick={() => onStartQuiz(quiz)}>
            <Play className="mr-2 size-4" aria-hidden="true" />
            Lancer
          </Button>
        </div>
      </div>
    </div>
  );
}
