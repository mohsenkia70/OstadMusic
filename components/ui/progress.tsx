import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full rounded-full bg-surface-2 overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-l from-gold to-[#0f766e] transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
