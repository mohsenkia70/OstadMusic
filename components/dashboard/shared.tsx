import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DashPageHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
      <div>
        <h1 className="text-2xl font-bold mb-1.5">{title}</h1>
        {desc && <p className="text-muted text-sm">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-surface p-6", className)}>
      <div className="text-muted text-sm mb-2.5">{label}</div>
      <div className="font-display text-2xl font-bold">{value}</div>
      {hint && <div className="text-xs text-muted mt-2">{hint}</div>}
    </div>
  );
}

export function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="text-center py-20 border border-dashed border-line rounded-2xl">
      <p className="font-semibold mb-1.5">{title}</p>
      <p className="text-muted text-sm">{desc}</p>
    </div>
  );
}
