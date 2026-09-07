import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MoneyText } from "@/components/money/MoneyText";
import { ProgressMeter } from "@/components/money/ProgressMeter";
import { CategoryIcon } from "@/components/money/CategoryIcon";
import { CurrencyInput } from "@/components/money/CurrencyInput";
import { ResponsiveSheet } from "@/components/common/ResponsiveSheet";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-store";
import { goalProgress } from "@/lib/finance/calc";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/goals/$goalId")({
  head: () => ({
    meta: [
      { title: "Goal — Nisaab" },
      { name: "description", content: "Milestones, progress and estimated completion for this savings goal." },
      { property: "og:title", content: "Goal — Nisaab" },
      { property: "og:description", content: "See how close you are and what it takes to finish." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GoalDetail,
});

function GoalDetail() {
  const { goalId } = Route.useParams();
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const goal = state.goals.find((g) => g.id === goalId);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  if (!goal) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-lg font-extrabold">Goal not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">It may have been deleted.</p>
        <Button asChild className="mt-6 rounded-2xl font-bold">
          <Link to="/app/goals">Back to goals</Link>
        </Button>
      </div>
    );
  }

  const p = goalProgress(goal);

  return (
    <div className="space-y-5 py-5">
      <header className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/app/goals" aria-label="Back to goals">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="flex-1 truncate text-xl font-extrabold tracking-tight">{goal.name}</h1>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground"
          aria-label="Delete goal"
          onClick={() => {
            actions.deleteGoal(goal.id);
            toast.success("Goal removed");
            void navigate({ to: "/app/goals" });
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      </header>

      <section className="rounded-3xl bg-gradient-hero p-6 text-white shadow-hero">
        <div className="flex items-center gap-3">
          <CategoryIcon icon={goal.icon} className="size-11 rounded-2xl bg-white/15 text-white" />
          <div>
            <p className="text-xs font-bold tracking-wide text-white/75 uppercase">Saved so far</p>
            <p className="text-3xl font-extrabold tracking-tight">
              <MoneyText value={goal.saved} animate />
            </p>
          </div>
        </div>
        <ProgressMeter value={p.progress} className="mt-5 bg-white/25" label={goal.name} />
        <div className="mt-3 flex items-center justify-between text-sm text-white/85">
          <span>{Math.round(p.progress * 100)}% of <MoneyText value={goal.target} /></span>
          <span>{p.etaLabel}</span>
        </div>
      </section>

      <Button size="lg" className="h-13 w-full rounded-2xl font-bold" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Add to this goal
      </Button>

      <section className="rounded-3xl border bg-card p-5 shadow-card">
        <h2 className="text-sm font-extrabold">Milestones</h2>
        <ol className="mt-4 space-y-3">
          {[...goal.milestones]
            .sort((a, b) => a.amount - b.amount)
            .map((m) => {
              const done = goal.saved >= m.amount;
              return (
                <li key={m.amount} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                      done ? "border-transparent bg-gradient-brand text-white" : "text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-4" /> : ""}
                  </span>
                  <span className={cn("text-sm font-bold tabular", !done && "text-muted-foreground")}>
                    <MoneyText value={m.amount} />
                  </span>
                  {done ? <span className="ml-auto text-xs font-semibold text-success">Reached</span> : null}
                </li>
              );
            })}
        </ol>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Info label="Monthly contribution" value={goal.monthlyContribution} />
        <Info label="Still needed" value={p.remaining} />
      </section>

      <ResponsiveSheet open={open} onOpenChange={setOpen} title={`Add to ${goal.name}`} description="Every bit counts.">
        <div className="space-y-5">
          <CurrencyInput value={amount === 0 ? "" : amount} onChange={setAmount} size="lg" autoFocus label="Amount" />
          <Button
            size="lg"
            className="w-full rounded-2xl font-bold"
            onClick={() => {
              if (amount <= 0) return;
              actions.addDeposit({ amount, target: "goal", goalId: goal.id });
              toast.success("Added to your goal", { description: p.remaining - amount <= 0 ? "That's the finish line!" : undefined });
              setAmount(0);
              setOpen(false);
            }}
          >
            Add it
          </Button>
        </div>
      </ResponsiveSheet>
    </div>
  );
}

function Info({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-card px-4 py-3 shadow-card">
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-extrabold tabular">
        <MoneyText value={value} />
      </p>
    </div>
  );
}
