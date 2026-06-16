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
    intensityLabel: "Rune stable"
  },
  RARE: {
    aura: "from-sky-300/30 via-cyan-400/10 to-slate-950",
    backdrop: "bg-sky-300/10",
    border: "border-sky-200/40",
    flash: "bg-sky-200/45",
    particle: "bg-cyan-200/75",
    text: "text-sky-100",
    ring: "ring-sky-200/35",
    intensityLabel: "Echo rare"
  },
  EPIC: {
    aura: "from-violet-300/35 via-fuchsia-400/15 to-slate-950",
    backdrop: "bg-violet-300/10",
    border: "border-violet-200/50",
    flash: "bg-violet-200/55",
    particle: "bg-fuchsia-200/80",
    text: "text-violet-100",
    ring: "ring-violet-200/45",
    intensityLabel: "Convergence epique"
  },
  LEGENDARY: {
    aura: "from-amber-300/45 via-orange-400/20 to-slate-950",
    backdrop: "bg-amber-300/15",
    border: "border-amber-200/60",
    flash: "bg-amber-100/65",
    particle: "bg-amber-100/90",
    text: "text-amber-100",
    ring: "ring-amber-200/55",
    intensityLabel: "Impact legendaire"
  },
  MYTHIC: {
    aura: "from-rose-300/45 via-fuchsia-400/20 to-slate-950",
    backdrop: "bg-rose-300/15",
    border: "border-rose-200/70",
    flash: "bg-rose-100/70",
    particle: "bg-rose-100/95",
    text: "text-rose-100",
    ring: "ring-rose-200/65",
    intensityLabel: "Aura mythique"
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
