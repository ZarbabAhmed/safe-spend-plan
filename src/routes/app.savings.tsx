import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PiggyBank, Plus, ShieldCheck, Target } from "lucide-react";
import { toast } from "sonner";
import type { DepositTarget } from "@/lib/finance/types";
import { MonthSelector } from "@/components/money/MonthSelector";
import { MoneyText } from "@/components/money/MoneyText";
import { ProgressMeter } from "@/components/money/ProgressMeter";
import { CurrencyInput } from "@/components/money/CurrencyInput";
import { ResponsiveSheet } from "@/components/common/ResponsiveSheet";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-store";
import { emergencyProgress } from "@/lib/finance/calc";
import { formatDay, monthLabel } from "@/lib/finance/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/savings")({
  head: () => ({
    meta: [
      { title: "Savings — Nisaab" },
      { name: "description", content: "Monthly savings, emergency fund and goal contributions kept clearly separate." },
      { property: "og:title", content: "Savings — Nisaab" },
      { property: "og:description", content: "Watch your safety net and savings grow month by month." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SavingsPage,
});

function SavingsPage() {
  const { state, month, summary, actions } = useApp();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [target, setTarget] = useState<DepositTarget>("savings");
  const [goalId, setGoalId] = useState(state.goals[0]?.id ?? "");
  const [editTarget, setEditTarget] = useState(false);
  const [emergencyTarget, setEmergencyTarget] = useState(state.emergency.target);

  const emergency = emergencyProgress(state);
  const deposits = state.savingsDeposits.filter((d) => d.month === month);

  const save = () => {
    if (amount <= 0) return;
    actions.addDeposit({
      amount,
      target,
      ...(target === "goal" && goalId ? { goalId } : {}),
    });
    toast.success("Money set aside", { description: "Well done — that's future you taken care of." });
    setAmount(0);
    setOpen(false);
  };

  return (
    <div className="space-y-5 py-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Savings</h1>
          <p className="text-sm text-muted-foreground">{monthLabel(month)}</p>
        </div>
        <MonthSelector compact />
      </header>

      <section className="rounded-3xl bg-gradient-hero p-6 text-white shadow-hero">
        <p className="text-xs font-bold tracking-wide text-white/75 uppercase">Saved this month</p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight">
          <MoneyText value={summary.savedThisMonth + summary.emergencyContributed + summary.goalContributed} animate />
        </p>
        <p className="mt-2 text-sm text-white/80">
          Your target is <MoneyText value={summary.savingsTarget} /> a month.
        </p>
        <ProgressMeter
          value={summary.savingsTarget > 0 ? summary.savedThisMonth / summary.savingsTarget : 0}
          className="mt-4 bg-white/25"
          label="Savings progress"
        />
      </section>

      <Button size="lg" className="h-13 w-full rounded-2xl font-bold" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Set money aside
      </Button>

      <section className="rounded-3xl border bg-card p-5 shadow-card">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-extrabold">Emergency fund</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {emergency.monthsLeft
                ? `About ${emergency.monthsLeft} months to fully funded.`
                : "Add a monthly amount to see an estimate."}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full font-bold" onClick={() => setEditTarget(true)}>
            Edit
          </Button>
        </div>
        <p className="mt-4 text-2xl font-extrabold tabular">
          <MoneyText value={emergency.current} /> <span className="text-sm font-semibold text-muted-foreground">
            of <MoneyText value={emergency.target} />
          </span>
        </p>
        <ProgressMeter value={emergency.progress} gradient className="mt-3" label="Emergency fund" />
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-card">
        <h2 className="text-sm font-extrabold">Where it went this month</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Split label="Savings" value={summary.savedThisMonth} icon={<PiggyBank className="size-4" />} />
          <Split label="Emergency" value={summary.emergencyContributed} icon={<ShieldCheck className="size-4" />} />
          <Split label="Goals" value={summary.goalContributed} icon={<Target className="size-4" />} />
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-card">
        <h2 className="mb-4 text-sm font-extrabold">Deposits</h2>
        {deposits.length === 0 ? (
          <EmptyState
            icon={<PiggyBank className="size-6" />}
            title="Nothing set aside yet"
            description="Even a small amount this month keeps the habit alive."
            action={
              <Button className="rounded-2xl font-bold" onClick={() => setOpen(true)}>
                Set money aside
              </Button>
            }
            className="border-0 bg-transparent py-4"
          />
        ) : (
          <div className="divide-y">
            {deposits.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-bold capitalize">{d.target === "goal" ? "Goal contribution" : d.target}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDay(d.date)}
                    {d.note ? ` · ${d.note}` : ""}
                  </p>
                </div>
                <p className="text-sm font-extrabold tabular text-success">
                  +<MoneyText value={d.amount} />
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <ResponsiveSheet open={open} onOpenChange={setOpen} title="Set money aside" description="Choose where it should go.">
        <div className="space-y-5">
          <CurrencyInput value={amount === 0 ? "" : amount} onChange={setAmount} size="lg" autoFocus label="Amount" />
          <div className="grid gap-2">
            {(
              [
                { id: "savings", label: "General savings" },
                { id: "emergency", label: "Emergency fund" },
                { id: "goal", label: "A goal" },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setTarget(o.id)}
                aria-pressed={target === o.id}
                disabled={o.id === "goal" && state.goals.length === 0}
                className={cn(
                  "rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition-colors disabled:opacity-40",
                  target === o.id ? "border-primary bg-accent" : "hover:border-primary/40",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          {target === "goal" && state.goals.length > 0 ? (
            <div className="grid gap-2">
              {state.goals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoalId(g.id)}
                  aria-pressed={goalId === g.id}
                  className={cn(
                    "rounded-2xl border px-4 py-2.5 text-left text-sm font-semibold transition-colors",
                    goalId === g.id ? "border-primary bg-accent" : "hover:border-primary/40",
                  )}
                >
                  {g.name}
                </button>
              ))}
            </div>
          ) : null}
          <Button size="lg" className="w-full rounded-2xl font-bold" onClick={save}>
            Save it
          </Button>
        </div>
      </ResponsiveSheet>

      <ResponsiveSheet
        open={editTarget}
        onOpenChange={setEditTarget}
        title="Emergency fund target"
        description="How big should your safety net be?"
      >
        <div className="space-y-5">
          <CurrencyInput
            value={emergencyTarget === 0 ? "" : emergencyTarget}
            onChange={setEmergencyTarget}
            size="lg"
            autoFocus
            label="Target amount"
          />
          <Button
            size="lg"
            className="w-full rounded-2xl font-bold"
            onClick={() => {
              actions.setEmergency({ target: emergencyTarget });
              toast.success("Target updated");
              setEditTarget(false);
            }}
          >
            Save target
          </Button>
        </div>
      </ResponsiveSheet>
    </div>
  );
}

function Split({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted px-2 py-3">
      <span className="mx-auto mb-1 flex size-8 items-center justify-center rounded-lg bg-card text-primary">
        {icon}
      </span>
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-extrabold tabular">
        <MoneyText value={value} compact />
      </p>
    </div>
  );
}
