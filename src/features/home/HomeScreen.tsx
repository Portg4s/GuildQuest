import { motion } from "framer-motion";
import { Gem, Shield, Sparkles, Star, UserRound, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Player } from "@/domain/models";

type HomeScreenProps = {
  player: Player;
  onGoToMissions: () => void;
  onGoToProfile: () => void;
};

export function HomeScreen({ player, onGoToMissions, onGoToProfile }: HomeScreenProps) {
  const xpProgress = Math.min((player.xp / player.nextLevelXp) * 100, 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="flex flex-1 flex-col justify-between gap-8"
    >
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg border border-teal-300/30 bg-teal-300/10 shadow-glow">
            <Shield className="size-6 text-teal-200" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Hall de guilde</p>
            <h1 className="text-3xl font-black text-white sm:text-5xl">GuildQuest</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-amber-100">
          <Gem className="size-4" aria-hidden="true" />
          <span className="text-sm font-bold">{player.gems}</span>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur sm:p-6">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-teal-300 px-2.5 py-1 text-xs font-black uppercase text-slate-950">
              {player.rank}
            </span>
            <span className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-slate-200">
              Niveau {player.level}
            </span>
          </div>
          <p className="text-lg text-slate-300">Bienvenue,</p>
          <h2 className="mt-1 text-5xl font-black leading-none text-white sm:text-7xl">{player.username}</h2>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>XP</span>
              <span className="font-bold text-white">
                {player.xp} / {player.nextLevelXp}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-900/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-300 to-amber-300"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-slate-900/80 p-5">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-indigo-300/15 text-indigo-100">
              <Star className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tableau de quetes</h3>
              <p className="text-sm text-slate-400">Choisis une activite et gagne tes recompenses.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button variant="guild" className="h-24 flex-col gap-2" onClick={onGoToMissions}>
              <ScrollText className="size-6" aria-hidden="true" />
              <span>Missions</span>
            </Button>
            <Button variant="guild" className="h-24 flex-col gap-2" onClick={onGoToProfile}>
              <UserRound className="size-6" aria-hidden="true" />
              <span>Profil</span>
            </Button>
          </div>
        </div>
      </section>

      <footer className="flex items-center justify-center gap-2 pb-2 text-xs font-semibold text-slate-400">
        <Sparkles className="size-4 text-teal-200" aria-hidden="true" />
        <span>Mode local pret pour les premieres quetes.</span>
      </footer>
    </motion.section>
  );
}
