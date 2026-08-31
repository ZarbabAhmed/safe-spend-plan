import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  Category,
  DepositTarget,
  Goal,
  Transaction,
} from "@/lib/finance/types";
import { initialState, newId, buildStateFromOnboarding, type OnboardingAnswers } from "@/lib/finance/seed";
import { defaultMilestones, getPlan, summarize } from "@/lib/finance/calc";
import { monthKey } from "@/lib/finance/format";
import { localRepository, type StateRepository } from "./repository";

interface StoreValue {
  state: AppState;
  ready: boolean;
  month: string;
  setMonth: (m: string) => void;
  summary: ReturnType<typeof summarize>;
  actions: {
    completeOnboarding: (answers: OnboardingAnswers) => void;
    signIn: () => void;
    signOut: () => void;
    deleteAccount: () => void;
    markTourSeen: () => void;
    restartTour: () => void;
    setTheme: (theme: AppState["theme"]) => void;
    updateProfile: (patch: Partial<AppState["profile"]>) => void;
    addTransaction: (txn: Omit<Transaction, "id" | "createdAt">) => void;
    updateTransaction: (id: string, patch: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;
    setPlanned: (month: string, categoryId: string, amount: number) => void;
    setPlanField: (month: string, patch: Partial<{ income: number; savingsTarget: number; goalAllocation: number }>) => void;
    addCategory: (name: string, kind: Category["kind"]) => void;
    removeCategory: (id: string) => void;
    addDeposit: (input: { amount: number; target: DepositTarget; goalId?: string; date?: string; note?: string }) => void;
    addGoal: (goal: Omit<Goal, "id" | "createdAt" | "milestones"> & { milestones?: Goal["milestones"] }) => string;
    updateGoal: (id: string, patch: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;
    setEmergency: (patch: Partial<AppState["emergency"]>) => void;
  };
}

const StoreContext = createContext<StoreValue | null>(null);

export function AppStoreProvider({
  children,
  repository = localRepository,
}: {
  children: ReactNode;
  repository?: StateRepository;
}) {
  const [state, setState] = useState<AppState>(() => initialState());
  const [ready, setReady] = useState(false);
  const [month, setMonth] = useState(() => monthKey(new Date()));

  useEffect(() => {
    let active = true;
    void repository.load().then((loaded) => {
      if (!active) return;
      if (loaded) setState({ ...initialState(), ...loaded });
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [repository]);

  useEffect(() => {
    if (!ready) return;
    void repository.save(state);
  }, [state, ready, repository]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prefersDark =
      state.theme === "dark" ||
      (state.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, [state.theme]);

  const patchPlan = useCallback(
    (target: string, patch: (plan: ReturnType<typeof getPlan>) => ReturnType<typeof getPlan>) => {
      setState((prev) => {
        const base = getPlan(prev, target);
        const next = patch({ ...base, month: target, planned: { ...base.planned } });
        const exists = prev.plans.some((p) => p.month === target);
        return {
          ...prev,
          plans: exists ? prev.plans.map((p) => (p.month === target ? next : p)) : [...prev.plans, next],
        };
      });
    },
    [],
  );

  const actions = useMemo<StoreValue["actions"]>(
    () => ({
      completeOnboarding: (answers) => setState((prev) => buildStateFromOnboarding(answers, prev)),
      signIn: () => setState((prev) => ({ ...prev, authenticated: true })),
      signOut: () => setState((prev) => ({ ...prev, authenticated: false })),
      deleteAccount: () => {
        void repository.clear();
        setState(initialState());
      },
      markTourSeen: () => setState((prev) => ({ ...prev, tourSeen: true })),
      restartTour: () => setState((prev) => ({ ...prev, tourSeen: false })),
      setTheme: (theme) => setState((prev) => ({ ...prev, theme })),
      updateProfile: (patch) => setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } })),
      addTransaction: (txn) =>
        setState((prev) => ({
          ...prev,
          transactions: [{ ...txn, id: newId("txn"), createdAt: new Date().toISOString() }, ...prev.transactions],
        })),
      updateTransaction: (id, patch) =>
        setState((prev) => ({
          ...prev,
          transactions: prev.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      deleteTransaction: (id) =>
        setState((prev) => ({ ...prev, transactions: prev.transactions.filter((t) => t.id !== id) })),
      setPlanned: (target, categoryId, amount) =>
        patchPlan(target, (plan) => ({ ...plan, planned: { ...plan.planned, [categoryId]: amount } })),
      setPlanField: (target, patch) => patchPlan(target, (plan) => ({ ...plan, ...patch })),
      addCategory: (name, kind) =>
        setState((prev) => ({
          ...prev,
          categories: [
            ...prev.categories,
            { id: newId("cat"), name, kind, icon: kind === "fixed" ? "receipt" : "tag", custom: true },
          ],
        })),
      removeCategory: (id) =>
        setState((prev) => ({ ...prev, categories: prev.categories.filter((c) => c.id !== id) })),
      addDeposit: ({ amount, target, goalId, date, note }) =>
        setState((prev) => {
          const when = date ?? new Date().toISOString().slice(0, 10);
          const deposit = {
            id: newId("dep"),
            month: when.slice(0, 7),
            amount,
            date: when,
            target,
            ...(goalId ? { goalId } : {}),
            ...(note ? { note } : {}),
          };
          return {
            ...prev,
            savingsDeposits: [deposit, ...prev.savingsDeposits],
            emergency:
              target === "emergency"
                ? { ...prev.emergency, current: prev.emergency.current + amount }
                : prev.emergency,
            goals:
              target === "goal" && goalId
                ? prev.goals.map((g) => (g.id === goalId ? { ...g, saved: g.saved + amount } : g))
                : prev.goals,
          };
        }),
      addGoal: (goal) => {
        const id = newId("goal");
        setState((prev) => ({
          ...prev,
          goals: [
            ...prev.goals,
            {
              ...goal,
              id,
              createdAt: new Date().toISOString(),
              milestones: goal.milestones ?? defaultMilestones(goal.target),
            },
          ],
        }));
        return id;
      },
      updateGoal: (id, patch) =>
        setState((prev) => ({ ...prev, goals: prev.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      deleteGoal: (id) => setState((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) })),
      setEmergency: (patch) => setState((prev) => ({ ...prev, emergency: { ...prev.emergency, ...patch } })),
    }),
    [patchPlan, repository],
  );

  const summary = useMemo(() => summarize(state, month), [state, month]);

  const value = useMemo<StoreValue>(
    () => ({ state, ready, month, setMonth, summary, actions }),
    [state, ready, month, summary, actions],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useApp(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}

export function useCurrency(): string {
  return useApp().state.profile.currency;
}
