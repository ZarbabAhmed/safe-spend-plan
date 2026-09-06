import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MonthSelector } from "@/components/money/MonthSelector";
import { MoneyText } from "@/components/money/MoneyText";
import { ProgressMeter } from "@/components/money/ProgressMeter";
import { StatusPill } from "@/components/money/StatusPill";
import { CategoryIcon } from "@/components/money/CategoryIcon";
import { CurrencyInput } from "@/components/money/CurrencyInput";
import { ResponsiveSheet } from "@/components/common/ResponsiveSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store/app-store";
import { summarizeWeek } from "@/lib/finance/calc";
import { monthLabel } from "@/lib/finance/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/budget")({
  head: () => ({
    meta: [
      { title: "Budget — Nisaab" },
      { name: "description", content: "Plan each category, compare planned against actual and adjust anytime." },
      { property: "og:title", content: "Budget — Nisaab" },
      { property: "og:description", content: "Planned vs actual for every category, month by month." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const { state, month, summary, actions } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState(0);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKind, setNewKind] = useState<"fixed" | "variable">("variable");
  const week = summarizeWeek(state, month);

  const openEdit = (id: string, planned: number) => {
    setEditing(id);
    setDraft(planned);
  };

  const save = () => {
    if (!editing) return;
    actions.setPlanned(month, editing, draft);
    toast.success("Budget updated");
    setEditing(null);
  };

  const editingLine = summary.lines.find((l) => l.id === editing);

  const groups = [
    { kind: "fixed" as const, title: "Fixed commitments", body: "Bills that repeat every month." },
    { kind: "variable" as const, title: "Everyday spending", body: "Where your day-to-day money goes." },
  ];

  return (
    <div className="space-y-6 py-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Budget</h1>
          <p className="text-sm text-muted-foreground">{monthLabel(month)}</p>
        </div>
        <MonthSelector compact />
      </header>

      <section className="rounded-3xl border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">Planned this month</p>
            <p className="mt-1 text-3xl font-extrabold tabular">
              <MoneyText value={summary.fixedPlanned + summary.variablePlanned} animate />
            </p>
          </div>
          <StatusPill health={summary.status}>{summary.statusLabel}</StatusPill>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <MiniStat label="Spent" value={summary.totalSpent} />
          <MiniStat label="Savings" value={summary.savingsTarget} />
          <MiniStat label="Flexible" value={summary.flexible} />
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-card">
        <h2 className="text-sm font-extrabold">This week</h2>
        <p className="mt-2 text-2xl font-extrabold tabular">
          <MoneyText value={Math.max(week.remaining, 0)} />
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{week.message}</p>
        <ProgressMeter
          value={week.safe > 0 ? week.spent / week.safe : 0}
          health={week.status}
          className="mt-3"
          label="Weekly spending"
        />
      </section>

      {groups.map((group) => {
        const lines = summary.lines.filter((l) => l.kind === group.kind);
        return (
          <section key={group.kind} className="rounded-3xl border bg-card p-5 shadow-card">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-sm font-extrabold">{group.title}</h2>
              <span className="text-xs font-bold text-muted-foreground tabular">
                <MoneyText value={group.kind === "fixed" ? summary.fixedActual : summary.variableActual} /> /{" "}
                <MoneyText value={group.kind === "fixed" ? summary.fixedPlanned : summary.variablePlanned} />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{group.body}</p>

            <div className="mt-4 space-y-4">
              {lines.map((line) => {
                const category = state.categories.find((c) => c.id === line.id);
                return (
                  <div key={line.id} className="flex items-center gap-3">
                    <CategoryIcon icon={line.icon} />
                    <button
                      type="button"
                      onClick={() => openEdit(line.id, line.planned)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-bold">{line.name}</span>
                        <span className="shrink-0 text-xs font-semibold text-muted-foreground tabular">
                          <MoneyText value={line.actual} /> / <MoneyText value={line.planned} />
                        </span>
                      </span>
                      <ProgressMeter value={line.progress} health={line.health} className="mt-2" label={line.name} />
                      <span
                        className={cn(
                          "mt-1.5 block text-[11px] font-semibold",
                          line.remaining >= 0 ? "text-muted-foreground" : "text-destructive",
                        )}
                      >
                        {line.remaining >= 0 ? (
                          <>
                            <MoneyText value={line.remaining} /> left
                          </>
                        ) : (
                          <>
                            <MoneyText value={Math.abs(line.remaining)} /> over plan
                          </>
                        )}
                      </span>
                    </button>
                    {category?.custom ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full text-muted-foreground"
                        aria-label={`Remove ${line.name}`}
                        onClick={() => {
                          actions.removeCategory(line.id);
                          toast.success(`${line.name} removed`);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <Button variant="outline" size="lg" className="h-13 w-full rounded-2xl font-bold" onClick={() => setAdding(true)}>
        <Plus className="size-4" />
        Add a category
      </Button>

      <ResponsiveSheet
        open={editing !== null}
        onOpenChange={(v) => !v && setEditing(null)}
        title={`Edit ${editingLine?.name ?? "category"}`}
        description="Change how much you plan to spend here this month."
      >
        <div className="space-y-5">
          <CurrencyInput value={draft === 0 ? "" : draft} onChange={setDraft} size="lg" autoFocus label="Planned amount" />
          {editingLine ? (
            <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              You've spent <MoneyText value={editingLine.actual} className="font-bold text-foreground" /> here so far.
            </p>
          ) : null}
          <Button size="lg" className="w-full rounded-2xl font-bold" onClick={save}>
            Save
          </Button>
        </div>
      </ResponsiveSheet>

      <ResponsiveSheet
        open={adding}
        onOpenChange={setAdding}
        title="Add a category"
        description="Track something that matters to you."
      >
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              className="h-12 rounded-2xl"
              placeholder="Gym membership"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { id: "fixed", title: "Fixed", body: "Same every month" },
                { id: "variable", title: "Everyday", body: "Changes month to month" },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setNewKind(o.id)}
                aria-pressed={newKind === o.id}
                className={cn(
                  "rounded-2xl border-2 p-4 text-left transition-colors",
                  newKind === o.id ? "border-primary bg-accent" : "hover:border-primary/40",
                )}
              >
                <span className="block text-sm font-bold">{o.title}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{o.body}</span>
              </button>
            ))}
          </div>
          <Button
            size="lg"
            className="w-full rounded-2xl font-bold"
            disabled={newName.trim().length === 0}
            onClick={() => {
              actions.addCategory(newName.trim(), newKind);
              toast.success("Category added");
              setNewName("");
              setAdding(false);
            }}
          >
            Add category
          </Button>
        </div>
      </ResponsiveSheet>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-muted px-2 py-3">
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-extrabold tabular">
        <MoneyText value={value} compact />
      </p>
    </div>
  );
}
