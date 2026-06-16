import type { Character } from "@/domain/models";

export const exampleCharacters: Character[] = [
  {
    id: "apprentice-luma",
    name: "Luma l'Apprentie",
    rarity: "COMMON",
    element: "Lumiere",
    power: 120,
    description: "Une apprentie attentive qui stabilise les bases de chaque lecon.",
    image: "/private-assets/characters/apprentice-luma.png",
    placeholderImage: "/pwa.svg"
  },
  {
    id: "scribe-novan",
    name: "Novan le Scribe",
    rarity: "COMMON",
    element: "Parchemin",
    power: 135,
    description: "Il transforme les notes brouillonnes en savoir clair.",
    image: "/private-assets/characters/scribe-novan.png",
    placeholderImage: "/pwa.svg"
  },
  {
    id: "forge-mira",
    name: "Mira de la Forge",
    rarity: "RARE",
    element: "Feu",
    power: 210,
    description: "Elle aiguise la logique comme une lame bien entretenue.",
    image: "/private-assets/characters/forge-mira.png",
    placeholderImage: "/pwa.svg"
  },
  {
    id: "rune-tarek",
    name: "Tarek aux Runes",
    rarity: "RARE",
    element: "Rune",
    power: 230,
    description: "Un mage patient qui adore decomposer les problemes.",
    image: "/private-assets/characters/rune-tarek.png",
    placeholderImage: "/pwa.svg"
  },
  {
    id: "aera-sentinel",
    name: "Aera Sentinelle",
    rarity: "EPIC",
    element: "Vent",
    power: 360,
    description: "Rapide et precise, elle detecte les erreurs avant qu'elles ne frappent.",
    image: "/private-assets/characters/aera-sentinel.png",
    placeholderImage: "/pwa.svg"
  },
  {
    id: "kael-architect",
    name: "Kael l'Architecte",
    rarity: "EPIC",
    element: "Pierre",
    power: 390,
    description: "Il batit des systemes solides a partir de petites briques fiables.",
    image: "/private-assets/characters/kael-architect.png",
    placeholderImage: "/pwa.svg"
  },
  {
    id: "naya-oracle",
    name: "Naya l'Oracle",
    rarity: "LEGENDARY",
    element: "Etoile",
    power: 620,
    description: "Ses visions revelent les chemins caches de la progression.",
    image: "/private-assets/characters/naya-oracle.png",
    placeholderImage: "/pwa.svg"
  },
  {
    id: "solen-warden",
    name: "Solen le Gardien",
    rarity: "LEGENDARY",
    element: "Aube",
    power: 650,
    description: "Protecteur du hall, il recompense les efforts constants.",
    image: "/private-assets/characters/solen-warden.png",
    placeholderImage: "/pwa.svg"
  },
  {
    id: "elys-celestial",
    name: "Elys Celeste",
    rarity: "MYTHIC",
    element: "Cosmos",
    power: 940,
    description: "Une presence rare qui amplifie chaque victoire parfaite.",
    image: "/private-assets/characters/elys-celestial.png",
    placeholderImage: "/pwa.svg"
  },
  {
    id: "orion-voidsmith",
    name: "Orion Forge-Vide",
    rarity: "MYTHIC",
    element: "Nebuleuse",
    power: 980,
    description: "Il faconne des raccourcis mentaux dans les sujets les plus denses.",
    image: "/private-assets/characters/orion-voidsmith.png",
    placeholderImage: "/pwa.svg"
  }
];
