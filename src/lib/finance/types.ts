/**
 * Domain types for the money-control system.
 * Pure data shapes — no UI, no storage. Designed so a real backend can map
 * onto these records one-to-one later (each entity carries a stable id).
 */

export type UserType = "job" | "business";

export type CategoryKind = "fixed" | "variable";

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  /** lucide icon key, resolved in the UI layer */
  icon: string;
  /** whether the user can delete it */
  custom?: boolean;
}

export interface Profile {
  name: string;
  email?: string;
  phone?: string;
  userType: UserType;
  currency: string;
  pinLength: 4 | 6;
  biometric: boolean;
  createdAt: string;
}

/** Planned amounts per category for a given month. */
export interface MonthPlan {
  /** yyyy-MM */
  month: string;
  income: number;
  salaryDay: number;
  /** categoryId -> planned amount */
  planned: Record<string, number>;
  savingsTarget: number;
  goalAllocation: number;
  /** actual money carried in from the previous month */
  carryForward: number;
}

export type TransactionType = "expense" | "income";
export type IncomeKind = "salary" | "bonus" | "freelance" | "other";
export type PaymentMethod = "cash" | "card" | "bank" | "wallet";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  /** expense: category id. income: income kind. */
  categoryId: string;
  incomeKind?: IncomeKind;
  /** ISO date (yyyy-MM-dd) */
  date: string;
  method?: PaymentMethod;
  note?: string;
  createdAt: string;
}

export interface Milestone {
  amount: number;
  label?: string;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  target: number;
  saved: number;
  monthlyContribution: number;
  targetDate?: string;
  createdAt: string;
  milestones: Milestone[];
}

export interface EmergencyFund {
  target: number;
  current: number;
  monthlyContribution: number;
}

export interface AppState {
  version: number;
  onboarded: boolean;
  authenticated: boolean;
  tourSeen: boolean;
  theme: "light" | "dark" | "system";
  profile: Profile;
  categories: Category[];
  plans: MonthPlan[];
  transactions: Transaction[];
  goals: Goal[];
  emergency: EmergencyFund;
  /** money moved into general savings, by month */
  savingsDeposits: { id: string; month: string; amount: number; date: string }[];
}
