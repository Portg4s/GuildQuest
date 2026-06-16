import { ArrowLeft, Gem, Trophy, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Player } from "@/domain/models";
import type { QuizProgress } from "@/storage/db";

type ProfileScreenProps = {
  player: Player;
  progressEntries: QuizProgress[];
  onBackHome: () => void;
};

export function ProfileScreen({ player, progressEntries, onBackHome }: ProfileScreenProps) {
  const completed = progressEntries.filter((entry) => entry.completedAt);
  const attempted = progressEntries.filter((entry) => entry.attempts > 0);
  const averageScore =
    attempted.length === 0
      ? 0
      : Math.round(attempted.reduce((total, entry) => total + (entry.lastScore ?? entry.bestScore), 0) / attempted.length);
  const bestScore = attempted.length === 0 ? 0 : Math.max(...attempted.map((entry) => entry.bestScore));
  const xpProgress = Math.min((player.xp / player.nextLevelXp) * 100, 100);

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Profil</p>
          <h1 className="text-3xl font-black text-white">{player.username}</h1>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Hall
        </Button>
      </header>

      <article className="rounded-lg border border-white/10 bg-slate-900/90 p-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-lg bg-teal-300/15 text-teal-100">
            <UserRound className="size-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Rang actuel</p>
            <h2 className="text-2xl font-black text-white">{player.rank}</h2>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Niveau {player.level}</span>
            <span className="font-bold text-white">
              {player.xp} / {player.nextLevelXp} XP
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-950">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-300 to-amber-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ProfileStat icon={<Gem className="size-5" />} label="Gemmes" value={player.gems} />
          <ProfileStat icon={<Trophy className="size-5" />} label="Quiz termines" value={completed.length} />
          <ProfileStat label="Score moyen" value={attempted.length ? `${averageScore}%` : "Aucun"} />
          <ProfileStat label="Meilleur score" value={attempted.length ? `${bestScore}%` : "Aucun"} />
        </div>
      </article>
    </section>
  );
}

function ProfileStat({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/[0.06] p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <p className="text-sm">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
