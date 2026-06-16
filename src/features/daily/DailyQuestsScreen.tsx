import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, Flame, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dailyQuestDefinitions } from "@/data/config/daily-quests.config";
import type { DailyProgress, DailyQuestId, StreakState } from "@/domain/models";
import { getTomorrowLabel } from "@/domain/services/date-key.service";

type DailyQuestsScreenProps = {
  dailyProgress: DailyProgress;
  streak: StreakState;
  weeklyStats: {
    quizCompleted: number;
    duelWins: number;
    gachaPulls: number;
    perfectQuiz: number;
  };
  onBackHome: () => void;
  onClaimQuest: (questId: DailyQuestId) => void;
};

const weeklyGoals = [
  { id: "week-quiz", title: "5 quiz termines", valueKey: "quizCompleted", target: 5 },
  { id: "week-duel", title: "3 duels gagnes", valueKey: "duelWins", target: 3 },
  { id: "week-gacha", title: "5 invocations", valueKey: "gachaPulls", target: 5 },
  { id: "week-perfect", title: "1 quiz parfait", valueKey: "perfectQuiz", target: 1 }
] as const;

export function DailyQuestsScreen({
  dailyProgress,
  streak,
  weeklyStats,
  onBackHome,
  onClaimQuest
}: DailyQuestsScreenProps) {
  const readyToClaim = dailyProgress.quests.filter((quest) => quest.completed && !quest.claimed).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-3"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Tableau de guilde</p>
          <h1 className="guild-title text-2xl">Quetes quotidiennes</h1>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" />
          Hall
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <DailyStat icon={<Flame className="size-5" />} label="Streak" value={`${streak.current} j`} />
        <DailyStat icon={<Trophy className="size-5" />} label="Meilleur" value={`${streak.best} j`} />
        <DailyStat icon={<Gift className="size-5" />} label="A reclamer" value={readyToClaim} />
        <DailyStat icon={<Clock className="size-5" />} label="Reset" value={getTomorrowLabel()} />
      </div>

      <article className="guild-panel magic-border p-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-teal-100" />
          <h2 className="text-xl font-black text-white">Aujourd'hui</h2>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {dailyProgress.quests.map((progress) => {
            const definition = dailyQuestDefinitions.find((quest) => quest.id === progress.id);
            if (!definition) return null;
            const percent = Math.min(100, Math.round((progress.value / progress.target) * 100));

            return (
              <div key={progress.id} className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-white">{definition.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-300">{definition.description}</p>
                  </div>
                  {progress.claimed ? (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-200" />
                  ) : (
                    <span className="shrink-0 rounded-md bg-black/25 px-2 py-1 text-xs font-black text-amber-100">
                      {progress.value}/{progress.target}
                    </span>
                  )}
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-amber-300" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-amber-100">
                    +{definition.reward.xp} XP / +{definition.reward.gems} gemmes
                  </p>
                  <Button
                    size="sm"
                    disabled={!progress.completed || progress.claimed}
                    onClick={() => onClaimQuest(progress.id)}
                  >
                    {progress.claimed ? "Recu" : "Reclamer"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      <article className="guild-card p-4">
        <h2 className="text-xl font-black text-white">Quetes hebdomadaires V1</h2>
        <p className="mt-1 text-sm text-slate-300">Suivi simple, recompenses hebdo detaillees a venir.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {weeklyGoals.map((goal) => {
            const value = weeklyStats[goal.valueKey];
            const percent = Math.min(100, Math.round((value / goal.target) * 100));

            return (
              <div key={goal.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="flex justify-between gap-2 text-sm font-bold">
                  <span className="text-white">{goal.title}</span>
                  <span className="text-teal-100">{Math.min(value, goal.target)}/{goal.target}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-950">
                  <div className="h-full rounded-full bg-cyan-300" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </motion.section>
  );
}

function DailyStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="guild-card p-3">
      <div className="flex items-center gap-2 text-teal-100">{icon}<span className="text-xs font-bold text-slate-300">{label}</span></div>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
