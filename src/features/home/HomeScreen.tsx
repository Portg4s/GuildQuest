import { motion } from "framer-motion";
import { CalendarDays, Crown, Gem, Map, Medal, Settings, Shield, Sparkles, UserRound, ScrollText, Trophy, Swords, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterImage } from "@/components/game/CharacterImage";
import { CompactProgressCard } from "@/components/game/CompactProgressCard";
import { QuickActionGrid, type QuickAction } from "@/components/game/QuickActionGrid";
import { rarityBadgeClasses, rarityLabels } from "@/components/game/rarity-styles";
import { StatPill } from "@/components/game/StatPill";
import type { Character, DailyProgress, Player, PlayerTitle, StreakState } from "@/domain/models";
import type { RegionProgress } from "@/domain/progression/learning-progress.service";
import { cn } from "@/lib/utils";

type HomeScreenProps = {
  player: Player;
  activeTitle?: PlayerTitle;
  activeCharacter?: Character;
  regionProgress: RegionProgress;
  dailyProgress: DailyProgress;
  streak: StreakState;
  onGoToMissions: () => void;
  onGoToMap: () => void;
  onGoToProfile: () => void;
  onGoToGacha: () => void;
  onGoToCollection: () => void;
  onGoToBadges: () => void;
  onGoToSettings: () => void;
  onGoToDuel: () => void;
  onGoToDaily: () => void;
  onGoToShop: () => void;
};

export function HomeScreen({
  player,
  activeTitle,
  activeCharacter,
  regionProgress,
  dailyProgress,
  streak,
  onGoToMissions,
  onGoToMap,
  onGoToProfile,
  onGoToGacha,
  onGoToCollection,
  onGoToBadges,
  onGoToSettings,
  onGoToDuel,
  onGoToDaily,
  onGoToShop
}: HomeScreenProps) {
  const xpProgress = Math.min((player.xp / player.nextLevelXp) * 100, 100);
  const quickActions: QuickAction[] = [
    { id: "missions", label: "Missions", icon: <ScrollText className="size-5" />, onClick: onGoToMissions },
    { id: "map", label: "Carte", icon: <Map className="size-5" />, onClick: onGoToMap },
    { id: "gacha", label: "Invocation", icon: <Sparkles className="size-5" />, onClick: onGoToGacha },
    { id: "duel", label: "Duel", icon: <Swords className="size-5" />, onClick: onGoToDuel },
    { id: "daily", label: "Quetes", icon: <CalendarDays className="size-5" />, onClick: onGoToDaily },
    { id: "shop", label: "Boutique", icon: <Store className="size-5" />, onClick: onGoToShop },
    { id: "collection", label: "Collection", icon: <Trophy className="size-5" />, onClick: onGoToCollection },
    { id: "badges", label: "Badges", icon: <Medal className="size-5" />, onClick: onGoToBadges },
    { id: "profile", label: "Profil", icon: <UserRound className="size-5" />, onClick: onGoToProfile },
    { id: "settings", label: "Parametres", icon: <Settings className="size-5" />, onClick: onGoToSettings }
  ];
  const mainDailyQuest = dailyProgress.quests.find((quest) => !quest.claimed) ?? dailyProgress.quests[0];
  const readyToClaim = dailyProgress.quests.filter((quest) => quest.completed && !quest.claimed).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="flex flex-1 flex-col gap-3 pb-3"
    >
      <header className="sticky top-0 z-10 -mx-4 flex items-center justify-between gap-3 border-b border-teal-200/15 bg-slate-950/80 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.24)] backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="magic-border rune-mark grid size-10 shrink-0 place-items-center rounded-xl border border-teal-300/30 bg-teal-300/10 shadow-glow">
            <Shield className="size-5 text-teal-200" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-teal-200">Hall</p>
            <h1 className="guild-title truncate text-2xl">GuildQuest</h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatPill icon={<Gem className="size-4" />} label="Gemmes" value={player.gems} tone="gold" />
          <button
            type="button"
            onClick={onGoToSettings}
            className="guild-button-secondary grid size-10 place-items-center rounded-lg text-slate-200"
            aria-label="Parametres"
          >
            <Settings className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <section className="guild-panel magic-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-slate-300">Bienvenue,</p>
            <h2 className="guild-title truncate text-4xl leading-none">{player.username}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-gradient-to-r from-teal-300 to-cyan-200 px-2.5 py-1 text-[0.68rem] font-black uppercase text-slate-950 shadow-glow">
                {player.rank}
              </span>
              {activeTitle && (
                <span className="rounded-md border border-amber-200/30 bg-amber-300/10 px-2.5 py-1 text-[0.68rem] font-semibold text-amber-100">
                  {activeTitle.label}
                </span>
              )}
            </div>
          </div>
          <StatPill label="Niveau" value={player.level} tone="teal" className="shrink-0" />
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>XP</span>
              <span className="font-bold text-white">
                {player.xp} / {player.nextLevelXp}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-950 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-200 to-amber-300 shadow-glow"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
          <Crown className="size-5 text-amber-100" aria-hidden="true" />
        </div>
      </section>

      <QuickActionGrid actions={quickActions} />

      <section className="guild-card border-amber-200/25 bg-amber-300/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-100">Dashboard quotidien</p>
            <h3 className="text-lg font-black text-white">Streak {streak.current} jour{streak.current > 1 ? "s" : ""}</h3>
            <p className="mt-1 text-xs text-slate-300">
              Objectif actif : {mainDailyQuest?.value ?? 0}/{mainDailyQuest?.target ?? 1}
              {readyToClaim > 0 ? ` - ${readyToClaim} recompense(s) a reclamer` : ""}
            </p>
          </div>
          <Button size="sm" onClick={onGoToDaily}>
            Quetes
          </Button>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
        <CompactProgressCard
          title="Fondations Web"
          regionName={regionProgress.region.name}
          progressPercent={regionProgress.progressPercent}
          validatedQuizCount={regionProgress.validatedQuizCount}
          quizCount={regionProgress.quizCount}
          onOpenMap={onGoToMap}
        />

        <section className="guild-card p-3">
          <div className="flex items-center gap-3">
            <CharacterImage
              character={activeCharacter}
              className="h-20 w-16 shrink-0 rounded-xl border border-white/10 bg-white/10"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-200">Personnage actif</p>
              {activeCharacter ? (
                <>
                  <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                    <h3 className="truncate text-lg font-black text-white">{activeCharacter.name}</h3>
                    <span className={cn("rounded-md px-2 py-0.5 text-[0.65rem] font-black", rarityBadgeClasses[activeCharacter.rarity])}>
                      {rarityLabels[activeCharacter.rarity]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    {activeCharacter.element} - Puissance {activeCharacter.power}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="mt-1 text-lg font-black text-white">Aucun personnage actif</h3>
                  <p className="mt-1 text-xs text-slate-300">Invoque ou choisis un allie.</p>
                </>
              )}
            </div>
            <Button size="sm" variant="guild" className="h-8 px-3" onClick={activeCharacter ? onGoToCollection : onGoToGacha}>
              {activeCharacter ? "Voir" : "Invoquer"}
            </Button>
          </div>
        </section>
      </div>

      <footer className="flex items-center justify-center gap-2 pt-1 text-xs font-semibold text-slate-400">
        <Sparkles className="size-4 text-teal-200" aria-hidden="true" />
        <span>Hub local pret pour la prochaine quete.</span>
      </footer>
    </motion.section>
  );
}
