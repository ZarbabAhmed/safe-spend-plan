import type { AppState, Goal, MonthPlan, Transaction } from "./types";
import { DEFAULT_CATEGORIES } from "./categories";
import { DEFAULT_CURRENCY } from "./currencies";
import { defaultMilestones } from "./calc";
import { monthKey, shiftMonth } from "./format";

export function initialState(): AppState {
  return {
    version: 1,
    onboarded: false,
    authenticated: false,
    tourSeen: false,
    theme: "light",
    profile: {
      name: "",
      userType: "job",
      currency: DEFAULT_CURRENCY,
      pinLength: 4,
      biometric: false,
      createdAt: new Date().toISOString(),
    },
    categories: DEFAULT_CATEGORIES,
    plans: [],
    transactions: [],
    goals: [],
    emergency: { target: 0, current: 0, monthlyContribution: 0 },
    savingsDeposits: [],
  };
}

export interface OnboardingAnswers {
  name: string;
  email?: string;
  phone?: string;
  userType: "job" | "business";
  currency: string;
  income: number;
  salaryDay: number;
  extraIncome: number;
  fixed: Record<string, number>;
  variable: Record<string, number>;
  savingsTarget: number;
  emergencyTarget: number;
  emergencyCurrent: number;
  goal?: { name: string; icon: string; target: number; saved: number; monthlyContribution: number; targetDate?: string };
  pinLength: 4 | 6;
  biometric: boolean;
}

let counter = 0;
export function newId(prefix = "id"): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}

/**
 * Builds a complete, believable state from the onboarding answers, including
 * two months of history so review, month switching, and trends are real.
 */
export function buildStateFromOnboarding(answers: OnboardingAnswers, base: AppState): AppState {
  const current = monthKey(new Date());
  const planned: Record<string, number> = { ...answers.fixed, ...answers.variable };
  const goalAllocation = answers.goal?.monthlyContribution ?? 0;

  const makePlan = (month: string, carryForward: number): MonthPlan => ({
    month,
    income: answers.income,
    salaryDay: answers.salaryDay,
    planned,
    savingsTarget: answers.savingsTarget,
    goalAllocation,
    carryForward,
  });

  const months = [shiftMonth(current, -2), shiftMonth(current, -1), current];
  const plans = months.map((m, i) => makePlan(m, i === 0 ? 0 : 0));

  const transactions: Transaction[] = [];
  const deposits: AppState["savingsDeposits"] = [];
  const variableIds = Object.keys(answers.variable).filter((k) => (answers.variable[k] ?? 0) > 0);
  const fixedIds = Object.keys(answers.fixed).filter((k) => (answers.fixed[k] ?? 0) > 0);
  const today = new Date();

  months.forEach((month, index) => {
    const isCurrent = index === months.length - 1;
    const [y, m] = month.split("-").map(Number);
    const lastDay = new Date(y!, m!, 0).getDate();
    const cutoff = isCurrent ? today.getDate() : lastDay;
    const share = cutoff / lastDay;

    // salary
    transactions.push({
      id: newId("txn"),
      type: "income",
      amount: answers.income,
      categoryId: "salary",
      incomeKind: "salary",
      date: `${month}-${String(Math.min(answers.salaryDay, lastDay)).padStart(2, "0")}`,
      note: "Monthly salary",
      createdAt: new Date().toISOString(),
    });

    // fixed commitments land early in the month
    fixedIds.forEach((id, i) => {
      const day = Math.min(2 + i * 2, cutoff);
      if (day > cutoff) return;
      transactions.push({
        id: newId("txn"),
        type: "expense",
        amount: answers.fixed[id] ?? 0,
        categoryId: id,
        date: `${month}-${String(day).padStart(2, "0")}`,
        method: "bank",
        createdAt: new Date().toISOString(),
      });
    });

    // variable spending spread across the elapsed part of the month
    variableIds.forEach((id, i) => {
      const budget = answers.variable[id] ?? 0;
      const factor = 0.62 + ((i * 17) % 45) / 100; // deterministic variety
      const total = Math.round(budget * share * factor);
      if (total <= 0) return;
      const slices = Math.min(4, Math.max(2, Math.round(total / Math.max(budget / 4, 1))));
      for (let s = 0; s < slices; s += 1) {
        const day = Math.max(1, Math.min(cutoff, Math.round(((s + 1) / (slices + 1)) * cutoff)));
        transactions.push({
          id: newId("txn"),
          type: "expense",
          amount: Math.round(total / slices),
          categoryId: id,
          date: `${month}-${String(day).padStart(2, "0")}`,
          method: s % 2 === 0 ? "card" : "cash",
          createdAt: new Date().toISOString(),
        });
      }
    });

    // savings + goal contributions
    if (answers.savingsTarget > 0) {
      deposits.push({
        id: newId("dep"),
        month,
        amount: isCurrent ? Math.round(answers.savingsTarget * 0.6) : answers.savingsTarget,
        date: `${month}-05`,
        target: "savings",
      });
    }
    if (goalAllocation > 0 && !isCurrent) {
      deposits.push({ id: newId("dep"), month, amount: goalAllocation, date: `${month}-06`, target: "goal" });
    }
  });

  const goals: Goal[] = answers.goal
    ? [
        {
          id: newId("goal"),
          name: answers.goal.name,
          icon: answers.goal.icon,
          target: answers.goal.target,
          saved: answers.goal.saved,
          monthlyContribution: answers.goal.monthlyContribution,
          targetDate: answers.goal.targetDate,
          createdAt: new Date().toISOString(),
          milestones: defaultMilestones(answers.goal.target),
        },
      ]
    : [];

  return {
    ...base,
    onboarded: true,
    authenticated: true,
    tourSeen: false,
    profile: {
      ...base.profile,
      name: answers.name,
      email: answers.email,
      phone: answers.phone,
      userType: answers.userType,
      currency: answers.currency,
      pinLength: answers.pinLength,
      biometric: answers.biometric,
    },
    plans,
    transactions: transactions.sort((a, b) => b.date.localeCompare(a.date)),
    savingsDeposits: deposits,
    goals,
    emergency: {
      target: answers.emergencyTarget,
      current: answers.emergencyCurrent,
      monthlyContribution: Math.round(answers.savingsTarget * 0.3),
    },
  };
}
