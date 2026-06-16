import { useMemo, useState } from "react";
import { ArrowLeft, Gem, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/domain/services/mission.service";
import { cn } from "@/lib/utils";

type MissionsScreenProps = {
  missions: Mission[];
  onBackHome: () => void;
  onStartQuiz: (mission: Mission) => void;
};

type MissionStatusFilter = "all" | "unattempted" | "validated" | "perfect";

const statusFilters: { id: MissionStatusFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "unattempted", label: "Non tentes" },
  { id: "validated", label: "Valides" },
  { id: "perfect", label: "Parfaits" }
];

export function MissionsScreen({ missions, onBackHome, onStartQuiz }: MissionsScreenProps) {
  const [statusFilter, setStatusFilter] = useState<MissionStatusFilter>("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const zones = useMemo(() => Array.from(new Set(missions.map((mission) => mission.zoneName))), [missions]);
  const filteredMissions = useMemo(
    () =>
      missions.filter((mission) => {
        const bestScore = mission.progress?.bestScore;
        const matchesZone = zoneFilter === "all" || mission.zoneName === zoneFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "unattempted" && !mission.progress) ||
          (statusFilter === "validated" && (bestScore ?? 0) >= 60) ||
          (statusFilter === "perfect" && (bestScore ?? 0) >= 100);

        return matchesZone && matchesStatus;
      }),
    [missions, statusFilter, zoneFilter]
  );

  return (
    <section className="space-y-3">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Missions</p>
          <h1 className="guild-title text-2xl">Plaine des Fondations</h1>
          <p className="mt-1 text-sm text-slate-300">Acces rapide aux quetes du pack Fondations Web.</p>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Hall
        </Button>
      </header>

      <div className="guild-panel space-y-2 p-2.5">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setStatusFilter(filter.id)}
            className={cn(
                "shrink-0 rounded-md border px-3 py-1.5 text-xs font-black transition active:scale-[0.98]",
                statusFilter === filter.id
                  ? "border-teal-200 bg-teal-300 text-slate-950"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-teal-200/50"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setZoneFilter("all")}
            className={cn(
              "shrink-0 rounded-md border px-3 py-1.5 text-xs font-bold transition active:scale-[0.98]",
              zoneFilter === "all"
                ? "border-amber-200 bg-amber-300 text-slate-950"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-amber-200/50"
            )}
          >
            Toutes zones
          </button>
          {zones.map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setZoneFilter(zone)}
              className={cn(
                "shrink-0 rounded-md border px-3 py-1.5 text-xs font-bold transition active:scale-[0.98]",
                zoneFilter === zone
                  ? "border-amber-200 bg-amber-300 text-slate-950"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-amber-200/50"
              )}
            >
              {zone}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold text-slate-400">
          {filteredMissions.length} / {missions.length} missions affichees
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filteredMissions.map((mission) => (
          <article
            key={mission.quiz.id}
            className="guild-card magic-border p-3 transition hover:-translate-y-0.5 hover:border-teal-200/35"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
                  {mission.zoneName}
                </p>
                <h2 className="mt-1 line-clamp-1 text-base font-black text-white">{mission.quiz.title}</h2>
              </div>
              <span className="shrink-0 rounded-md border border-amber-100/50 bg-gradient-to-r from-amber-300 to-yellow-200 px-2 py-1 text-xs font-black text-slate-950 shadow-[0_0_18px_rgba(250,204,21,0.18)]">
                Rang {mission.quiz.rank}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-400">{mission.quiz.description}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border border-white/10 bg-white/[0.06] p-2">
                <p className="text-slate-400">Questions</p>
                <p className="font-black text-white">{mission.quiz.questions.length}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.06] p-2">
                <p className="text-slate-400">Meilleur score</p>
                <p className="font-black text-white">
                  {mission.progress ? `${mission.progress.bestScore}%` : "Non tentee"}
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-teal-300/15 px-2 py-1 text-xs font-bold text-teal-100">
                <Trophy className="size-3.5" aria-hidden="true" />
                {mission.baseXp} XP
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-300/15 px-2 py-1 text-xs font-bold text-amber-100">
                <Gem className="size-3.5" aria-hidden="true" />
                {mission.baseGems} gemmes
              </span>
            </div>
            <Button className="mt-2 h-8 w-full text-sm" onClick={() => onStartQuiz(mission)}>
              <Play className="mr-2 size-4" aria-hidden="true" />
              Lancer
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
