export type SkillNode = {
  id: string;
  zoneId?: string;
  label: string;
  description: string;
  quizIds?: string[];
  order?: number;
  parentIds: string[];
  unlocked: boolean;
  completed: boolean;
};
