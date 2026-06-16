import type { ShopItem } from "@/domain/models";

export const shopItems: ShopItem[] = [
  {
    id: "magic-dust-small",
    name: "Sachet de poussiere",
    description: "Convertis des gemmes en poussiere magique pour les futurs upgrades.",
    costGems: 100,
    reward: { magicDust: 50 }
  },
  {
    id: "training-chest",
    name: "Coffre d'entrainement",
    description: "Un coffre simple pour accelerer un peu l'apprentissage.",
    costGems: 150,
    reward: { xp: 100 }
  },
  {
    id: "arcane-cache",
    name: "Cache arcane",
    description: "Un lot mixte avec XP et poussiere, limite par ton stock de gemmes.",
    costGems: 300,
    reward: { xp: 120, magicDust: 120, random: true }
  }
];
