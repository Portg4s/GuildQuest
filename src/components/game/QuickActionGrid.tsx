import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type QuickAction = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

type QuickActionGridProps = {
  actions: QuickAction[];
  className?: string;
};

export function QuickActionGrid({ actions, className }: QuickActionGridProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-2 sm:grid-cols-4", className)}>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={action.onClick}
          className="guild-card magic-border flex h-16 flex-col items-center justify-center gap-1 px-2 text-xs font-black text-slate-100 transition hover:-translate-y-0.5 hover:border-teal-200/50 hover:bg-teal-300/15 active:translate-y-0 active:scale-[0.98]"
        >
          <span className="grid size-7 place-items-center rounded-md bg-teal-300/10 text-teal-100">{action.icon}</span>
          <span className="max-w-full truncate">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
