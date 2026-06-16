import type { PlayerTitle } from "@/domain/models";

export type TitleDefinition = PlayerTitle & {
  category: "starter" | "quiz" | "level" | "gacha" | "collection" | "progression";
};

export const titleDefinitions: TitleDefinition[] = [
  {
    id: "guild-apprentice",
    label: "Apprenti de la Guilde",
    description: "Titre de depart pour tout nouveau membre.",
    category: "starter"
  },
  {
    id: "rank-f-mage",
    label: "Mage de Rang F",
    description: "Titre initial de mage debutant.",
    category: "starter"
  },
  {
    id: "skill-hunter",
    label: "Chasseur de Competences",
    description: "Valider plusieurs quiz du pack.",
    category: "quiz"
  },
  {
    id: "web-mage",
    label: "Mage du Web",
    description: "Atteindre une progression solide dans Fondations Web.",
    category: "progression"
  },
  {
    id: "novice-summoner",
    label: "Invocateur Debutant",
    description: "Realiser une premiere invocation.",
    category: "gacha"
  },
  {
    id: "guild-collector",
    label: "Collectionneur de Guilde",
    description: "Debloquer plusieurs personnages.",
    category: "collection"
  },
  {
    id: "foundations-strategist",
    label: "Stratege des Fondations",
    description: "Terminer une zone de la Plaine des Fondations.",
    category: "progression"
  },
  {
    id: "rising-star",
    label: "Etoile Montante",
    description: "Atteindre le niveau 5.",
    category: "level"
  }
];

export const defaultTitleIds = ["guild-apprentice", "rank-f-mage"];
