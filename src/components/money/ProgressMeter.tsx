import type { Health } from "@/lib/finance/calc";
import { cn } from "@/lib/utils";

const TRACK: Record<Health, string> = {
  good: "bg-primary",
  warn: "bg-warning",
  over: "bg-destructive",
};

export function ProgressMeter({
  value,
  health = "good",
  className,
  gradient = false,
  label,
}: {
  /** 0..1 (values above 1 render as a full bar with an over-budget cap) */
  value: number;
  health?: Health;
  className?: string;
  gradient?: boolean;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(value, 1)) * 100;
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-700 ease-out",
          gradient && health === "good" ? "bg-gradient-brand" : TRACK[health],
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
