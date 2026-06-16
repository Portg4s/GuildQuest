import { useMemo, useState } from "react";
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

type BadgeTab = "badges" | "titles";
type BadgeFilter = "all" | "unlocked" | "locked";

const badgeFilters: { id: BadgeFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "unlocked", label: "Obtenus" },
  { id: "locked", label: "Verrouilles" }
];

export function BadgesScreen({
  unlockedBadges,
  unlockedTitles,
  activeTitleId,
  onSetActiveTitle,
  onBackHome
}: BadgesScreenProps) {
  const [activeTab, setActiveTab] = useState<BadgeTab>("badges");
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>("all");
  const unlockedBadgeIds = useMemo(() => new Set(unlockedBadges.map((badge) => badge.id)), [unlockedBadges]);
  const unlockedTitleIds = useMemo(() => new Set(unlockedTitles.map((title) => title.id)), [unlockedTitles]);
  const activeTitle = titleDefinitions.find((title) => title.id === activeTitleId);
  const filteredBadges = useMemo(
    () =>
      badgeDefinitions.filter((badge) => {
        const unlocked = unlockedBadgeIds.has(badge.id);

        return (
          badgeFilter === "all" ||
          (badgeFilter === "unlocked" && unlocked) ||
          (badgeFilter === "locked" && !unlocked)
        );
      }),
    [badgeFilter, unlockedBadgeIds]
  );

  return (
    <section className="space-y-3">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Exploits de guilde</p>
          <h1 className="guild-title text-2xl">Badges & Titres</h1>
          <p className="mt-1 text-sm text-slate-300">
            {unlockedBadges.length} badges - {unlockedTitles.length} titres debloques
          </p>
        </div>
        <Button className="h-9" variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Hall
        </Button>
      </header>

      <div className="guild-panel p-2.5">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("badges")}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-black transition active:scale-[0.98]",
              activeTab === "badges"
                ? "border-teal-200 bg-teal-300 text-slate-950"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-teal-200/50"
            )}
          >
            Badges
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("titles")}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-black transition active:scale-[0.98]",
              activeTab === "titles"
                ? "border-amber-200 bg-amber-300 text-slate-950"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-amber-200/50"
            )}
          >
            Titres
          </button>
        </div>
        {activeTab === "titles" && (
          <p className="mt-2 rounded-md bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100">
            Titre actif : {activeTitle?.label ?? "Aucun titre actif"}
          </p>
        )}
      </div>

      {activeTab === "badges" && (
        <section className="space-y-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {badgeFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setBadgeFilter(filter.id)}
                className={cn(
                  "shrink-0 rounded-md border px-3 py-1.5 text-xs font-black transition active:scale-[0.98]",
                  badgeFilter === filter.id
                    ? "border-teal-200 bg-teal-300 text-slate-950"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-teal-200/50"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
            {filteredBadges.map((badge) => {
              const unlocked = unlockedBadgeIds.has(badge.id);

              return (
                <article
                  key={badge.id}
                  className={cn(
                    "min-h-32 rounded-xl border p-3 transition hover:-translate-y-0.5",
                    unlocked ? "magic-border border-teal-200/30 bg-teal-300/10" : "border-white/10 bg-slate-900/70 text-slate-500"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Medal className={cn("size-5", unlocked ? "text-amber-200" : "text-slate-600")} aria-hidden="true" />
                    {unlocked ? <Check className="size-4 text-teal-100" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-sm font-black text-white">{badge.name}</h3>
                  <p className="mt-1 line-clamp-3 text-xs leading-5">{badge.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "titles" && (
        <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {titleDefinitions.map((title) => {
            const unlocked = unlockedTitleIds.has(title.id);
            const active = activeTitleId === title.id;

            return (
              <article
                key={title.id}
                className={cn(
                  "rounded-xl border p-3 transition hover:-translate-y-0.5",
                  unlocked ? "magic-border border-amber-200/30 bg-amber-300/10" : "border-white/10 bg-slate-900/70 text-slate-500"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <Crown className={cn("size-5", unlocked ? "text-amber-200" : "text-slate-600")} aria-hidden="true" />
                  {active && <span className="rounded-md bg-teal-300 px-2 py-1 text-xs font-black text-slate-950">Actif</span>}
                </div>
                <h3 className="mt-2 text-base font-black text-white">{title.label}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5">{title.description}</p>
                {unlocked && (
                  <Button className="mt-3 h-8 w-full text-sm" variant={active ? "secondary" : "guild"} disabled={active} onClick={() => onSetActiveTitle(title.id)}>
                    {active ? "Titre actif" : "Definir actif"}
                  </Button>
                )}
              </article>
            );
          })}
        </section>
      )}
    </section>
  );
}
