import { ArrowLeft, Compass, Map, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentPack } from "@/domain/models";
import type { RegionProgress, ZoneProgress } from "@/domain/progression/learning-progress.service";

type MapScreenProps = {
  pack: ContentPack;
  regionProgress: RegionProgress;
  onBackHome: () => void;
  onExploreZone: (zoneId: string) => void;
};

export function MapScreen({ pack, regionProgress, onBackHome, onExploreZone }: MapScreenProps) {
  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Pack actif : {pack.name}</p>
          <h1 className="guild-title text-3xl">Carte des regions</h1>
          <p className="mt-2 text-sm text-slate-300">{pack.description}</p>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Hall
        </Button>
      </header>

      <article className="guild-panel magic-border p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rune-mark grid size-12 place-items-center rounded-xl border border-teal-200/25 bg-teal-300/15 text-teal-100 shadow-glow">
              <Map className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Region</p>
              <h2 className="text-2xl font-black text-white">{regionProgress.region.name}</h2>
            </div>
          </div>
          <div className="rounded-lg border border-teal-200/20 bg-teal-300/10 px-4 py-3 text-right">
            <p className="text-3xl font-black text-white">{regionProgress.progressPercent}%</p>
            <p className="text-sm text-teal-100">progression globale</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{regionProgress.region.description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MapStat label="Zones terminees" value={`${regionProgress.completedZoneCount} / ${regionProgress.zoneCount}`} />
          <MapStat label="Quiz valides" value={`${regionProgress.validatedQuizCount} / ${regionProgress.quizCount}`} />
          <MapStat label="Quiz parfaits" value={regionProgress.perfectQuizCount} />
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-2">
        {regionProgress.zones.map((zoneProgress, index) => (
          <ZoneCard
            key={zoneProgress.zone.id}
            zoneProgress={zoneProgress}
            index={index}
            onExploreZone={onExploreZone}
          />
        ))}
      </div>
    </section>
  );
}

function ZoneCard({
  zoneProgress,
  index,
  onExploreZone
}: {
  zoneProgress: ZoneProgress;
  index: number;
  onExploreZone: (zoneId: string) => void;
}) {
  return (
    <article className="guild-card relative overflow-hidden p-4 transition hover:-translate-y-0.5">
      <div className="absolute right-4 top-4 text-6xl font-black text-white/[0.04]">{index + 1}</div>
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">Zone</p>
            <h2 className="mt-1 text-xl font-black text-white">{zoneProgress.zone.name}</h2>
          </div>
          <StatusBadge status={zoneProgress.status} />
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-300">{zoneProgress.zone.description}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>{zoneProgress.validatedQuizCount} / {zoneProgress.quizCount} quiz valides</span>
            <span className="font-bold text-white">{zoneProgress.progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-950 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-200 to-amber-300 shadow-glow"
              style={{ width: `${zoneProgress.progressPercent}%` }}
            />
          </div>
        </div>
        <Button className="mt-5 w-full" onClick={() => onExploreZone(zoneProgress.zone.id)}>
          <Compass className="mr-2 size-4" aria-hidden="true" />
          Explorer
        </Button>
      </div>
    </article>
  );
}

function MapStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const className =
    status === "Termine"
      ? "bg-teal-300 text-slate-950"
      : status === "En cours"
        ? "bg-amber-300 text-slate-950"
        : "bg-slate-700 text-slate-100";

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-black ${className}`}>
      <Sparkles className="size-3" aria-hidden="true" />
      {status}
    </span>
  );
}
