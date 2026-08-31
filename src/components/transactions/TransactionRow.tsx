import { ArrowDownLeft } from "lucide-react";
import type { Transaction } from "@/lib/finance/types";
import { CategoryIcon } from "@/components/money/CategoryIcon";
import { MoneyText } from "@/components/money/MoneyText";
import { formatDay } from "@/lib/finance/format";
import { useApp } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

export function TransactionRow({
  txn,
  onSelect,
  className,
}: {
  txn: Transaction;
  onSelect?: (txn: Transaction) => void;
  className?: string;
}) {
  const { state } = useApp();
  const category = state.categories.find((c) => c.id === txn.categoryId);
  const isIncome = txn.type === "income";
  const title = isIncome
    ? `${(txn.incomeKind ?? "other").charAt(0).toUpperCase()}${(txn.incomeKind ?? "other").slice(1)}`
    : (category?.name ?? "Other");

  const content = (
    <>
      {isIncome ? (
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/12 text-success">
          <ArrowDownLeft className="size-[18px]" aria-hidden />
        </span>
      ) : (
        <CategoryIcon icon={category?.icon ?? "other"} />
      )}
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-sm font-bold">{txn.note?.trim() || title}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {title} · {formatDay(txn.date)}
          {txn.method ? ` · ${txn.method}` : ""}
        </span>
      </span>
      <span className={cn("text-sm font-extrabold tabular", isIncome ? "text-success" : "text-foreground")}>
        {isIncome ? "+" : "−"}
        <MoneyText value={txn.amount} />
      </span>
    </>
  );

  if (!onSelect) {
    return <div className={cn("flex items-center gap-3 py-2.5", className)}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(txn)}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl py-2.5 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60",
        className,
      )}
    >
      {content}
    </button>
  );
}
