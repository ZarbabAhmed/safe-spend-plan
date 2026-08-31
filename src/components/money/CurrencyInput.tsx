import { useId } from "react";
import { getCurrency } from "@/lib/finance/currencies";
import { useCurrency } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

export function CurrencyInput({
  value,
  onChange,
  label,
  hint,
  placeholder = "0",
  autoFocus,
  size = "md",
  id,
}: {
  value: number | "";
  onChange: (value: number) => void;
  label?: string;
  hint?: string;
  placeholder?: string;
  autoFocus?: boolean;
  size?: "md" | "lg";
  id?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const currency = useCurrency();
  const def = getCurrency(currency);

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-semibold">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border bg-card px-4 transition-colors focus-within:border-primary",
          size === "lg" ? "py-3.5" : "py-2.5",
        )}
      >
        <span className={cn("font-bold text-muted-foreground", size === "lg" ? "text-xl" : "text-sm")}>
          {def.prefix.trim()}
        </span>
        <input
          id={inputId}
          inputMode="numeric"
          autoFocus={autoFocus}
          className={cn(
            "w-full bg-transparent tabular font-extrabold outline-none placeholder:font-semibold placeholder:text-muted-foreground/60",
            size === "lg" ? "text-2xl" : "text-base",
          )}
          placeholder={placeholder}
          value={value === "" ? "" : value.toLocaleString("en-US")}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, "");
            onChange(digits === "" ? 0 : Number(digits));
          }}
        />
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
