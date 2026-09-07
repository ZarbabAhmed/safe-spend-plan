import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { MonthSelector } from "@/components/money/MonthSelector";
import { MoneyText } from "@/components/money/MoneyText";
import { ProgressMeter } from "@/components/money/ProgressMeter";
import { StatusPill } from "@/components/money/StatusPill";
import { CategoryIcon } from "@/components/money/CategoryIcon";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-store";
import { summarize } from "@/lib/finance/calc";
import { monthLabel, shiftMonth } from "@/lib/finance/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/review")({
  head: () => ({
    meta: [
      { title: "Monthly review — Nisaab" },
      { name: "description", content: "How the month actually went: income, spending, savings and what to change next." },
      { property: "og:title", content: "Monthly review — Nisaab" },
      { property: "og:description", content: "A calm, honest look back at your month." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const { state, month, summary } = useApp();
  const previous = summarize(state, shiftMonth(month, -1));
  const spentDelta = summary.totalSpent - previous.totalSpent;
  const savedDelta =
    summary.savedThisMonth + summary.emergencyContributed + summary.goalContributed - previous.savedThisMonth;

  const best = [...summary.lines]
    .filter((l) => l.planned > 0)
    .sort((a, b) => a.actual / a.planned - b.actual / b.planned)[0];
  const worst = [...summary.lines]
    .filter((l) => l.planned > 0)
    .sort((a, b) => b.actual / b.planned - a.actual / a.planned)[0];

  return (
    <div className="space-y-5 py-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Monthly review</h1>
          <p className="text-sm text-muted-foreground">{monthLabel(month)}</p>
        </div>
        <MonthSelector compact />
      </header>

      <section className="rounded-3xl bg-gradient-hero p-6 text-white shadow-hero">
        <p className="text-xs font-bold tracking-wide text-white/75 uppercase">Left at the end</p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight">
          <MoneyText value={summary.remaining} animate />
        </p>
        <p className="mt-2 text-sm text-white/80">
          You brought in <MoneyText value={summary.totalIncome} /> and spent <MoneyText value={summary.totalSpent} />.
        </p>
        <StatusPill health={summary.status} onDark className="mt-4">
          {summary.statusLabel}
        </StatusPill>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Delta label="Spending" value={spentDelta} goodWhenNegative />
        <Delta label="Saving" value={savedDelta} />
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-card">
        <h2 className="text-sm font-extrabold">Category performance</h2>
        <div className="mt-4 space-y-4">
          {summary.lines
            .filter((l) => l.planned > 0 || l.actual > 0)
            .map((line) => (
              <div key={line.id} className="flex items-center gap-3">
                <CategoryIcon icon={line.icon} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-bold">{line.name}</span>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground tabular">
                      <MoneyText value={line.actual} /> / <MoneyText value={line.planned} />
                    </span>
                  </div>
                  <ProgressMeter value={line.progress} health={line.health} className="mt-2" label={line.name} />
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-card">
        <h2 className="text-sm font-extrabold">What stood out</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {best ? (
            <li className="flex gap-2">
              <span className="text-success">•</span>
              <span>
                <span className="font-bold">{best.name}</span> stayed comfortably inside its plan.
              </span>
            </li>
          ) : null}
          {worst && worst.actual > worst.planned ? (
            <li className="flex gap-2">
              <span className="text-destructive">•</span>
              <span>
                <span className="font-bold">{worst.name}</span> went over by{" "}
                <MoneyText value={worst.actual - worst.planned} className="font-bold" />. Raising that budget or
                trimming it next month would balance things.
              </span>
            </li>
          ) : (
            <li className="flex gap-2">
              <span className="text-success">•</span>
              <span>Nothing went over plan this month — that's a strong result.</span>
            </li>
          )}
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              You set aside{" "}
              <MoneyText
                value={summary.savedThisMonth + summary.emergencyContributed + summary.goalContributed}
                className="font-bold"
              />{" "}
              toward your future.
            </span>
          </li>
        </ul>
      </section>

      <Link
        to="/app/budget"
        className="flex items-center justify-between rounded-3xl border bg-card p-5 shadow-card transition-colors hover:border-primary/40"
      >
        <span>
          <span className="block text-sm font-bold">Plan next month</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Carry what worked forward and adjust what didn't.
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>

      <Button asChild variant="outline" size="lg" className="h-13 w-full rounded-2xl font-bold">
        <Link to="/app">Back to dashboard</Link>
      </Button>
    </div>
  );
}

function Delta({
  label,
  value,
  goodWhenNegative = false,
}: {
  label: string;
  value: number;
  goodWhenNegative?: boolean;
}) {
  const positive = value >= 0;
  const good = goodWhenNegative ? !positive : positive;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-2xl border bg-card px-4 py-3.5 shadow-card">
      <p className="text-[11px] font-bold text-muted-foreground">{label} vs last month</p>
      <p className={cn("mt-1 flex items-center gap-1.5 text-lg font-extrabold tabular", good ? "text-success" : "text-destructive")}>
        <Icon className="size-4" aria-hidden />
        {positive ? "+" : "−"}
        <MoneyText value={Math.abs(value)} />
      </p>
    </div>
  );
}
