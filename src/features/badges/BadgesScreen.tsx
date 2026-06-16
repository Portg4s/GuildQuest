import { ArrowLeft, Check, Crown, Lock, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { badgeDefinitions } from "@/data/config/badges.config";
import { titleDefinitions } from "@/data/config/titles.config";
import type { Badge, PlayerTitle } from "@/domain/models";
import { cn } from "@/lib/utils";

type BadgesScreenProps = {
  unlockedBadges: Badge[];
  unlockedTitles: PlayerTitle[];
  activeTitleId?: string;
  onSetActiveTitle: (titleId: string) => void;
  onBackHome: () => void;
};

export function BadgesScreen({
  unlockedBadges,
  unlockedTitles,
  activeTitleId,
  onSetActiveTitle,
  onBackHome
}: BadgesScreenProps) {
  const unlockedBadgeIds = new Set(unlockedBadges.map((badge) => badge.id));
  const unlockedTitleIds = new Set(unlockedTitles.map((title) => title.id));

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Exploits de guilde</p>
          <h1 className="text-3xl font-black text-white">Badges & Titres</h1>
          <p className="mt-2 text-sm text-slate-300">
            {unlockedBadges.length} badges - {unlockedTitles.length} titres debloques
          </p>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Hall
        </Button>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-black text-white">Badges</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badgeDefinitions.map((badge) => {
            const unlocked = unlockedBadgeIds.has(badge.id);

            return (
              <article
                key={badge.id}
                className={cn(
                  "rounded-lg border p-4",
                  unlocked ? "border-teal-200/30 bg-teal-300/10" : "border-white/10 bg-slate-900/70 text-slate-500"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <Medal className={cn("size-6", unlocked ? "text-amber-200" : "text-slate-600")} aria-hidden="true" />
                  {unlocked ? <Check className="size-5 text-teal-100" aria-hidden="true" /> : <Lock className="size-5" aria-hidden="true" />}
                </div>
                <h3 className="mt-3 text-lg font-black text-white">{badge.name}</h3>
                <p className="mt-1 text-sm leading-6">{badge.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black text-white">Titres</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {titleDefinitions.map((title) => {
            const unlocked = unlockedTitleIds.has(title.id);
            const active = activeTitleId === title.id;

            return (
              <article
                key={title.id}
                className={cn(
                  "rounded-lg border p-4",
                  unlocked ? "border-amber-200/30 bg-amber-300/10" : "border-white/10 bg-slate-900/70 text-slate-500"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <Crown className={cn("size-6", unlocked ? "text-amber-200" : "text-slate-600")} aria-hidden="true" />
                  {active && <span className="rounded-md bg-teal-300 px-2 py-1 text-xs font-black text-slate-950">Actif</span>}
                </div>
                <h3 className="mt-3 text-lg font-black text-white">{title.label}</h3>
                <p className="mt-1 text-sm leading-6">{title.description}</p>
                {unlocked && (
                  <Button className="mt-4 w-full" variant={active ? "secondary" : "guild"} disabled={active} onClick={() => onSetActiveTitle(title.id)}>
                    {active ? "Titre actif" : "Definir actif"}
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
