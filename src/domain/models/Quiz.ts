import type { MissionRank } from "@/domain/models/MissionRank";
import type { QuizQuestion } from "@/domain/models/QuizQuestion";

export type Quiz = {
  id: string;
  zoneId: string;
  title: string;
  description: string;
  rank: MissionRank;
  questions: QuizQuestion[];
};
