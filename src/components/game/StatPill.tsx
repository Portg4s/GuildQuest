import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatPillProps = {
  icon?: ReactNode;
  label: string;
  value: string | number;
  tone?: "default" | "gold" | "teal";
  className?: string;
};

const toneClasses = {
  default: "border-white/10 bg-white/[0.06] text-slate-100",
  gold: "border-amber-200/20 bg-amber-300/10 text-amber-100",
  teal: "border-teal-200/20 bg-teal-300/10 text-teal-100"
};

export function StatPill({ icon, label, value, tone = "default", className }: StatPillProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2", toneClasses[tone], className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      <div className="min-w-0">
        <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.12em] opacity-75">{label}</p>
        <p className="truncate text-sm font-black text-white">{value}</p>
      </div>
    </div>
  );
}
