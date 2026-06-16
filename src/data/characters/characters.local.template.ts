import type { LocalCharacterPack } from "@/data/characters/characters.registry";

// Ancien point d'entree conserve comme template court.
// Pour un exemple complet, consulte `characters.local.example.ts`.
// Copie `characters.local.example.ts` vers `characters.local.ts`, puis remplace les donnees par tes personnages prives.

export const localCharacterPack: LocalCharacterPack = {
  packName: "Private Local Pack",
  packVersion: 1,
  author: "local",
  replacePlaceholders: false,
  characters: [
    {
      id: "private-character-1",
      name: "Nom local fictif",
      rarity: "LEGENDARY",
      element: "Feu",
      power: 2500,
      description: "Description personnelle locale.",
      imageUrl: "/private-assets/characters/mon-personnage.webp",
      placeholderImage: "/pwa.svg",
      quote: "Citation locale optionnelle.",
      tags: ["local"],
      category: "private-local",
      variant: "default",
      isPrivate: true,
      source: "private-local-pack"
    }
  ]
};

export const localCharacters = localCharacterPack.characters;

export default localCharacterPack;
