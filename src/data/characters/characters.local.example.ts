import type { LocalCharacterPack } from "@/data/characters/characters.registry";

// Copie ce fichier en `characters.local.ts` pour activer tes personnages prives.
// `characters.local.ts` est ignore par Git.
// Les images doivent rester dans `public/private-assets/characters/`.

export const localCharacterPack: LocalCharacterPack = {
  packName: "Private Local Pack",
  packVersion: 1,
  author: "local",
  replacePlaceholders: false,
  characters: [
    {
      id: "private-arcane-novice",
      name: "Astra Noctilume",
      rarity: "EPIC",
      element: "Arcane",
      power: 1320,
      description: "Une mage locale fictive creee pour tester le chargement des assets prives.",
      imageUrl: "/private-assets/characters/example-arcane-novice.webp",
      portraitUrl: "/private-assets/characters/example-arcane-novice-portrait.webp",
      bannerUrl: "/private-assets/characters/example-arcane-novice-banner.webp",
      placeholderImage: "/pwa.svg",
      quote: "Chaque rune apprend a briller.",
      tags: ["local", "test", "arcane"],
      category: "private-local",
      variant: "default",
      isPrivate: true,
      source: "private-local-pack"
    },
    {
      id: "private-solar-warden",
      name: "Solvan Dorveille",
      rarity: "LEGENDARY",
      element: "Lumiere",
      power: 2480,
      description: "Un gardien fictif utilise comme exemple de personnage prive local.",
      imageUrl: "/private-assets/characters/example-solar-warden.webp",
      placeholderImage: "/pwa.svg",
      quote: "La guilde garde les savoirs qui te font avancer.",
      tags: ["local", "test", "lumiere"],
      category: "private-local",
      variant: "default",
      isPrivate: true,
      source: "private-local-pack"
    }
  ]
};

export const localCharacters = localCharacterPack.characters;

export default localCharacterPack;
