import { motion } from "framer-motion";
import { ArrowLeft, Gem, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rarityBadgeClasses, rarityCardClasses, rarityGlowClasses, rarityLabels } from "@/components/game/rarity-styles";
import { gachaCosts } from "@/data/config/gacha.config";
import type { Player } from "@/domain/models";
import type { GachaPullResult } from "@/domain/gacha/gacha.service";
import { cn } from "@/lib/utils";

type GachaScreenProps = {
  player: Player;
  results: GachaPullResult[];
  isInvoking: boolean;
  error?: string;
  onInvoke: (count: 1 | 10) => void;
  onBackHome: () => void;
  onGoToCollection: () => void;
};

export function GachaScreen({
  player,
  results,
  isInvoking,
  error,
  onInvoke,
  onBackHome,
  onGoToCollection
}: GachaScreenProps) {
  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Autel des etoiles</p>
          <h1 className="text-3xl font-black text-white">Invocation</h1>
          <p className="mt-2 text-sm text-slate-300">Invoque des allies de guilde et complete ta collection.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="guild" onClick={onGoToCollection}>Collection</Button>
          <Button variant="guild" onClick={onBackHome}>
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Hall
          </Button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <ResourceCard icon={<Gem className="size-5" />} label="Gemmes" value={player.gems} />
        <ResourceCard icon={<Sparkles className="size-5" />} label="Poussiere magique" value={player.magicDust ?? 0} />
      </div>

      <article className="rounded-lg border border-white/10 bg-slate-900/90 p-5 shadow-2xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            className="h-20 flex-col gap-1"
            onClick={() => onInvoke(1)}
            disabled={isInvoking || player.gems < gachaCosts.singlePullCost}
          >
            <span>Invocation x1</span>
            <span className="text-xs opacity-80">{gachaCosts.singlePullCost} gemmes</span>
          </Button>
          <Button
            className="h-20 flex-col gap-1"
            onClick={() => onInvoke(10)}
            disabled={isInvoking || player.gems < gachaCosts.tenPullCost}
          >
            <span>Invocation x10</span>
            <span className="text-xs opacity-80">{gachaCosts.tenPullCost} gemmes</span>
          </Button>
        </div>
        {player.gems < gachaCosts.singlePullCost && (
          <p className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-sm font-semibold text-amber-100">
            Gemmes insuffisantes pour invoquer. Termine des missions pour remplir la bourse de guilde.
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-red-300/30 bg-red-400/10 p-3 text-sm font-semibold text-red-100">
            {error}
          </p>
        )}
      </article>

      {isInvoking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: [0.95, 1.04, 1] }}
          className="rounded-lg border border-teal-300/30 bg-teal-300/10 p-8 text-center shadow-glow"
        >
          <Sparkles className="mx-auto size-10 text-teal-100" aria-hidden="true" />
          <p className="mt-3 text-lg font-black text-white">Les runes s'alignent...</p>
        </motion.div>
      )}

      {results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result, index) => (
            <motion.article
              key={result.pull.id}
              initial={{ opacity: 0, y: 24, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className={cn(
                "rounded-lg border p-4",
                rarityCardClasses[result.character.rarity],
                rarityGlowClasses[result.character.rarity]
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={cn("rounded-md px-2.5 py-1 text-xs font-black", rarityBadgeClasses[result.character.rarity])}>
                  {rarityLabels[result.character.rarity]}
                </span>
                <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-bold">
                  {result.isNew ? "Nouveau !" : "Doublon"}
                </span>
              </div>
              <img
                src={result.character.placeholderImage}
                alt=""
                className="mx-auto mt-4 size-24 rounded-lg border border-white/10 bg-white/10 p-3"
              />
              <h2 className="mt-4 text-xl font-black text-white">{result.character.name}</h2>
              <p className="mt-1 text-sm opacity-85">{result.character.element} · Puissance {result.character.power}</p>
              {!result.isNew && (
                <div className="mt-3 rounded-lg bg-black/20 p-3 text-sm font-bold">
                  +{result.fragmentsGained} fragments · +{result.magicDustGained} poussiere
                </div>
              )}
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}

function ResourceCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4">
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        <p className="text-sm">{label}</p>
      </div>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}
