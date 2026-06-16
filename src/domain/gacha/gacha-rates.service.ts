import { gachaRates } from "@/data/config/gacha.config";
import type { CharacterRarity } from "@/domain/models";

const rarityOrder: CharacterRarity[] = ["COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];

export function rollRarity(rates: Record<CharacterRarity, number> = gachaRates) {
  const totalWeight = rarityOrder.reduce((total, rarity) => total + rates[rarity], 0);
  let roll = Math.random() * totalWeight;

  for (const rarity of rarityOrder) {
    roll -= rates[rarity];
    if (roll <= 0) return rarity;
  }

  return rarityOrder[rarityOrder.length - 1];
}

export function getRarityOrder() {
  return rarityOrder;
}
