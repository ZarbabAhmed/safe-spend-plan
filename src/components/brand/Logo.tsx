import { cn } from "@/lib/utils";

/** Original brand mark: a rising "safe to spend" arc inside a rounded shield. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} role="img" aria-label="Nisaab logo">
      <defs>
        <linearGradient id="nisaab-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.19 291)" />
          <stop offset="60%" stopColor="oklch(0.5 0.2 288)" />
          <stop offset="100%" stopColor="oklch(0.66 0.15 263)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#nisaab-mark)" />
      <path
        d="M10 26.5c4.4 0 5.6-9 10-9s5.6 5 10 5"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="30" cy="22.5" r="2.6" fill="oklch(0.82 0.11 192)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark className="size-8" />
      <span className="text-lg font-extrabold tracking-tight">Nisaab</span>
    </span>
  );
}
