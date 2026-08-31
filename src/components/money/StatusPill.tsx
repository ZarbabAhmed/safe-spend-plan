import { Check, TrendingUp, AlertCircle } from "lucide-react";
import type { Health } from "@/lib/finance/calc";
import { cn } from "@/lib/utils";

const STYLES: Record<Health, string> = {
  good: "bg-success/12 text-success",
  warn: "bg-warning/15 text-warning",
  over: "bg-destructive/12 text-destructive",
};

const ICONS: Record<Health, typeof Check> = {
  good: Check,
  warn: TrendingUp,
  over: AlertCircle,
};

/** Status is never communicated by color alone — icon + text always travel with it. */
export function StatusPill({
  health,
  children,
  className,
  onDark = false,
}: {
  health: Health;
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  const Icon = ICONS[health];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        onDark ? "bg-white/15 text-white" : STYLES[health],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}
