import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCharacterCard } from "@/components/game/PremiumCharacterCard";
import { getBestRarity, rarityEffects } from "@/components/game/rarity-effects";
import { rarityLabels } from "@/components/game/rarity-styles";
import type { GachaPullResult } from "@/domain/gacha/gacha.service";
import type { CharacterRarity } from "@/domain/models";
import { cn } from "@/lib/utils";

type AnimationSpeed = "normal" | "fast" | "reduced";

type GachaCinematicProps = {
  results: GachaPullResult[];
  open: boolean;
  animationSpeed: AnimationSpeed;
  onComplete: () => void;
};

const phaseCopy = [
  "Les runes s'eveillent...",
  "Le cercle choisit son aura...",
  "La porte de guilde s'ouvre..."
];

export function GachaCinematic({ results, open, animationSpeed, onComplete }: GachaCinematicProps) {
  const [phase, setPhase] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const bestRarity = useMemo(
    () => getBestRarity(results.map((result) => result.character.rarity)),
    [results]
  );
  const effect = rarityEffects[bestRarity];
  const isTenPull = results.length > 1;
  const reduced = animationSpeed === "reduced";
  const delay = animationSpeed === "fast" ? 420 : reduced ? 520 : 850;

  useEffect(() => {
    if (!open) return;

    const timers = [
      window.setTimeout(() => {
        setPhase(0);
        setRevealed(false);
      }, 0),
      window.setTimeout(() => setPhase(1), delay),
      window.setTimeout(() => setPhase(2), delay * 2),
      window.setTimeout(() => setRevealed(true), delay * 3)
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [delay, open, results]);

  if (!open || results.length === 0) return null;

  const finish = () => {
    setRevealed(true);
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-white"
        role="dialog"
        aria-modal="true"
        aria-label="Cinematique d'invocation"
      >
        <div className={cn("fixed inset-0 bg-gradient-to-br", effect.aura)} />
        {!reduced && <ArcaneParticles rarity={bestRarity} />}
        <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className={cn("text-xs font-black uppercase tracking-[0.24em]", effect.text)}>
                Invocation {isTenPull ? "x10" : "x1"}
              </p>
              <h1 className="text-xl font-black sm:text-2xl">Autel des etoiles</h1>
            </div>
            <Button variant="secondary" className="h-9" onClick={finish} aria-label="Passer la cinematique">
              <X className="mr-2 size-4" aria-hidden="true" />
              Passer
            </Button>
          </div>

          <div className="grid flex-1 place-items-center py-5">
            {!revealed ? (
              <motion.div
                key={phase}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: reduced ? 1 : [0.96, 1.04, 1] }}
                transition={{ duration: reduced ? 0.25 : 0.6 }}
                className="w-full max-w-md text-center"
              >
                <div className={cn("mx-auto grid size-52 place-items-center rounded-full border bg-black/25", effect.border, effect.ring, "ring-4")}>
                  <motion.div
                    animate={reduced ? undefined : { rotate: 360, scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: animationSpeed === "fast" ? 2 : 3.2, ease: "linear" }}
                    className={cn("grid size-36 place-items-center rounded-full border-2", effect.border, effect.backdrop)}
                  >
                    <Sparkles className={cn("size-12", effect.text)} aria-hidden="true" />
                  </motion.div>
                </div>
                <p className="mt-6 text-lg font-black text-white">{phaseCopy[phase]}</p>
                <p className={cn("mt-2 text-sm font-bold", effect.text)}>
                  Meilleure aura detectee : {rarityLabels[bestRarity]}
                </p>
                <div className="mx-auto mt-5 h-2 w-48 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={cn("h-full rounded-full", effect.flash)}
                    initial={{ width: "8%" }}
                    animate={{ width: `${Math.min(100, (phase + 1) * 34)}%` }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="mb-4 text-center">
                  <p className={cn("text-xs font-black uppercase tracking-[0.24em]", effect.text)}>
                    Revelation {rarityLabels[bestRarity]}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">{isTenPull ? "Dix cartes revelees" : "Allie invoque"}</h2>
                </div>

                <div className={cn(isTenPull ? "grid grid-cols-2 gap-2.5 sm:grid-cols-5" : "mx-auto max-w-sm")}>
                  {results.map((result, index) => (
                    <PremiumCharacterCard
                      key={result.pull.id}
                      result={result}
                      index={index}
                      compact={isTenPull}
                      animate={!reduced}
                    />
                  ))}
                </div>

                {isTenPull && (
                  <p className="mt-4 text-center text-sm font-semibold text-slate-200">
                    Meilleure rarete du tirage : <span className={effect.text}>{rarityLabels[bestRarity]}</span>
                  </p>
                )}
              </motion.div>
            )}
          </div>

          <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
            {revealed ? (
              <Button className="h-11 w-full" onClick={onComplete}>
                Continuer
              </Button>
            ) : (
              <Button variant="guild" className="h-11 w-full" onClick={() => setRevealed(true)}>
                Reveler maintenant
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ArcaneParticles({ rarity }: { rarity: CharacterRarity }) {
  const effect = rarityEffects[rarity];
  const particles = Array.from({ length: rarity === "MYTHIC" ? 22 : rarity === "LEGENDARY" ? 18 : 13 });

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {particles.map((_, index) => (
        <motion.span
          key={index}
          className={cn("absolute size-1.5 rounded-full", effect.particle)}
          initial={{
            opacity: 0,
            x: `${(index * 37) % 100}vw`,
            y: "105vh",
            scale: 0.6
          }}
          animate={{
            opacity: [0, 1, 0],
            y: "-10vh",
            scale: [0.6, 1.4, 0.8]
          }}
          transition={{
            repeat: Infinity,
            duration: 3.2 + (index % 5) * 0.35,
            delay: index * 0.12,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}
