import type { Badge } from "@/domain/models";

export type BadgeDefinition = Badge & {
  category: "quiz" | "level" | "gacha" | "progression";
};

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: "first-quiz-success",
    name: "Premier quiz reussi",
    description: "Valider un premier quiz avec au moins 60%.",
    icon: "check",
    category: "quiz"
  },
  {
    id: "first-perfect",
    name: "Premier sans-faute",
    description: "Obtenir 100% a un quiz.",
    icon: "sparkles",
    category: "quiz"
  },
  {
    id: "five-quiz-completed",
    name: "5 quiz termines",
    description: "Valider 5 quiz du pack.",
    icon: "trophy",
    category: "quiz"
  },
  {
    id: "ten-quiz-completed",
    name: "10 quiz termines",
    description: "Valider 10 quiz du pack.",
    icon: "trophy",
    category: "quiz"
  },
  {
    id: "first-level-up",
    name: "Premier niveau superieur",
    description: "Gagner son premier niveau.",
    icon: "arrow-up",
    category: "level"
  },
  {
    id: "level-5",
    name: "Niveau 5 atteint",
    description: "Atteindre le niveau 5.",
    icon: "star",
    category: "level"
  },
  {
    id: "level-10",
    name: "Niveau 10 atteint",
    description: "Atteindre le niveau 10.",
    icon: "star",
    category: "level"
  },
  {
    id: "first-invocation",
    name: "Premiere invocation",
    description: "Realiser une premiere invocation.",
    icon: "gem",
    category: "gacha"
  },
  {
    id: "first-rare-character",
    name: "Premier personnage rare",
    description: "Obtenir un personnage RARE ou mieux.",
    icon: "gem",
    category: "gacha"
  },
  {
    id: "first-legendary-character",
    name: "Premier personnage legendaire",
    description: "Obtenir un personnage LEGENDARY ou MYTHIC.",
    icon: "gem",
    category: "gacha"
  },
  {
    id: "foundations-explorer",
    name: "Explorateur des Fondations",
    description: "Terminer une premiere zone des Fondations Web.",
    icon: "map",
    category: "progression"
  },
  {
    id: "foundations-master",
    name: "Maitre des Fondations",
    description: "Valider tous les quiz des Fondations Web.",
    icon: "crown",
    category: "progression"
  }
];
