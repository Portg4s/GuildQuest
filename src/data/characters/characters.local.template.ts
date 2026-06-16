import type { Character } from "@/domain/models";

// Copie ce fichier en `characters.local.ts` pour tes personnages prives locaux.
// Le fichier `characters.local.ts` est ignore par Git et peut referencer :
// `/public/private-assets/characters/...` via l'URL `/private-assets/characters/...`.
// Ne place aucun asset protege dans le repo public.

export const localCharacters: Character[] = [
  {
    id: "private-character-1",
    name: "Nom du personnage local",
    rarity: "LEGENDARY",
    element: "Feu",
    power: 2500,
    description: "Description locale personnelle.",
    image: "/private-assets/characters/mon-personnage.png",
    placeholderImage: "/pwa.svg",
    category: "local",
    variant: "default",
    isPrivate: true,
    source: "local-template"
  }
];
