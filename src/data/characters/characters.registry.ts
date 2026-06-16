import type { Character, CharacterRarity } from "@/domain/models";
import { placeholderCharacters } from "@/data/characters/characters.placeholder";

const validRarities: CharacterRarity[] = ["COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];

export type LocalCharacterInput = Omit<Character, "image" | "placeholderImage"> &
  Partial<Pick<Character, "image" | "placeholderImage">> & {
    imageUrl?: string;
    portraitUrl?: string;
    bannerUrl?: string;
    quote?: string;
    tags?: string[];
  };

export type LocalCharacterPack = {
  packName: string;
  packVersion: number;
  author?: string;
  replacePlaceholders?: boolean;
  characters: LocalCharacterInput[];
};

type LocalCharacterModule = {
  default?: Character[] | LocalCharacterInput[] | LocalCharacterPack;
  localCharacters?: LocalCharacterInput[];
  localCharacterPack?: LocalCharacterPack;
};

export type CharacterRegistryInfo = {
  totalCharacters: number;
  placeholderCount: number;
  localCount: number;
  localPackDetected: boolean;
  localPackName?: string;
  localPackVersion?: number;
  localPackAuthor?: string;
  replacePlaceholders: boolean;
  invalidLocalCount: number;
};

const localCharacterModules = import.meta.glob<LocalCharacterModule>("./characters.local.ts", {
  eager: true
});

function readLocalPack() {
  const modules = Object.values(localCharacterModules);
  const firstPack = modules.map((module) => module.localCharacterPack).find(Boolean);

  if (firstPack) return firstPack;

  const firstDefaultPack = modules
    .map((module) => module.default)
    .find((candidate): candidate is LocalCharacterPack => Boolean(candidate && !Array.isArray(candidate) && "characters" in candidate));

  if (firstDefaultPack) return firstDefaultPack;

  const characters = modules.flatMap((module) => {
    if (module.localCharacters) return module.localCharacters;
    if (Array.isArray(module.default)) return module.default;
    return [];
  });

  return characters.length
    ? {
        packName: "Pack local prive",
        packVersion: 1,
        characters
      }
    : undefined;
}

function isValidLocalCharacter(character: LocalCharacterInput) {
  return Boolean(
    character.id &&
      character.name &&
      validRarities.includes(character.rarity) &&
      character.element &&
      typeof character.power === "number" &&
      character.description &&
      (character.imageUrl || character.image || character.portraitUrl)
  );
}

function normalizeLocalCharacter(character: LocalCharacterInput, packName: string): Character {
  const image = character.imageUrl ?? character.image ?? character.portraitUrl ?? "/pwa.svg";

  return {
    ...character,
    image,
    imageUrl: character.imageUrl ?? image,
    portraitUrl: character.portraitUrl ?? image,
    placeholderImage: character.placeholderImage ?? "/pwa.svg",
    isPrivate: character.isPrivate ?? true,
    source: character.source ?? packName
  };
}

function mergeCharacters(publicCharacters: Character[], privateCharacters: Character[], replacePlaceholders: boolean) {
  const merged = new Map<string, Character>();

  if (!replacePlaceholders) {
    for (const character of publicCharacters) {
      merged.set(character.id, character);
    }
  }

  for (const character of privateCharacters) {
    merged.set(character.id, character);
  }

  return Array.from(merged.values());
}

const localPack = readLocalPack();
const localPackCharacters = localPack?.characters ?? [];
const validLocalCharacters = localPackCharacters
  .filter(isValidLocalCharacter)
  .map((character) => normalizeLocalCharacter(character, localPack?.packName ?? "Pack local prive"));
const invalidLocalCount = localPackCharacters.length - validLocalCharacters.length;

export const characterRegistryInfo: CharacterRegistryInfo = {
  totalCharacters: mergeCharacters(placeholderCharacters, validLocalCharacters, Boolean(localPack?.replacePlaceholders)).length,
  placeholderCount: placeholderCharacters.length,
  localCount: validLocalCharacters.length,
  localPackDetected: Boolean(localPack),
  localPackName: localPack?.packName,
  localPackVersion: localPack?.packVersion,
  localPackAuthor: localPack?.author,
  replacePlaceholders: Boolean(localPack?.replacePlaceholders),
  invalidLocalCount
};

export const characters = mergeCharacters(
  placeholderCharacters,
  validLocalCharacters,
  characterRegistryInfo.replacePlaceholders
);

export function getCharacters() {
  return characters;
}

export function getCharacterRegistryInfo() {
  return characterRegistryInfo;
}
