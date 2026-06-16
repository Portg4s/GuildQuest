export type SkillNode = {
  id: string;
  label: string;
  description: string;
  parentIds: string[];
  unlocked: boolean;
  completed: boolean;
};
