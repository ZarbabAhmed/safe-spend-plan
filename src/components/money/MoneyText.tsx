import { useEffect, useRef, useState } from "react";
import { formatMoney } from "@/lib/finance/format";
import { useCurrency } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Animates from the previous value to the next so change is legible, not decorative. */
export function useCountUp(value: number, duration = 650) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const initial = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(initial + (value - initial) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, reduced]);

  return display;
}

interface MoneyTextProps {
  value: number;
  compact?: boolean;
  animate?: boolean;
  className?: string;
  currency?: string;
}

export function MoneyText({ value, compact, animate = false, className, currency }: MoneyTextProps) {
  const storeCurrency = useCurrency();
  const animated = useCountUp(animate ? value : value, animate ? 650 : 0);
  const shown = animate ? animated : value;
  const code = currency ?? storeCurrency;
  return (
    <span className={cn("tabular", className)}>
      {formatMoney(Math.round(shown), code, compact === true ? { compact: true } : undefined)}
    </span>
  );
}
