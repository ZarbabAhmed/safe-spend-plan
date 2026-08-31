import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import type { IncomeKind, PaymentMethod } from "@/lib/finance/types";
import { useApp } from "@/lib/store/app-store";
import { ResponsiveSheet } from "@/components/common/ResponsiveSheet";
import { CurrencyInput } from "@/components/money/CurrencyInput";
import { CategoryIcon } from "@/components/money/CategoryIcon";
import { MoneyText } from "@/components/money/MoneyText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayISO } from "@/lib/finance/format";
import { cn } from "@/lib/utils";

interface QuickAddValue {
  openExpense: () => void;
  openIncome: () => void;
}

const QuickAddContext = createContext<QuickAddValue | null>(null);

export function useQuickAdd(): QuickAddValue {
  const ctx = useContext(QuickAddContext);
  if (!ctx) throw new Error("useQuickAdd must be used inside QuickAddProvider");
  return ctx;
}

const METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "cash", label: "Cash" },
  { id: "card", label: "Card" },
  { id: "bank", label: "Bank" },
  { id: "wallet", label: "Wallet" },
];

const INCOME_KINDS: { id: IncomeKind; label: string }[] = [
  { id: "salary", label: "Salary" },
  { id: "bonus", label: "Bonus" },
  { id: "freelance", label: "Freelance" },
  { id: "other", label: "Other" },
];

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const value = useMemo<QuickAddValue>(
    () => ({ openExpense: () => setExpenseOpen(true), openIncome: () => setIncomeOpen(true) }),
    [],
  );

  return (
    <QuickAddContext.Provider value={value}>
      {children}
      <AddExpenseSheet open={expenseOpen} onOpenChange={setExpenseOpen} />
      <AddIncomeSheet open={incomeOpen} onOpenChange={setIncomeOpen} />
    </QuickAddContext.Provider>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-transparent bg-gradient-brand text-white"
          : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function AddExpenseSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { state, summary, actions } = useApp();
  const [amount, setAmount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState("food");
  const [date, setDate] = useState(todayISO());
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const line = summary.lines.find((l) => l.id === categoryId);

  const reset = () => {
    setAmount(0);
    setNote("");
    setError(null);
    setDate(todayISO());
  };

  const save = () => {
    if (amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    actions.addTransaction({
      type: "expense",
      amount,
      categoryId,
      date,
      method,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
    const remainingAfter = (line?.remaining ?? 0) - amount;
    toast.success("Expense added", {
      description:
        remainingAfter >= 0
          ? `${line?.name ?? "Category"} has room left this month.`
          : `You're over your ${line?.name.toLowerCase() ?? "category"} plan — you can adjust it in Budget.`,
      icon: <Check className="size-4" />,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <ResponsiveSheet open={open} onOpenChange={onOpenChange} title="Add expense" description="It updates your plan instantly.">
      <div className="space-y-5">
        <CurrencyInput value={amount === 0 ? "" : amount} onChange={setAmount} size="lg" autoFocus label="Amount" />

        <div className="space-y-2">
          <span className="text-sm font-semibold">Category</span>
          <div className="grid grid-cols-4 gap-2">
            {state.categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                aria-pressed={categoryId === c.id}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center transition-colors",
                  categoryId === c.id ? "border-primary bg-accent" : "hover:border-primary/40",
                )}
              >
                <CategoryIcon icon={c.icon} className="size-8 rounded-lg" />
                <span className="line-clamp-1 text-[11px] font-semibold">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {line && line.planned > 0 ? (
          <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            {line.name}: <MoneyText value={Math.max(line.remaining, 0)} className="font-bold text-foreground" /> left of{" "}
            <MoneyText value={line.planned} /> this month.
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="expense-date">Date</Label>
            <Input id="expense-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="expense-note">Note (optional)</Label>
            <Input id="expense-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Lunch with team" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold">Payment method</span>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <Chip key={m.id} active={method === m.id} onClick={() => setMethod(m.id)}>
                {m.label}
              </Chip>
            ))}
          </div>
        </div>

        {error ? (
          <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive">
            {error}
          </p>
        ) : null}

        <Button size="lg" className="w-full rounded-2xl" onClick={save}>
          Save expense
        </Button>
      </div>
    </ResponsiveSheet>
  );
}

function AddIncomeSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { actions, state } = useApp();
  const [amount, setAmount] = useState<number>(0);
  const [kind, setKind] = useState<IncomeKind>("salary");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [extra, setExtra] = useState<number | null>(null);

  const save = () => {
    if (amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    actions.addTransaction({
      type: "income",
      amount,
      categoryId: kind,
      incomeKind: kind,
      date,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
    toast.success("Income added", { description: "Your plan and Safe to Spend are updated." });
    if (kind !== "salary") {
      setExtra(amount);
    } else {
      onOpenChange(false);
    }
    setAmount(0);
    setNote("");
    setError(null);
  };

  const allocate = (target: "savings" | "emergency" | "goal" | "spend") => {
    const value = extra ?? 0;
    if (target !== "spend" && value > 0) {
      const goalId = state.goals[0]?.id;
      if (target === "goal" && !goalId) {
        toast.info("Create a goal first, then you can send money to it.");
      } else {
        actions.addDeposit({
          amount: value,
          target: target === "goal" ? "goal" : target,
          ...(target === "goal" && goalId ? { goalId } : {}),
          note: "From extra income",
        });
        toast.success("Nice move", { description: "Your extra income has been put to work." });
      }
    }
    setExtra(null);
    onOpenChange(false);
  };

  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={(v) => {
        if (!v) setExtra(null);
        onOpenChange(v);
      }}
      title={extra ? "You've received extra income" : "Add income"}
      description={extra ? "Only if you want to — you can decide later." : "Salary, bonus, freelance or anything else."}
    >
      {extra ? (
        <div className="space-y-3">
          <p className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
            <MoneyText value={extra} /> added. How would you like to use it?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-14 rounded-2xl" onClick={() => allocate("savings")}>
              Save it
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl" onClick={() => allocate("emergency")}>
              Emergency fund
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl" onClick={() => allocate("goal")}>
              Toward a goal
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl" onClick={() => allocate("spend")}>
              Keep it spendable
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <CurrencyInput value={amount === 0 ? "" : amount} onChange={setAmount} size="lg" autoFocus label="Amount" />
          <div className="space-y-2">
            <span className="text-sm font-semibold">Type</span>
            <div className="flex flex-wrap gap-2">
              {INCOME_KINDS.map((k) => (
                <Chip key={k.id} active={kind === k.id} onClick={() => setKind(k.id)}>
                  {k.label}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="income-date">Date</Label>
              <Input id="income-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="income-note">Note (optional)</Label>
              <Input id="income-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Project payment" />
            </div>
          </div>
          {error ? (
            <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive">
              {error}
            </p>
          ) : null}
          <Button size="lg" className="w-full rounded-2xl" onClick={save}>
            Save income
          </Button>
        </div>
      )}
    </ResponsiveSheet>
  );
}
