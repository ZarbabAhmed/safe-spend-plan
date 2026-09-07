import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Plus, Target } from "lucide-react";
import { toast } from "sonner";
import { MoneyText } from "@/components/money/MoneyText";
import { ProgressMeter } from "@/components/money/ProgressMeter";
import { CategoryIcon } from "@/components/money/CategoryIcon";
import { CurrencyInput } from "@/components/money/CurrencyInput";
import { ResponsiveSheet } from "@/components/common/ResponsiveSheet";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store/app-store";
import { goalProgress } from "@/lib/finance/calc";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/goals/")({
  head: () => ({
    meta: [
      { title: "Goals — Nisaab" },
      { name: "description", content: "Track what you're saving for, with milestones and an honest finish date." },
      { property: "og:title", content: "Goals — Nisaab" },
      { property: "og:description", content: "Turn a wish into a plan with a monthly contribution." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GoalsPage,
});

const ICONS = ["car", "home", "plane", "graduation", "heart", "target"];

function GoalsPage() {
  const { state, actions } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("car");
  const [target, setTarget] = useState(0);
  const [saved, setSaved] = useState(0);
  const [monthly, setMonthly] = useState(0);

  const create = () => {
    actions.addGoal({
      name: name.trim() || "My goal",
      icon,
      target,
      saved,
      monthlyContribution: monthly,
    });
    toast.success("Goal created", { description: "Every deposit brings it closer." });
    setName("");
    setTarget(0);
    setSaved(0);
    setMonthly(0);
    setOpen(false);
  };

  return (
    <div className="space-y-5 py-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Goals</h1>
          <p className="text-sm text-muted-foreground">What you're working toward</p>
        </div>
        <Button className="rounded-2xl font-bold" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New goal
        </Button>
      </header>

      {state.goals.length === 0 ? (
        <EmptyState
          icon={<Target className="size-6" />}
          title="No goals yet"
          description="A car, a trip, a home deposit — name it and Nisaab will track the way there."
          action={
            <Button className="rounded-2xl font-bold" onClick={() => setOpen(true)}>
              Create your first goal
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {state.goals.map((g) => {
            const p = goalProgress(g);
            return (
              <Link
                key={g.id}
                to="/app/goals/$goalId"
                params={{ goalId: g.id }}
                className="block rounded-3xl border bg-card p-5 shadow-card transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon icon={g.icon} className="size-11 rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{p.etaLabel}</p>
                  </div>
                  <span className="text-lg font-extrabold tabular text-primary">
                    {Math.round(p.progress * 100)}%
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                </div>
                <p className="mt-4 text-sm font-bold tabular">
                  <MoneyText value={g.saved} />{" "}
                  <span className="font-semibold text-muted-foreground">
                    of <MoneyText value={g.target} />
                  </span>
                </p>
                <ProgressMeter value={p.progress} gradient className="mt-2" label={g.name} />
              </Link>
            );
          })}
        </div>
      )}

      <ResponsiveSheet open={open} onOpenChange={setOpen} title="New goal" description="Name it, price it, and pick a pace.">
        <div className="space-y-5">
          <div className="grid grid-cols-6 gap-2">
            {ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                aria-pressed={icon === i}
                aria-label={`Icon ${i}`}
                className={cn(
                  "flex items-center justify-center rounded-2xl border p-2 transition-colors",
                  icon === i ? "border-primary bg-accent" : "hover:border-primary/40",
                )}
              >
                <CategoryIcon icon={i} className="size-8 rounded-lg" />
              </button>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="goal-name">Goal name</Label>
            <Input
              id="goal-name"
              className="h-12 rounded-2xl"
              placeholder="Family trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <CurrencyInput value={target === 0 ? "" : target} onChange={setTarget} label="Target amount" size="lg" />
          <div className="grid gap-4 sm:grid-cols-2">
            <CurrencyInput value={saved === 0 ? "" : saved} onChange={setSaved} label="Already saved" />
            <CurrencyInput value={monthly === 0 ? "" : monthly} onChange={setMonthly} label="Monthly contribution" />
          </div>
          {target > 0 && monthly > 0 ? (
            <p className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
              At this pace you'll reach it in about {Math.max(Math.ceil((target - saved) / monthly), 1)} months.
            </p>
          ) : null}
          <Button size="lg" className="w-full rounded-2xl font-bold" disabled={target <= 0} onClick={create}>
            Create goal
          </Button>
        </div>
      </ResponsiveSheet>
    </div>
  );
}
