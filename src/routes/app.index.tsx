import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus, Receipt, Sparkles, TrendingUp } from "lucide-react";
import { MonthSelector } from "@/components/money/MonthSelector";
import { MoneyText } from "@/components/money/MoneyText";
import { ProgressMeter } from "@/components/money/ProgressMeter";
import { StatusPill } from "@/components/money/StatusPill";
import { CategoryIcon } from "@/components/money/CategoryIcon";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { EmptyState } from "@/components/common/EmptyState";
import { useQuickAdd } from "@/components/transactions/QuickAdd";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-store";
import { emergencyProgress, goalProgress, summarizeWeek, txnsForMonth } from "@/lib/finance/calc";
import { monthLabel } from "@/lib/finance/format";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nisaab" },
      { name: "description", content: "Your safe-to-spend number, budget health, savings and recent activity." },
      { property: "og:title", content: "Dashboard — Nisaab" },
      { property: "og:description", content: "See exactly where your money stands this month." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state, month, summary } = useApp();
  const { openExpense, openIncome } = useQuickAdd();
  const week = summarizeWeek(state, month);
  const goal = state.goals[0];
  const emergency = emergencyProgress(state);
  const recent = txnsForMonth(state, month).slice(0, 5);
  const variableLines = summary.lines.filter((l) => l.kind === "variable" && l.planned > 0).slice(0, 4);
  const firstName = state.profile.name.split(" ")[0] || "there";

  return (
    <div className="space-y-6 py-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Hello, {firstName}</p>
          <h1 className="text-xl font-extrabold tracking-tight">{monthLabel(month)}</h1>
        </div>
        <MonthSelector compact />
      </header>

      <section className="rounded-3xl bg-gradient-hero p-6 text-white shadow-hero animate-rise">
        <p className="text-xs font-bold tracking-wide text-white/75 uppercase">Safe to spend</p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
          <MoneyText value={Math.max(summary.safeToSpend, 0)} animate />
        </p>
        <p className="mt-2 text-sm text-white/80">
          {summary.safeToSpend >= 0
            ? `About ${new Intl.NumberFormat().format(Math.max(Math.round(summary.dailySafe), 0))} a day for the ${summary.daysLeft} days left.`
            : "You're past your plan for this month. Adjusting your budget can bring it back."}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill health={summary.status} onDark>
            {summary.statusLabel}
          </StatusPill>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
            {summary.daysLeft} days left
          </span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Income" value={summary.totalIncome} />
        <Stat label="Spent" value={summary.totalSpent} />
        <Stat label="Saved" value={summary.savedThisMonth + summary.emergencyContributed + summary.goalContributed} />
        <Stat label="Remaining" value={summary.remaining} />
      </section>

      <section className="flex gap-3">
        <Button size="lg" className="h-13 flex-1 rounded-2xl font-bold" onClick={openExpense}>
          <Plus className="size-4" />
          Add expense
        </Button>
        <Button size="lg" variant="outline" className="h-13 flex-1 rounded-2xl font-bold" onClick={openIncome}>
          <TrendingUp className="size-4" />
          Add income
        </Button>
      </section>

      <Card title="Budget health" action={{ to: "/app/budget", label: "Manage" }}>
        {variableLines.length === 0 ? (
          <EmptyState
            icon={<Receipt className="size-6" />}
            title="No budgets set yet"
            description="Set a monthly amount for your everyday categories to track them here."
            action={
              <Button asChild className="rounded-2xl font-bold">
                <Link to="/app/budget">Set up budget</Link>
              </Button>
            }
            className="border-0 bg-transparent py-6"
          />
        ) : (
          <div className="space-y-4">
            {variableLines.map((line) => (
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
        )}
      </Card>

      <Card title="This week">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-extrabold tabular">
              <MoneyText value={Math.max(week.remaining, 0)} />
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{week.message}</p>
          </div>
          <StatusPill health={week.status}>
            {week.status === "good" ? "Comfortable" : week.status === "warn" ? "Watch it" : "Over"}
          </StatusPill>
        </div>
        <ProgressMeter
          value={week.safe > 0 ? week.spent / week.safe : 0}
          health={week.status}
          className="mt-4"
          label="Weekly spending"
        />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Savings" action={{ to: "/app/savings", label: "Open" }}>
          <p className="text-2xl font-extrabold tabular">
            <MoneyText value={summary.savedThisMonth} />
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            of <MoneyText value={summary.savingsTarget} /> planned this month
          </p>
          <ProgressMeter
            value={summary.savingsTarget > 0 ? summary.savedThisMonth / summary.savingsTarget : 0}
            gradient
            className="mt-3"
            label="Savings progress"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Emergency fund: <MoneyText value={emergency.current} /> of <MoneyText value={emergency.target} />
          </p>
        </Card>

        <Card title="Goal" action={goal ? { to: "/app/goals", label: "All goals" } : undefined}>
          {goal ? (
            <>
              <div className="flex items-center gap-3">
                <CategoryIcon icon={goal.icon} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{goal.name}</p>
                  <p className="text-xs text-muted-foreground">{goalProgress(goal).etaLabel}</p>
                </div>
              </div>
              <p className="mt-3 text-2xl font-extrabold tabular">
                <MoneyText value={goal.saved} />
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                of <MoneyText value={goal.target} />
              </p>
              <ProgressMeter value={goalProgress(goal).progress} gradient className="mt-3" label={goal.name} />
            </>
          ) : (
            <EmptyState
              icon={<Sparkles className="size-6" />}
              title="No goal yet"
              description="Pick something worth saving for and watch it get closer."
              action={
                <Button asChild className="rounded-2xl font-bold">
                  <Link to="/app/goals">Create a goal</Link>
                </Button>
              }
              className="border-0 bg-transparent py-4"
            />
          )}
        </Card>
      </div>

      <Card title="Recent activity" action={{ to: "/app/transactions", label: "See all" }}>
        {recent.length === 0 ? (
          <EmptyState
            icon={<Receipt className="size-6" />}
            title="Nothing recorded yet"
            description="Add your first expense and your plan updates instantly."
            action={
              <Button className="rounded-2xl font-bold" onClick={openExpense}>
                Add expense
              </Button>
            }
            className="border-0 bg-transparent py-6"
          />
        ) : (
          <div className="divide-y">
            {recent.map((t) => (
              <TransactionRow key={t.id} txn={t} />
            ))}
          </div>
        )}
      </Card>

      <Link
        to="/app/review"
        className="flex items-center justify-between rounded-3xl border bg-card p-5 transition-colors hover:border-primary/40"
      >
        <span>
          <span className="block text-sm font-bold">Monthly review</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            See how {monthLabel(month, "short")} went and what to change next month.
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-card px-3 py-3.5 text-center shadow-card">
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-extrabold tabular">
        <MoneyText value={value} compact />
      </p>
    </div>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: { to: string; label: string } | undefined;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-extrabold">{title}</h2>
        {action ? (
          <Link to={action.to} className="text-xs font-bold text-primary underline-offset-4 hover:underline">
            {action.label}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
