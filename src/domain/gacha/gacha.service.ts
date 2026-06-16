import { gachaCosts } from "@/data/config/gacha.config";
import { exampleCharacters } from "@/data/characters/characters.example";
import type { Character, CharacterRarity, GachaPull, Player, PlayerCharacter } from "@/domain/models";
import { getDuplicateReward } from "@/domain/gacha/duplicate.service";
import { rollRarity } from "@/domain/gacha/gacha-rates.service";

export type GachaPullResult = {
  pull: GachaPull;
  character: Character;
  playerCharacter: PlayerCharacter;
  isNew: boolean;
  fragmentsGained: number;
  magicDustGained: number;
};

export type GachaInvocationResult = {
  player: Player;
  collection: PlayerCharacter[];
  history: GachaPull[];
  results: GachaPullResult[];
  totalCost: number;
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickCharacterByRarity(characters: Character[], rarity: CharacterRarity) {
  const exactPool = characters.filter((character) => character.rarity === rarity);

  if (exactPool.length > 0) return pickRandom(exactPool);

  return pickRandom(characters);
}

function createPlayerCharacter(characterId: string, now: string, isActive: boolean): PlayerCharacter {
  return {
    id: `owned-${characterId}`,
    characterId,
    level: 1,
    xp: 0,
    fragments: 0,
    duplicateCount: 0,
    duplicates: 0,
    obtainedAt: now,
    unlockedAt: now,
    isActive
  };
}

export function canAffordGacha(player: Player, count: 1 | 10) {
  return player.gems >= getGachaCost(count);
}

export function getGachaCost(count: 1 | 10) {
  return count === 1 ? gachaCosts.singlePullCost : gachaCosts.tenPullCost;
}

export function performGachaInvocation(params: {
  player: Player;
  collection: PlayerCharacter[];
  count: 1 | 10;
  characters?: Character[];
}): GachaInvocationResult {
  const characters = params.characters ?? exampleCharacters;
  const totalCost = getGachaCost(params.count);

  if (characters.length === 0) {
    throw new Error("Aucun personnage disponible pour l'invocation.");
  }

  if (!canAffordGacha(params.player, params.count)) {
    throw new Error("Gemmes insuffisantes.");
  }

  const collectionByCharacterId = new Map(
    params.collection.map((playerCharacter) => [playerCharacter.characterId, { ...playerCharacter }])
  );
  const results: GachaPullResult[] = [];
  const history: GachaPull[] = [];
  let magicDustGained = 0;
  let activeCharacterId = params.player.activeCharacterId;

  for (let index = 0; index < params.count; index += 1) {
    const rarity = rollRarity();
    const character = pickCharacterByRarity(characters, rarity);
    const now = new Date().toISOString();
    const existing = collectionByCharacterId.get(character.id);
    const duplicateReward = existing ? getDuplicateReward(character.rarity) : { fragments: 0, magicDust: 0 };
    const isNew = !existing;
    const playerCharacter = existing
      ? {
          ...existing,
          fragments: (existing.fragments ?? 0) + duplicateReward.fragments,
          duplicateCount: (existing.duplicateCount ?? existing.duplicates ?? 0) + 1,
          duplicates: (existing.duplicates ?? existing.duplicateCount ?? 0) + 1
        }
      : createPlayerCharacter(character.id, now, !activeCharacterId);

    if (!activeCharacterId) {
      activeCharacterId = character.id;
    }

    collectionByCharacterId.set(character.id, playerCharacter);
    magicDustGained += duplicateReward.magicDust;

    const pull: GachaPull = {
      id: createId("pull"),
      characterId: character.id,
      rarity: character.rarity,
      cost: index === 0 ? totalCost : 0,
      isDuplicate: !isNew,
      fragmentsGained: duplicateReward.fragments,
      magicDustGained: duplicateReward.magicDust,
      pulledAt: now
    };

    history.push(pull);
    results.push({
      pull,
      character,
      playerCharacter,
      isNew,
      fragmentsGained: duplicateReward.fragments,
      magicDustGained: duplicateReward.magicDust
    });
  }

  return {
    player: {
      ...params.player,
      gems: params.player.gems - totalCost,
      magicDust: (params.player.magicDust ?? 0) + magicDustGained,
      activeCharacterId,
      updatedAt: new Date().toISOString()
    },
    collection: Array.from(collectionByCharacterId.values()).map((playerCharacter) => ({
      ...playerCharacter,
      isActive: playerCharacter.characterId === activeCharacterId
    })),
    history,
    results,
    totalCost
  };
}
