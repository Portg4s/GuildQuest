import type { CharacterRarity } from "@/domain/models";

export const rarityLabels: Record<CharacterRarity, string> = {
  COMMON: "Commun",
  RARE: "Rare",
  EPIC: "Epique",
  LEGENDARY: "Legendaire",
  MYTHIC: "Mythique"
};

export const rarityCardClasses: Record<CharacterRarity, string> = {
  COMMON: "border-slate-300/25 bg-slate-300/10 text-slate-100",
  RARE: "border-sky-300/35 bg-sky-300/10 text-sky-100",
  EPIC: "border-violet-300/40 bg-violet-300/10 text-violet-100",
  LEGENDARY: "border-amber-300/45 bg-amber-300/10 text-amber-100",
  MYTHIC: "border-rose-300/45 bg-rose-300/10 text-rose-100"
};

export const rarityBadgeClasses: Record<CharacterRarity, string> = {
  COMMON: "bg-slate-200 text-slate-950",
  RARE: "bg-sky-300 text-slate-950",
  EPIC: "bg-violet-300 text-slate-950",
  LEGENDARY: "bg-amber-300 text-slate-950",
  MYTHIC: "bg-rose-300 text-slate-950"
};

export const rarityGlowClasses: Record<CharacterRarity, string> = {
  COMMON: "shadow-[0_0_34px_rgba(203,213,225,0.16)]",
  RARE: "shadow-[0_0_34px_rgba(125,211,252,0.22)]",
  EPIC: "shadow-[0_0_34px_rgba(196,181,253,0.28)]",
  LEGENDARY: "shadow-[0_0_34px_rgba(252,211,77,0.32)]",
  MYTHIC: "shadow-[0_0_42px_rgba(251,113,133,0.34)]"
};
