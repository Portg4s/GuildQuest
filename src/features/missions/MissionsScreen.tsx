import { ArrowLeft, Gem, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/domain/services/mission.service";

type MissionsScreenProps = {
  missions: Mission[];
  onBackHome: () => void;
  onStartQuiz: (mission: Mission) => void;
};

export function MissionsScreen({ missions, onBackHome, onStartQuiz }: MissionsScreenProps) {
  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Missions</p>
          <h1 className="text-3xl font-black text-white">Plaine des Fondations</h1>
          <p className="mt-2 text-sm text-slate-300">Choisis une quete du pack Fondations Web.</p>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Hall
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {missions.map((mission) => (
          <article
            key={mission.quiz.id}
            className="rounded-lg border border-white/10 bg-slate-900/85 p-4 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
                  {mission.zoneName}
                </p>
                <h2 className="mt-1 text-xl font-black text-white">{mission.quiz.title}</h2>
              </div>
              <span className="rounded-md bg-amber-300 px-2.5 py-1 text-xs font-black text-slate-950">
                Rang {mission.quiz.rank}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{mission.quiz.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-white/[0.06] p-3">
                <p className="text-slate-400">Questions</p>
                <p className="mt-1 font-black text-white">{mission.quiz.questions.length}</p>
              </div>
              <div className="rounded-lg bg-white/[0.06] p-3">
                <p className="text-slate-400">Meilleur score</p>
                <p className="mt-1 font-black text-white">
                  {mission.progress ? `${mission.progress.bestScore}%` : "Non tentee"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-teal-300/15 px-2.5 py-1 text-sm font-bold text-teal-100">
                <Trophy className="size-4" aria-hidden="true" />
                {mission.baseXp} XP
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-300/15 px-2.5 py-1 text-sm font-bold text-amber-100">
                <Gem className="size-4" aria-hidden="true" />
                {mission.baseGems} gemmes
              </span>
            </div>
            <Button className="mt-5 w-full" onClick={() => onStartQuiz(mission)}>
              <Play className="mr-2 size-4" aria-hidden="true" />
              Lancer la mission
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
