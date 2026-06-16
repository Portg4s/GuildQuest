import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";

type CompactProgressCardProps = {
  title: string;
  regionName: string;
  progressPercent: number;
  validatedQuizCount: number;
  quizCount: number;
  onOpenMap: () => void;
};

export function CompactProgressCard({
  title,
  regionName,
  progressPercent,
  validatedQuizCount,
  quizCount,
  onOpenMap
}: CompactProgressCardProps) {
  return (
    <section className="guild-card magic-border p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-200">Tableau de quete</p>
          <h3 className="guild-title truncate text-lg">{title}</h3>
          <p className="truncate text-xs text-slate-300">
            {regionName} - {validatedQuizCount} / {quizCount} quiz
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-3xl font-black leading-none text-white">{progressPercent}%</p>
          <Button size="sm" className="mt-2 h-8 px-3" onClick={onOpenMap}>
            <Map className="mr-1.5 size-3.5" aria-hidden="true" />
            Carte
          </Button>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-200 to-amber-300 shadow-glow"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
}
