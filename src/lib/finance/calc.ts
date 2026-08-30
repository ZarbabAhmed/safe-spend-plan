/**
 * The single source of financial truth.
 *
 * Every screen reads derived numbers from here — no screen recomputes money.
 * Safe to Spend lives in one isolated function so the formula can be refined
 * later without touching a single component.
 */
import type { AppState, Goal, MonthPlan, Transaction } from "./types";
import { daysInMonth, monthKey, monthsBetween } from "./format";

export type Health = "good" | "warn" | "over";

export interface CategoryLine {
  id: string;
  name: string;
  kind: "fixed" | "variable";
  icon: string;
  planned: number;
  actual: number;
  remaining: number;
  progress: number;
  health: Health;
}

export interface MonthSummary {
  month: string;
  plan: MonthPlan;
  /** salary + extra income + carry forward */
  totalIncome: number;
  plannedIncome: number;
  extraIncome: number;
  carryForward: number;
  fixedPlanned: number;
  fixedActual: number;
  variablePlanned: number;
  variableActual: number;
  totalSpent: number;
  savingsTarget: number;
  savedThisMonth: number;
  goalAllocation: number;
  goalContributed: number;
  emergencyContributed: number;
  /** income minus every planned allocation */
  flexible: number;
  /** income minus everything already gone */
  remaining: number;
  safeToSpend: number;
  dailySafe: number;
  lines: CategoryLine[];
  status: Health;
  statusLabel: string;
  daysLeft: number;
  isCurrentMonth: boolean;
}

export function emptyPlan(month: string): MonthPlan {
  return { month, income: 0, salaryDay: 1, planned: {}, savingsTarget: 0, goalAllocation: 0, carryForward: 0 };
}

export function getPlan(state: AppState, month: string): MonthPlan {
  const exact = state.plans.find((p) => p.month === month);
  if (exact) return exact;
  // Recurring commitments continue into future months automatically.
  const previous = [...state.plans].filter((p) => p.month < month).sort((a, b) => a.month.localeCompare(b.month)).pop();
  if (previous) return { ...previous, month, carryForward: 0 };
  return emptyPlan(month);
}

export function txnsForMonth(state: AppState, month: string): Transaction[] {
  return state.transactions.filter((t) => t.date.slice(0, 7) === month);
}

export function healthFor(actual: number, planned: number, elapsedShare = 1): Health {
  if (planned <= 0) return actual > 0 ? "warn" : "good";
  const ratio = actual / planned;
  if (ratio > 1) return "over";
  if (ratio > Math.max(0.8, elapsedShare)) return "warn";
  return "good";
}

export const HEALTH_LABEL: Record<Health, string> = {
  good: "On track",
  warn: "Getting close",
  over: "Over budget",
};

/**
 * Safe to Spend — deliberately isolated.
 *
 * available money already tracked
 *   − commitments still due this period
 *   − savings still required
 *   − goal contributions still planned
 * = room to spend without damaging the plan.
 */
export function computeSafeToSpend(input: {
  totalIncome: number;
  totalSpent: number;
  savedThisMonth: number;
  fixedRemaining: number;
  savingsRemaining: number;
  goalRemaining: number;
}): number {
  const available = input.totalIncome - input.totalSpent - input.savedThisMonth;
  return available - input.fixedRemaining - input.savingsRemaining - input.goalRemaining;
}

