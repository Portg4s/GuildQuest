import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CharacterImage } from "@/components/game/CharacterImage";
import { rarityBadgeClasses, rarityCardClasses, rarityGlowClasses, rarityLabels } from "@/components/game/rarity-styles";
import { rarityEffects } from "@/components/game/rarity-effects";
import type { GachaPullResult } from "@/domain/gacha/gacha.service";
import { cn } from "@/lib/utils";

type PremiumCharacterCardProps = {
  result: GachaPullResult;
  index?: number;
  compact?: boolean;
  animate?: boolean;
};

export function PremiumCharacterCard({
  result,
  index = 0,
  compact = false,
  animate = true
}: PremiumCharacterCardProps) {
  const effect = rarityEffects[result.character.rarity];
  const content = (
    <article
      className={cn(
        "relative isolate overflow-hidden rounded-xl border p-3 text-center",
        rarityCardClasses[result.character.rarity],
        rarityGlowClasses[result.character.rarity],
        effect.border,
        compact ? "min-h-48" : "min-h-72 p-4"
      )}
    >
      <div className={cn("absolute inset-0 -z-10 bg-gradient-to-br opacity-80", effect.aura)} />
      <div className="absolute -right-8 -top-10 -z-10 size-28 rounded-full bg-white/10 blur-2xl" />
      <div className="flex items-start justify-between gap-2">
        <span className={cn("rounded-md px-2.5 py-1 text-[0.68rem] font-black", rarityBadgeClasses[result.character.rarity])}>
          {rarityLabels[result.character.rarity]}
        </span>
        <span
          className={cn(
            "rounded-md px-2 py-1 text-[0.68rem] font-black",
            result.isNew ? "bg-teal-300 text-slate-950" : "bg-white/10 text-white"
          )}
        >
          {result.isNew ? "Nouveau !" : "Doublon"}
        </span>
      </div>

      <div className={cn("mx-auto mt-3 grid place-items-center rounded-xl border border-white/10 bg-black/20 ring-2", effect.ring, compact ? "size-24" : "size-36")}>
        <CharacterImage
          character={result.character}
          className={cn("rounded-lg object-contain p-2", compact ? "size-20" : "size-28")}
        />
      </div>

      <h2 className={cn("mt-3 font-black text-white", compact ? "line-clamp-1 text-sm" : "text-xl")}>
        {result.character.name}
      </h2>
      <p className={cn("mt-1 font-semibold opacity-90", compact ? "text-xs" : "text-sm")}>
        {result.character.element} - Puissance {result.character.power}
      </p>

      {!result.isNew && (
        <div className="mt-3 rounded-lg border border-white/10 bg-black/25 p-2 text-xs font-bold text-white">
          +{result.fragmentsGained} fragments
          <span className="mx-1 text-white/45">-</span>
          +{result.magicDustGained} poussiere
        </div>
      )}

      {!compact && (
        <div className={cn("mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black", effect.backdrop, effect.text)}>
          <Sparkles className="size-3.5" aria-hidden="true" />
          {effect.intensityLabel}
        </div>
      )}
    </article>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotateY: -18, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.42, type: "spring", bounce: 0.24 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {content}
    </motion.div>
  );
}
