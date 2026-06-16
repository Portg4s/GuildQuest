import type { DailyQuest } from "@/domain/models";

export const dailyQuestDefinitions: DailyQuest[] = [
  {
    id: "open-app",
    title: "Entrer dans la guilde",
    description: "Ouvre GuildQuest aujourd'hui.",
    target: 1,
    reward: { xp: 10, gems: 5 }
  },
  {
    id: "complete-quiz",
    title: "Revision du jour",
    description: "Termine 1 quiz.",
    target: 1,
    reward: { xp: 25, gems: 10 }
  },
  {
    id: "score-80",
    title: "Reussite brillante",
    description: "Obtiens au moins 80% a un quiz.",
    target: 1,
    reward: { xp: 35, gems: 15 }
  },
  {
    id: "gacha-pull",
    title: "Rune d'invocation",
    description: "Fais 1 invocation.",
    target: 1,
    reward: { xp: 10, gems: 5, magicDust: 10 }
  },
  {
    id: "play-duel",
    title: "Entrainer l'equipe",
    description: "Joue 1 duel.",
    target: 1,
    reward: { xp: 20, gems: 5 }
  },
  {
    id: "win-duel",
    title: "Victoire d'arene",
    description: "Gagne 1 duel.",
    target: 1,
    reward: { xp: 30, gems: 12 }
  }
];
