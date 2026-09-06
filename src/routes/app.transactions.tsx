import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Receipt, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Transaction } from "@/lib/finance/types";
import { MonthSelector } from "@/components/money/MonthSelector";
import { MoneyText } from "@/components/money/MoneyText";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { EmptyState } from "@/components/common/EmptyState";
import { ResponsiveSheet } from "@/components/common/ResponsiveSheet";
import { CurrencyInput } from "@/components/money/CurrencyInput";
import { useQuickAdd } from "@/components/transactions/QuickAdd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store/app-store";
import { txnsForMonth } from "@/lib/finance/calc";
import { formatDay, monthLabel, todayISO } from "@/lib/finance/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/transactions")({
  head: () => ({
    meta: [
      { title: "Activity — Nisaab" },
      { name: "description", content: "Every expense and income you've recorded, grouped by day and searchable." },
      { property: "og:title", content: "Activity — Nisaab" },
      { property: "og:description", content: "Your full money history in one timeline." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TransactionsPage,
});

type Filter = "all" | "expense" | "income";

function TransactionsPage() {
  const { state, month, actions } = useApp();
  const { openExpense } = useQuickAdd();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return txnsForMonth(state, month)
      .filter((t) => (filter === "all" ? true : t.type === filter))
      .filter((t) => {
        if (!q) return true;
        const category = state.categories.find((c) => c.id === t.categoryId)?.name ?? t.categoryId;
        return `${t.note ?? ""} ${category}`.toLowerCase().includes(q);
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [state, month, filter, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of list) {
      const bucket = map.get(t.date) ?? [];
      bucket.push(t);
      map.set(t.date, bucket);
    }
    return [...map.entries()];
  }, [list]);

  const totals = useMemo(
    () => ({
      spent: list.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      earned: list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    }),
    [list],
  );

  const openDetail = (txn: Transaction) => {
    setSelected(txn);
    setAmount(txn.amount);
    setNote(txn.note ?? "");
    setDate(txn.date);
  };

  return (
    <div className="space-y-5 py-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Activity</h1>
          <p className="text-sm text-muted-foreground">{monthLabel(month)}</p>
        </div>
        <MonthSelector compact />
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border bg-card px-4 py-3 shadow-card">
          <p className="text-[11px] font-bold text-muted-foreground">Spent</p>
          <p className="mt-0.5 text-lg font-extrabold tabular">
            <MoneyText value={totals.spent} />
          </p>
        </div>
        <div className="rounded-2xl border bg-card px-4 py-3 shadow-card">
          <p className="text-[11px] font-bold text-muted-foreground">Received</p>
          <p className="mt-0.5 text-lg font-extrabold tabular text-success">
            <MoneyText value={totals.earned} />
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          className="h-12 rounded-2xl pl-11"
          placeholder="Search notes and categories"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search transactions"
        />
      </div>

      <div className="flex gap-2">
        {(
          [
            { id: "all", label: "All" },
            { id: "expense", label: "Expenses" },
            { id: "income", label: "Income" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              filter === f.id ? "border-transparent bg-gradient-brand text-white" : "bg-card text-muted-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-6" />}
          title={query ? "Nothing matches that" : "No activity this month"}
          description={
            query ? "Try a different word or clear the search." : "Add your first expense and it will appear here."
          }
          action={
            query ? (
              <Button variant="outline" className="rounded-2xl font-bold" onClick={() => setQuery("")}>
                Clear search
              </Button>
            ) : (
              <Button className="rounded-2xl font-bold" onClick={openExpense}>
                Add expense
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-5">
          {grouped.map(([day, items]) => (
            <section key={day}>
              <h2 className="mb-1 text-xs font-bold text-muted-foreground">{formatDay(day)}</h2>
              <div className="divide-y rounded-3xl border bg-card px-4 shadow-card">
                {items.map((t) => (
                  <TransactionRow key={t.id} txn={t} onSelect={openDetail} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <ResponsiveSheet
        open={selected !== null}
        onOpenChange={(v) => !v && setSelected(null)}
        title="Edit entry"
        description="Change the details or remove it entirely."
      >
        <div className="space-y-5">
          <CurrencyInput value={amount === 0 ? "" : amount} onChange={setAmount} size="lg" label="Amount" />
          <div className="space-y-1.5">
            <Label htmlFor="edit-date">Date</Label>
            <Input id="edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-note">Note</Label>
            <Input id="edit-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-2xl font-bold text-destructive"
              onClick={() => {
                if (!selected) return;
                actions.deleteTransaction(selected.id);
                toast.success("Entry removed");
                setSelected(null);
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
            <Button
              size="lg"
              className="flex-1 rounded-2xl font-bold"
              onClick={() => {
                if (!selected) return;
                actions.updateTransaction(selected.id, { amount, date, note: note.trim() || undefined });
                toast.success("Entry updated");
                setSelected(null);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </ResponsiveSheet>
    </div>
  );
}
