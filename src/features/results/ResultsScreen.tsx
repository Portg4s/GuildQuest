import { motion } from "framer-motion";
import { Crown, Gem, Medal, RotateCcw, ScrollText, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Badge, PlayerTitle, Quiz } from "@/domain/models";
import type { LevelProgressionResult } from "@/domain/progression/level.service";
import type { RewardResult } from "@/domain/reward/reward.service";
import { getResultStatus, type QuizScoreResult } from "@/domain/services/quiz.service";

type ResultsScreenProps = {
  quiz: Quiz;
  scoreResult: QuizScoreResult;
  rewards: RewardResult;
  levelProgression: LevelProgressionResult;
  totalGemsGained: number;
  newBadges: Badge[];
  newTitles: PlayerTitle[];
  onBackToMissions: () => void;
  onBackHome: () => void;
};

export function ResultsScreen({
  quiz,
  scoreResult,
  rewards,
  levelProgression,
  totalGemsGained,
  newBadges,
  newTitles,
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
        <h1 className="guild-title text-3xl">{quiz.title}</h1>
      </header>

      <article className="guild-panel magic-border p-5 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-200">
          {getResultStatus(scoreResult.score)}
        </p>
        <p className="mt-4 text-7xl font-black leading-none text-white">{scoreResult.score}%</p>
        <p className="mt-3 text-slate-300">
          {scoreResult.correctAnswers} bonnes reponses sur {scoreResult.totalQuestions}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-teal-200/25 bg-teal-300/10 p-4 shadow-[0_0_28px_rgba(45,212,191,0.12)]">
            <Trophy className="mx-auto size-6 text-teal-100" aria-hidden="true" />
            <p className="mt-2 text-2xl font-black text-white">+{rewards.xpGained}</p>
            <p className="text-sm text-teal-100">XP gagnee</p>
          </div>
          <div className="rounded-lg border border-amber-200/25 bg-amber-300/10 p-4 shadow-[0_0_28px_rgba(250,204,21,0.12)]">
            <Gem className="mx-auto size-6 text-amber-100" aria-hidden="true" />
            <p className="mt-2 text-2xl font-black text-white">+{rewards.gemsGained}</p>
            <p className="text-sm text-amber-100">Gemmes gagnees</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Multiplicateur applique : x{rewards.multiplier}
        </p>
      </article>

      {levelProgression.levelsGained > 0 && (
        <motion.article
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.38, ease: "easeOut" }}
          className="magic-border rounded-xl border border-amber-200/30 bg-amber-300/10 p-5 text-center shadow-[0_0_42px_rgba(252,211,77,0.22)]"
        >
          <Sparkles className="mx-auto size-8 text-amber-100" aria-hidden="true" />
          <p className="mt-2 text-sm font-black uppercase tracking-[0.22em] text-amber-100">Niveau superieur !</p>
          <p className="mt-2 text-4xl font-black text-white">
            {levelProgression.previousLevel} {"->"} {levelProgression.newLevel}
          </p>
          <p className="mt-2 text-sm text-amber-50">
            +{levelProgression.levelsGained} niveau{levelProgression.levelsGained > 1 ? "x" : ""} - +{levelProgression.bonusGems} gemmes bonus
          </p>
        </motion.article>
      )}

      <article className="guild-card p-5">
        <h2 className="text-xl font-black text-white">Resume des recompenses</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <RewardLine label="XP de mission" value={`+${rewards.xpGained}`} />
          <RewardLine label="Gemmes de mission" value={`+${rewards.gemsGained}`} />
          <RewardLine label="Bonus gemmes de niveau" value={`+${levelProgression.bonusGems}`} />
          <RewardLine label="Total gemmes gagnees" value={`+${totalGemsGained}`} />
        </div>
        {(newBadges.length > 0 || newTitles.length > 0) && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {newBadges.length > 0 && (
              <UnlockList icon={<Medal className="size-5" />} title="Badges debloques" items={newBadges.map((badge) => badge.name)} />
            )}
            {newTitles.length > 0 && (
              <UnlockList icon={<Crown className="size-5" />} title="Titres debloques" items={newTitles.map((title) => title.label)} />
            )}
          </div>
        )}
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

function RewardLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function UnlockList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-teal-200/20 bg-teal-300/10 p-3">
      <div className="flex items-center gap-2 text-teal-100">
        {icon}
        <p className="font-black">{title}</p>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-slate-100">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
