import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-3xl border border-dashed bg-card px-6 py-12 text-center", className)}>
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        {icon}
      </span>
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