export function summarize(state: AppState, month: string): MonthSummary {
  const plan = getPlan(state, month);
  const txns = txnsForMonth(state, month);
  const deposits = state.savingsDeposits.filter((d) => d.month === month);

  const salaryReceived = txns
    .filter((t) => t.type === "income" && t.incomeKind === "salary")
    .reduce((s, t) => s + t.amount, 0);
  const extraIncome = txns
    .filter((t) => t.type === "income" && t.incomeKind !== "salary")
    .reduce((s, t) => s + t.amount, 0);
  const plannedIncome = Math.max(plan.income, salaryReceived);
  const totalIncome = plannedIncome + extraIncome + plan.carryForward;

  const spentBy = new Map<string, number>();
  for (const t of txns) {
    if (t.type !== "expense") continue;
    spentBy.set(t.categoryId, (spentBy.get(t.categoryId) ?? 0) + t.amount);
  }

  const now = new Date();
  const isCurrentMonth = monthKey(now) === month;
  const total = daysInMonth(month);
  const dayOfMonth = isCurrentMonth ? now.getDate() : total;
  const elapsedShare = dayOfMonth / total;
  const daysLeft = Math.max(total - dayOfMonth + 1, 0);

  const lines: CategoryLine[] = state.categories.map((c) => {
    const planned = plan.planned[c.id] ?? 0;
    const actual = spentBy.get(c.id) ?? 0;
    return {
      id: c.id,
      name: c.name,
      kind: c.kind,
      icon: c.icon,
      planned,
      actual,
      remaining: planned - actual,
      progress: planned > 0 ? Math.min(actual / planned, 1.5) : actual > 0 ? 1.5 : 0,
      health: healthFor(actual, planned, c.kind === "variable" ? elapsedShare : 1),
    };
  });

  const sum = (kind: "fixed" | "variable", field: "planned" | "actual") =>
    lines.filter((l) => l.kind === kind).reduce((s, l) => s + l[field], 0);

  const fixedPlanned = sum("fixed", "planned");
  const fixedActual = sum("fixed", "actual");
  const variablePlanned = sum("variable", "planned");
  const variableActual = sum("variable", "actual");
  const totalSpent = fixedActual + variableActual;

  const savedThisMonth = deposits.filter((d) => d.target === "savings").reduce((s, d) => s + d.amount, 0);
  const emergencyContributed = deposits.filter((d) => d.target === "emergency").reduce((s, d) => s + d.amount, 0);
  const goalContributed = deposits.filter((d) => d.target === "goal").reduce((s, d) => s + d.amount, 0);

  const fixedRemaining = Math.max(fixedPlanned - fixedActual, 0);
  const savingsRemaining = Math.max(plan.savingsTarget - savedThisMonth - emergencyContributed, 0);
  const goalRemaining = Math.max(plan.goalAllocation - goalContributed, 0);

  const safeToSpend = computeSafeToSpend({
    totalIncome,
    totalSpent,
    savedThisMonth: savedThisMonth + emergencyContributed + goalContributed,
    fixedRemaining,
    savingsRemaining,
    goalRemaining,
  });

  const flexible = totalIncome - fixedPlanned - variablePlanned - plan.savingsTarget - plan.goalAllocation;
  const remaining = totalIncome - totalSpent - savedThisMonth - emergencyContributed - goalContributed;

  const status: Health =
    safeToSpend < 0 ? "over" : healthFor(variableActual, variablePlanned, elapsedShare);
  const statusLabel =
    status === "good"
      ? "You're on track"
      : status === "warn"
        ? "Spending a little fast"
        : "Past your plan";

  return {
    month,
    plan,
    totalIncome,
    plannedIncome,
    extraIncome,
    carryForward: plan.carryForward,
    fixedPlanned,
    fixedActual,
    variablePlanned,
    variableActual,
    totalSpent,
    savingsTarget: plan.savingsTarget,
    savedThisMonth,
    goalAllocation: plan.goalAllocation,
    goalContributed,
    emergencyContributed,
    flexible,
    remaining,
    safeToSpend,
    dailySafe: daysLeft > 0 ? safeToSpend / daysLeft : safeToSpend,
    lines,
    status,
    statusLabel,
    daysLeft,
    isCurrentMonth,
  };
}

export interface WeekSummary {
  safe: number;
  spent: number;
  remaining: number;
  status: Health;
  message: string;
  weekStart: string;
  weekEnd: string;
}

export function summarizeWeek(state: AppState, month: string): WeekSummary {
  const s = summarize(state, month);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const spent = state.transactions
    .filter((t) => t.type === "expense" && t.date >= iso(start) && t.date <= iso(end))
    .reduce((sum, t) => sum + t.amount, 0);

  const weeksLeft = Math.max(Math.ceil(s.daysLeft / 7), 1);
  const safe = Math.max(s.safeToSpend + spent, 0) / weeksLeft;
  const remaining = safe - spent;
  const status: Health = remaining < 0 ? "over" : spent / Math.max(safe, 1) > 0.8 ? "warn" : "good";

  return {
    safe,
    spent,
    remaining,
    status,
    message:
      status === "good"
        ? "You're within your weekly plan."
        : status === "warn"
          ? "You're close to this week's plan."
          : "You're spending faster than planned.",
    weekStart: iso(start),
    weekEnd: iso(end),
  };
}

export interface GoalProgress {
  goal: Goal;
  progress: number;
  remaining: number;
  monthsLeft: number | null;
  etaLabel: string;
  nextMilestone: number | null;
}

export function goalProgress(goal: Goal): GoalProgress {
  const progress = goal.target > 0 ? Math.min(goal.saved / goal.target, 1) : 0;
  const remaining = Math.max(goal.target - goal.saved, 0);
  const monthsLeft = goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : null;
  const next = [...goal.milestones].sort((a, b) => a.amount - b.amount).find((m) => m.amount > goal.saved);
  return {
    goal,
    progress,
    remaining,
    monthsLeft,
    etaLabel:
      remaining === 0
        ? "Goal reached"
        : monthsLeft === null
          ? "Add a monthly contribution to see an estimate"
          : monthsLeft <= 1
            ? "About 1 month to go"
            : `${monthsLeft} months to go`,
    nextMilestone: next ? next.amount : null,
  };
}

export function defaultMilestones(target: number): { amount: number }[] {
  return [0.2, 0.4, 0.6, 0.8, 1].map((p) => ({ amount: Math.round((target * p) / 1000) * 1000 }));
}

export function emergencyProgress(state: AppState) {
  const { target, current, monthlyContribution } = state.emergency;
  const progress = target > 0 ? Math.min(current / target, 1) : 0;
  const remaining = Math.max(target - current, 0);
  const monthsLeft = monthlyContribution > 0 ? Math.ceil(remaining / monthlyContribution) : null;
  return { target, current, progress, remaining, monthsLeft };
}

export function monthsToTarget(remaining: number, monthly: number): number | null {
  if (monthly <= 0) return null;
  return Math.ceil(remaining / monthly);
}

export function etaFromDate(targetDate?: string): number | null {
  if (!targetDate) return null;
  return Math.max(monthsBetween(new Date().toISOString(), targetDate), 0);
}
