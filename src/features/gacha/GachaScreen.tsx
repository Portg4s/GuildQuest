import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Gem, RotateCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCharacterCard } from "@/components/game/PremiumCharacterCard";
import { getBestRarity, rarityEffects } from "@/components/game/rarity-effects";
import { rarityBadgeClasses, rarityLabels } from "@/components/game/rarity-styles";
import { gachaCosts, gachaRates } from "@/data/config/gacha.config";
import type { Player } from "@/domain/models";
import type { GachaPullResult } from "@/domain/gacha/gacha.service";
import { GachaCinematic } from "@/features/gacha/GachaCinematic";
import { cn } from "@/lib/utils";

type AnimationSpeed = "normal" | "fast" | "reduced";

type GachaScreenProps = {
  player: Player;
  results: GachaPullResult[];
  isInvoking: boolean;
  error?: string;
  animationsEnabled: boolean;
  animationSpeed: AnimationSpeed;
  onInvoke: (count: 1 | 10) => void;
  onBackHome: () => void;
  onGoToCollection: () => void;
};

export function GachaScreen({
  player,
  results,
  isInvoking,
  error,
  animationsEnabled,
  animationSpeed,
  onInvoke,
  onBackHome,
  onGoToCollection
}: GachaScreenProps) {
  const [cinematicOpen, setCinematicOpen] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(results.length > 0);
  const presentedPullIdsRef = useRef("");
  const pullSignature = useMemo(() => results.map((result) => result.pull.id).join("|"), [results]);
  const summary = useMemo(() => buildInvocationSummary(results), [results]);
  const effect = summary.bestRarity ? rarityEffects[summary.bestRarity] : rarityEffects.RARE;

  useEffect(() => {
    if (!pullSignature || pullSignature === presentedPullIdsRef.current) return;

    presentedPullIdsRef.current = pullSignature;
    const timer = window.setTimeout(() => {
      if (animationsEnabled) {
        setSummaryVisible(false);
        setCinematicOpen(true);
      } else {
        setCinematicOpen(false);
        setSummaryVisible(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [animationsEnabled, pullSignature]);

  const handleInvoke = (count: 1 | 10) => {
    setSummaryVisible(false);
    setCinematicOpen(false);
    onInvoke(count);
  };

  const completeCinematic = () => {
    setCinematicOpen(false);
    setSummaryVisible(true);
  };

  return (
    <section className="space-y-3">
      <GachaCinematic
        results={results}
        open={cinematicOpen}
        animationSpeed={animationSpeed}
        onComplete={completeCinematic}
      />

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Autel des etoiles</p>
          <h1 className="guild-title text-2xl">Invocation</h1>
          <p className="mt-1 text-sm text-slate-300">Invoque des allies et complete ta collection.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="guild" onClick={onGoToCollection}>Collection</Button>
          <Button variant="guild" onClick={onBackHome}>
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Hall
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <ResourceCard icon={<Gem className="size-5" />} label="Gemmes" value={player.gems} tone="amber" />
        <ResourceCard icon={<Sparkles className="size-5" />} label="Poussiere" value={player.magicDust ?? 0} tone="teal" />
      </div>

      <article className="guild-panel magic-border relative isolate overflow-hidden p-4">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.14),transparent_30%)]" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-100">Banniere active</p>
            <h2 className="mt-1 text-lg font-black text-white">Serment des Fondations</h2>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Personnages placeholders generiques. Les assets prives locaux seront charges plus tard.
            </p>
          </div>
          <span className="rounded-md bg-teal-300 px-2 py-1 text-xs font-black text-slate-950">V1</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            className="h-14 flex-col gap-1"
            onClick={() => handleInvoke(1)}
            disabled={isInvoking || player.gems < gachaCosts.singlePullCost}
          >
            <span>Invocation x1</span>
            <span className="text-xs opacity-80">{gachaCosts.singlePullCost} gemmes</span>
          </Button>
          <Button
            className="h-14 flex-col gap-1 border border-amber-200/50 bg-gradient-to-r from-amber-300 to-yellow-200 text-slate-950 hover:from-amber-200 hover:to-yellow-100"
            onClick={() => handleInvoke(10)}
            disabled={isInvoking || player.gems < gachaCosts.tenPullCost}
          >
            <span>Invocation x10</span>
            <span className="text-xs opacity-80">{gachaCosts.tenPullCost} gemmes</span>
          </Button>
        </div>

        {player.gems < gachaCosts.singlePullCost && (
          <p className="mt-3 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-sm font-semibold text-amber-100">
            Gemmes insuffisantes pour invoquer. Termine des missions pour remplir la bourse de guilde.
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-lg border border-red-300/30 bg-red-400/10 p-3 text-sm font-semibold text-red-100">
            {error}
          </p>
        )}

        <details className="group mt-3 rounded-lg border border-white/10 bg-black/25 p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-black text-white">
            Taux de rarete
            <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
            {Object.entries(gachaRates).map(([rarity, rate]) => (
              <div key={rarity} className="rounded-md bg-white/[0.06] p-2">
                <span className={cn("rounded px-2 py-0.5 font-black", rarityBadgeClasses[rarity as keyof typeof gachaRates])}>
                  {rarityLabels[rarity as keyof typeof gachaRates]}
                </span>
                <p className="mt-1 font-black text-white">{rate}%</p>
              </div>
            ))}
          </div>
        </details>
      </article>

      {isInvoking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: animationsEnabled ? [0.96, 1.02, 1] : 1 }}
          className="rounded-lg border border-teal-300/30 bg-teal-300/10 p-4 text-center shadow-glow"
        >
          <Sparkles className="mx-auto size-7 text-teal-100" aria-hidden="true" />
          <p className="mt-2 text-base font-black text-white">Les runes s'alignent...</p>
        </motion.div>
      )}

      {summaryVisible && results.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("magic-border space-y-3 rounded-xl border p-3", effect.border, effect.backdrop)}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={cn("text-xs font-black uppercase tracking-[0.2em]", effect.text)}>Resultat d'invocation</p>
              <h2 className="text-xl font-black text-white">
                {summary.total} personnage{summary.total > 1 ? "s" : ""} obtenu{summary.total > 1 ? "s" : ""}
              </h2>
            </div>
            {summary.bestRarity && (
              <span className={cn("w-fit rounded-md px-2.5 py-1 text-xs font-black", rarityBadgeClasses[summary.bestRarity])}>
                Meilleure rarete : {rarityLabels[summary.bestRarity]}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <SummaryStat label="Nouveaux" value={summary.newCount} />
            <SummaryStat label="Doublons" value={summary.duplicateCount} />
            <SummaryStat label="Fragments" value={`+${summary.fragments}`} />
            <SummaryStat label="Poussiere" value={`+${summary.magicDust}`} />
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
            {results.map((result, index) => (
              <PremiumCharacterCard
                key={result.pull.id}
                result={result}
                index={index}
                compact
                animate={animationsEnabled && animationSpeed !== "reduced"}
              />
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            <Button variant="guild" onClick={onGoToCollection}>Collection</Button>
            <Button
              onClick={() => handleInvoke(1)}
              disabled={isInvoking || player.gems < gachaCosts.singlePullCost}
            >
              <RotateCw className="mr-2 size-4" aria-hidden="true" />
              Refaire x1
            </Button>
            <Button
              onClick={() => handleInvoke(10)}
              disabled={isInvoking || player.gems < gachaCosts.tenPullCost}
            >
              <RotateCw className="mr-2 size-4" aria-hidden="true" />
              Refaire x10
            </Button>
            <Button variant="guild" onClick={onBackHome}>Hall</Button>
          </div>
        </motion.section>
      )}
    </section>
  );
}

function ResourceCard({ icon, label, value, tone }: { icon: ReactNode; label: string; value: number; tone: "amber" | "teal" }) {
  return (
    <div className={cn("rounded-lg border p-3 backdrop-blur", tone === "amber" ? "border-amber-200/25 bg-amber-300/10 shadow-[0_0_24px_rgba(250,204,21,0.12)]" : "border-teal-200/25 bg-teal-300/10 shadow-[0_0_24px_rgba(45,212,191,0.12)]")}>
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        <p className="text-sm">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-2">
      <p className="text-xs font-semibold text-slate-300">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function buildInvocationSummary(results: GachaPullResult[]) {
  const bestRarity = results.length ? getBestRarity(results.map((result) => result.character.rarity)) : undefined;

  return {
    total: results.length,
    newCount: results.filter((result) => result.isNew).length,
    duplicateCount: results.filter((result) => !result.isNew).length,
    fragments: results.reduce((total, result) => total + result.fragmentsGained, 0),
    magicDust: results.reduce((total, result) => total + result.magicDustGained, 0),
    bestRarity
  };
}
