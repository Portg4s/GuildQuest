import { motion } from "framer-motion";
import { Gem, RotateCcw, ScrollText, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quiz } from "@/domain/models";
import type { RewardResult } from "@/domain/reward/reward.service";
import { getResultStatus, type QuizScoreResult } from "@/domain/services/quiz.service";

type ResultsScreenProps = {
  quiz: Quiz;
  scoreResult: QuizScoreResult;
  rewards: RewardResult;
  onBackToMissions: () => void;
  onBackHome: () => void;
};

export function ResultsScreen({
  quiz,
  scoreResult,
  rewards,
  onBackToMissions,
  onBackHome
}: ResultsScreenProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-3xl space-y-5"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Rapport de mission</p>
        <h1 className="text-3xl font-black text-white">{quiz.title}</h1>
      </header>

      <article className="rounded-lg border border-white/10 bg-slate-900/90 p-5 text-center shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-200">
          {getResultStatus(scoreResult.score)}
        </p>
        <p className="mt-4 text-7xl font-black leading-none text-white">{scoreResult.score}%</p>
        <p className="mt-3 text-slate-300">
          {scoreResult.correctAnswers} bonnes reponses sur {scoreResult.totalQuestions}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-teal-200/20 bg-teal-300/10 p-4">
            <Trophy className="mx-auto size-6 text-teal-100" aria-hidden="true" />
            <p className="mt-2 text-2xl font-black text-white">+{rewards.xpGained}</p>
            <p className="text-sm text-teal-100">XP gagnee</p>
          </div>
          <div className="rounded-lg border border-amber-200/20 bg-amber-300/10 p-4">
            <Gem className="mx-auto size-6 text-amber-100" aria-hidden="true" />
            <p className="mt-2 text-2xl font-black text-white">+{rewards.gemsGained}</p>
            <p className="text-sm text-amber-100">Gemmes gagnees</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Multiplicateur applique : x{rewards.multiplier}
        </p>
      </article>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="guild" size="lg" onClick={onBackToMissions}>
          <ScrollText className="mr-2 size-4" aria-hidden="true" />
          Retour aux missions
        </Button>
        <Button size="lg" onClick={onBackHome}>
          <RotateCcw className="mr-2 size-4" aria-hidden="true" />
          Retour au hall
        </Button>
      </div>
    </motion.section>
  );
}
