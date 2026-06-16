import { duplicateRewards } from "@/data/config/duplicates.config";
import type { CharacterRarity } from "@/domain/models";

export function getDuplicateReward(rarity: CharacterRarity) {
  return duplicateRewards[rarity];
}
