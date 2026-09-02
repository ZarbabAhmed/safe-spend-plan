import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, Sparkles } from "lucide-react";
import { CURRENCIES } from "@/lib/finance/currencies";
import type { OnboardingAnswers } from "@/lib/finance/seed";
import { useApp } from "@/lib/store/app-store";
import { CurrencyInput } from "@/components/money/CurrencyInput";
import { CategoryIcon } from "@/components/money/CategoryIcon";
import { MoneyText } from "@/components/money/MoneyText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your plan — Nisaab" },
      { name: "description", content: "Tell Nisaab about your income, commitments and goals to build your monthly plan." },
      { property: "og:title", content: "Set up your plan — Nisaab" },
      { property: "og:description", content: "A few quick questions and your money plan is ready." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["You", "Income", "Commitments", "Everyday", "Savings", "Safety net", "Goal", "Ready"] as const;

const GOAL_ICONS = [
  { id: "car", label: "Car" },
  { id: "home", label: "Home" },
  { id: "plane", label: "Travel" },
  { id: "graduation", label: "Education" },
  { id: "heart", label: "Wedding" },
  { id: "target", label: "Other" },
];

function Onboarding() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const fixedCats = useMemo(() => state.categories.filter((c) => c.kind === "fixed"), [state.categories]);
  const variableCats = useMemo(() => state.categories.filter((c) => c.kind === "variable"), [state.categories]);

  const [name, setName] = useState(state.profile.name);
  const [userType, setUserType] = useState<"job" | "business">(state.profile.userType);
  const [currency, setCurrency] = useState(state.profile.currency);
  const [income, setIncome] = useState(0);
  const [salaryDay, setSalaryDay] = useState(1);
  const [extraIncome, setExtraIncome] = useState(0);
  const [fixed, setFixed] = useState<Record<string, number>>({});
  const [variable, setVariable] = useState<Record<string, number>>({});
  const [savingsTarget, setSavingsTarget] = useState(0);
  const [emergencyTarget, setEmergencyTarget] = useState(0);
  const [emergencyCurrent, setEmergencyCurrent] = useState(0);
  const [wantsGoal, setWantsGoal] = useState(true);
  const [goalName, setGoalName] = useState("");
  const [goalIcon, setGoalIcon] = useState("car");
  const [goalTarget, setGoalTarget] = useState(0);
  const [goalSaved, setGoalSaved] = useState(0);
  const [goalMonthly, setGoalMonthly] = useState(0);

  const sum = (rec: Record<string, number>) => Object.values(rec).reduce((s, v) => s + (v || 0), 0);
  const fixedTotal = sum(fixed);
  const variableTotal = sum(variable);
  const goalMonthlyEffective = wantsGoal && goalTarget > 0 ? goalMonthly : 0;
  const leftover = income + extraIncome - fixedTotal - variableTotal - savingsTarget - goalMonthlyEffective;

  const canContinue = (() => {
    switch (step) {
      case 0:
        return name.trim().length > 1;
      case 1:
        return income > 0;
      case 6:
        return !wantsGoal || (goalName.trim().length > 0 && goalTarget > 0);
      default:
        return true;
    }
  })();

  const finish = () => {
    const answers: OnboardingAnswers = {
      name: name.trim(),
      userType,
      currency,
      income,
      salaryDay,
      extraIncome,
      fixed,
      variable,
      savingsTarget,
      emergencyTarget,
      emergencyCurrent,
      pinLength: state.profile.pinLength,
      biometric: state.profile.biometric,
      ...(wantsGoal && goalTarget > 0
        ? {
            goal: {
              name: goalName.trim() || "My goal",
              icon: goalIcon,
              target: goalTarget,
              saved: goalSaved,
              monthlyContribution: goalMonthly,
            },
          }
        : {}),
    };
    actions.completeOnboarding(answers);
    void navigate({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Back"
              onClick={() => (step === 0 ? void navigate({ to: "/" }) : setStep(step - 1))}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex-1">
              <p className="text-xs font-bold text-muted-foreground">
                Step {step + 1} of {STEPS.length} · {STEPS[step]}
              </p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-brand transition-[width] duration-500"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-7 pb-36">
        <div key={step} className="animate-rise">
          {step === 0 && (
            <StepShell title="Let's get to know you" subtitle="This helps Nisaab speak to you, not at you.">
              <div className="space-y-1.5">
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  autoFocus
                  className="h-12 rounded-2xl"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold">How do you earn?</span>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: "job", title: "Salary", body: "I get paid monthly" },
                      { id: "business", title: "Business", body: "My income varies" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setUserType(o.id)}
                      aria-pressed={userType === o.id}
                      className={cn(
                        "rounded-2xl border-2 p-4 text-left transition-colors",
                        userType === o.id ? "border-primary bg-accent" : "hover:border-primary/40",
                      )}
                    >
                      <span className="block text-sm font-bold">{o.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{o.body}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="h-12 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} · {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell
              title="What comes in each month?"
              subtitle={userType === "job" ? "Your take-home salary after deductions." : "A typical month's income."}
            >
              <CurrencyInput value={income === 0 ? "" : income} onChange={setIncome} size="lg" autoFocus label="Monthly income" />
              <div className="space-y-1.5">
                <Label htmlFor="salaryDay">Day of month you get paid</Label>
                <Input
                  id="salaryDay"
                  type="number"
                  min={1}
                  max={31}
                  className="h-12 rounded-2xl"
                  value={salaryDay}
                  onChange={(e) => setSalaryDay(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
                />
              </div>
              <CurrencyInput
                value={extraIncome === 0 ? "" : extraIncome}
                onChange={setExtraIncome}
                label="Other income (optional)"
                hint="Freelance, rent, side work — a typical month."
              />
            </StepShell>
          )}

          {step === 2 && (
            <StepShell title="Your fixed commitments" subtitle="Bills that stay roughly the same every month. Skip anything that doesn't apply.">
              <AmountList categories={fixedCats} values={fixed} onChange={setFixed} />
              <TotalRow label="Fixed total" value={fixedTotal} />
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="Everyday spending" subtitle="A rough monthly budget for each. You can fine-tune later.">
              <AmountList categories={variableCats} values={variable} onChange={setVariable} />
              <TotalRow label="Everyday total" value={variableTotal} />
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title="How much would you like to save?" subtitle="Even a small amount builds momentum.">
              <CurrencyInput
                value={savingsTarget === 0 ? "" : savingsTarget}
                onChange={setSavingsTarget}
                size="lg"
                autoFocus
                label="Monthly savings target"
              />
              <div className="flex flex-wrap gap-2">
                {[0.05, 0.1, 0.2].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSavingsTarget(Math.round((income * p) / 100) * 100)}
                    className="rounded-full border bg-card px-3.5 py-2 text-sm font-semibold transition-colors hover:border-primary/50"
                  >
                    {Math.round(p * 100)}% of income
                  </button>
                ))}
              </div>
              <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                After commitments and everyday spending, you have{" "}
                <MoneyText value={Math.max(income + extraIncome - fixedTotal - variableTotal, 0)} className="font-bold text-foreground" />{" "}
                to work with.
              </p>
            </StepShell>
          )}

          {step === 5 && (
            <StepShell title="Build a safety net" subtitle="An emergency fund covers surprises without breaking your plan.">
              <CurrencyInput
                value={emergencyTarget === 0 ? "" : emergencyTarget}
                onChange={setEmergencyTarget}
                size="lg"
                autoFocus
                label="Emergency fund target"
                hint="A common starting point is 3 months of expenses."
              />
              <div className="flex flex-wrap gap-2">
                {[3, 6].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setEmergencyTarget((fixedTotal + variableTotal) * m)}
                    className="rounded-full border bg-card px-3.5 py-2 text-sm font-semibold transition-colors hover:border-primary/50"
                  >
                    {m} months of expenses
                  </button>
                ))}
              </div>
              <CurrencyInput
                value={emergencyCurrent === 0 ? "" : emergencyCurrent}
                onChange={setEmergencyCurrent}
                label="Already saved (optional)"
              />
            </StepShell>
          )}

          {step === 6 && (
            <StepShell title="What are you working toward?" subtitle="One goal is enough to start. You can add more later.">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWantsGoal(true)}
                  aria-pressed={wantsGoal}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition-colors",
                    wantsGoal ? "border-primary bg-accent" : "hover:border-primary/40",
                  )}
                >
                  <span className="block text-sm font-bold">I have a goal</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">Car, home, travel…</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWantsGoal(false)}
                  aria-pressed={!wantsGoal}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition-colors",
                    !wantsGoal ? "border-primary bg-accent" : "hover:border-primary/40",
                  )}
                >
                  <span className="block text-sm font-bold">Not yet</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">Add one anytime</span>
                </button>
              </div>

              {wantsGoal ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {GOAL_ICONS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGoalIcon(g.id)}
                        aria-pressed={goalIcon === g.id}
                        className={cn(
                          "flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition-colors",
                          goalIcon === g.id ? "border-primary bg-accent" : "hover:border-primary/40",
                        )}
                      >
                        <CategoryIcon icon={g.id} className="size-8 rounded-lg" />
                        <span className="text-[11px] font-semibold">{g.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="goalName">Goal name</Label>
                    <Input
                      id="goalName"
                      className="h-12 rounded-2xl"
                      placeholder="New car"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                    />
                  </div>
                  <CurrencyInput value={goalTarget === 0 ? "" : goalTarget} onChange={setGoalTarget} label="Target amount" size="lg" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CurrencyInput value={goalSaved === 0 ? "" : goalSaved} onChange={setGoalSaved} label="Already saved" />
                    <CurrencyInput value={goalMonthly === 0 ? "" : goalMonthly} onChange={setGoalMonthly} label="Monthly contribution" />
                  </div>
                  {goalTarget > 0 && goalMonthly > 0 ? (
                    <p className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
                      At this pace you'll get there in about{" "}
                      {Math.max(Math.ceil((goalTarget - goalSaved) / goalMonthly), 1)} months.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </StepShell>
          )}

          {step === 7 && (
            <StepShell title={`Your plan is ready, ${name.split(" ")[0] || "friend"}`} subtitle="Here's how your month looks. Everything stays editable.">
              <div className="rounded-3xl bg-gradient-hero p-6 text-white shadow-hero">
                <p className="text-xs font-bold tracking-wide text-white/75 uppercase">Flexible each month</p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight">
                  <MoneyText value={Math.max(leftover, 0)} />
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {leftover >= 0
                    ? "That's what's left after commitments, everyday spending, savings and goals."
                    : "Your plan is over your income right now — we'll help you rebalance it."}
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border bg-card p-4">
                <SummaryRow label="Income" value={income + extraIncome} />
                <SummaryRow label="Fixed commitments" value={-fixedTotal} />
                <SummaryRow label="Everyday spending" value={-variableTotal} />
                <SummaryRow label="Savings" value={-savingsTarget} />
                {goalMonthlyEffective > 0 ? <SummaryRow label="Goal contribution" value={-goalMonthlyEffective} /> : null}
              </div>
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                We've also filled in two months of sample history so your dashboard and reviews feel real from day one.
              </p>
            </StepShell>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl gap-3 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {step > 1 && step < 7 ? (
            <Button variant="ghost" size="lg" className="h-13 rounded-2xl font-bold" onClick={() => setStep(step + 1)}>
              Skip
            </Button>
          ) : null}
          <Button
            size="lg"
            className="h-13 flex-1 rounded-2xl text-base font-bold"
            disabled={!canContinue}
            onClick={() => (step === STEPS.length - 1 ? finish() : setStep(step + 1))}
          >
            {step === STEPS.length - 1 ? (
              <>
                <Check className="size-4" />
                Go to my dashboard
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
      <div className="mt-7 space-y-5">{children}</div>
    </div>
  );
}

function AmountList({
  categories,
  values,
  onChange,
}: {
  categories: { id: string; name: string; icon: string }[];
  values: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
}) {
  return (
    <div className="space-y-3">
      {categories.map((c) => (
        <div key={c.id} className="flex items-center gap-3">
          <CategoryIcon icon={c.icon} />
          <span className="w-24 shrink-0 text-sm font-bold sm:w-32">{c.name}</span>
          <div className="flex-1">
            <CurrencyInput
              value={values[c.id] ? (values[c.id] as number) : ""}
              onChange={(v) => onChange({ ...values, [c.id]: v })}
              id={`amount-${c.id}`}
            />
          </div>
        </div>
      ))}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Plus className="size-3.5" aria-hidden />
        You can add custom categories later in Budget.
      </p>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
      <span className="text-sm font-bold">{label}</span>
      <MoneyText value={value} className="text-base font-extrabold" />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className={cn("font-extrabold tabular", value < 0 ? "text-foreground" : "text-success")}>
        {value < 0 ? "−" : "+"}
        <MoneyText value={Math.abs(value)} />
      </span>
    </div>
  );
}
