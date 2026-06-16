import type { Character } from "@/domain/models";
import { placeholderCharacters } from "@/data/characters/characters.placeholder";

type LocalCharacterModule = {
  default?: Character[];
  localCharacters?: Character[];
};

const localCharacterModules = import.meta.glob<LocalCharacterModule>("./characters.local.ts", {
  eager: true
});

const localCharacters = Object.values(localCharacterModules).flatMap(
  (module) => module.localCharacters ?? module.default ?? []
);

function mergeCharacters(publicCharacters: Character[], privateCharacters: Character[]) {
  const merged = new Map<string, Character>();

  for (const character of publicCharacters) {
    merged.set(character.id, character);
  }

  for (const character of privateCharacters) {
    merged.set(character.id, {
      ...character,
      isPrivate: character.isPrivate ?? true,
      source: character.source ?? "local"
    });
  }

  return Array.from(merged.values());
}

export const characters = mergeCharacters(placeholderCharacters, localCharacters);

export function getCharacters() {
  return characters;
}
