import type { CharacterRarity } from "@/domain/models";

export type RarityEffect = {
  aura: string;
  backdrop: string;
  border: string;
  flash: string;
  particle: string;
  text: string;
  ring: string;
  intensityLabel: string;
};

export const rarityEffects: Record<CharacterRarity, RarityEffect> = {
  COMMON: {
    aura: "from-slate-300/20 via-slate-400/10 to-slate-950",
    backdrop: "bg-slate-300/10",
    border: "border-slate-200/30",
    flash: "bg-slate-100/35",
    particle: "bg-slate-200/60",
    text: "text-slate-100",
    ring: "ring-slate-200/25",
    intensityLabel: "Marque de guilde"
  },
  RARE: {
    aura: "from-cyan-300/35 via-sky-400/14 to-slate-950",
    backdrop: "bg-sky-300/10",
    border: "border-sky-200/40",
    flash: "bg-sky-200/45",
    particle: "bg-cyan-200/75",
    text: "text-sky-100",
    ring: "ring-sky-200/35",
    intensityLabel: "Aile celeste"
  },
  EPIC: {
    aura: "from-violet-300/35 via-red-400/12 to-slate-950",
    backdrop: "bg-violet-300/10",
    border: "border-violet-200/50",
    flash: "bg-violet-200/55",
    particle: "bg-fuchsia-200/80",
    text: "text-violet-100",
    ring: "ring-violet-200/45",
    intensityLabel: "Sort epique"
  },
  LEGENDARY: {
    aura: "from-amber-200/55 via-orange-500/28 to-red-950",
    backdrop: "bg-amber-300/15",
    border: "border-amber-200/60",
    flash: "bg-amber-100/65",
    particle: "bg-amber-100/90",
    text: "text-amber-100",
    ring: "ring-amber-200/55",
    intensityLabel: "Flamme legendaire"
  },
  MYTHIC: {
    aura: "from-red-300/55 via-amber-300/26 to-cyan-950",
    backdrop: "bg-red-300/15",
    border: "border-red-200/75",
    flash: "bg-amber-100/75",
    particle: "bg-amber-100/95",
    text: "text-red-100",
    ring: "ring-amber-200/70",
    intensityLabel: "Dragon mythique"
  }
};

export const rarityRevealOrder: CharacterRarity[] = ["COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];

export function getBestRarity(rarities: CharacterRarity[]) {
  return rarities.reduce<CharacterRarity>(
    (best, rarity) =>
      rarityRevealOrder.indexOf(rarity) > rarityRevealOrder.indexOf(best) ? rarity : best,
    "COMMON"
  );
}
