import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, LogOut, Moon, Palette, Shield, Sun, Trash2, User, Wallet } from "lucide-react";
import { toast } from "sonner";
import { CurrencyInput } from "@/components/money/CurrencyInput";
import { ResponsiveSheet } from "@/components/common/ResponsiveSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/store/app-store";
import { CURRENCIES } from "@/lib/finance/currencies";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nisaab" },
      { name: "description", content: "Your profile, currency, theme, notifications and account security." },
      { property: "og:title", content: "Settings — Nisaab" },
      { property: "og:description", content: "Make Nisaab work the way you do." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(state.profile.name);
  const [notifications, setNotifications] = useState(true);
  const [income, setIncome] = useState(0);
  const [editIncome, setEditIncome] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="space-y-5 py-5">
      <header>
        <h1 className="text-xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Your profile and preferences</p>
      </header>

      <Section icon={<User className="size-4" />} title="Profile">
        <div className="space-y-1.5">
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            className="h-12 rounded-2xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              actions.updateProfile({ name: name.trim() || "Friend" });
              toast.success("Profile updated");
            }}
          />
        </div>
        {state.profile.email ? (
          <p className="text-sm text-muted-foreground">{state.profile.email}</p>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: "job", label: "Job holder" },
              { id: "business", label: "Business owner" },
            ] as const
          ).map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={state.profile.userType === o.id}
              onClick={() => actions.updateProfile({ userType: o.id })}
              className={cn(
                "rounded-2xl border-2 px-4 py-3 text-sm font-bold transition-colors",
                state.profile.userType === o.id ? "border-primary bg-accent" : "hover:border-primary/40",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Section>

      <Section icon={<Wallet className="size-4" />} title="Currency">
        <div className="grid gap-2 sm:grid-cols-2">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              aria-pressed={state.profile.currency === c.code}
              onClick={() => actions.updateProfile({ currency: c.code })}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                state.profile.currency === c.code ? "border-primary bg-accent" : "hover:border-primary/40",
              )}
            >
              <span>{c.name}</span>
              <span className="font-extrabold text-primary">{c.symbol}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section icon={<Palette className="size-4" />} title="Appearance">
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "light", label: "Light", icon: <Sun className="size-4" /> },
              { id: "dark", label: "Dark", icon: <Moon className="size-4" /> },
              { id: "system", label: "System", icon: <Palette className="size-4" /> },
            ] as const
          ).map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={state.theme === o.id}
              onClick={() => actions.setTheme(o.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-xs font-bold transition-colors",
                state.theme === o.id ? "border-primary bg-accent" : "hover:border-primary/40",
              )}
            >
              {o.icon}
              {o.label}
            </button>
          ))}
        </div>
      </Section>

      <Section icon={<Bell className="size-4" />} title="Notifications">
        <Row
          label="Spending reminders"
          hint="A gentle nudge when a category is running low."
          control={<Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Spending reminders" />}
        />
        <Row
          label="Guided tour"
          hint="Show the 5-step dashboard tour again."
          control={
            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-bold"
              onClick={() => {
                actions.restartTour();
                toast.success("Tour will show next visit");
              }}
            >
              Restart
            </Button>
          }
        />
      </Section>

      <Section icon={<Shield className="size-4" />} title="Security">
        <Row
          label="App PIN"
          hint={`${state.profile.pinLength} digits`}
          control={
            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-bold"
              onClick={() => void navigate({ to: "/auth", search: { mode: "login" } })}
            >
              Change
            </Button>
          }
        />
        <Row
          label="Biometric unlock"
          hint="Use your device unlock instead of the PIN."
          control={
            <Switch
              checked={state.profile.biometric}
              onCheckedChange={(v) => actions.updateProfile({ biometric: v })}
              aria-label="Biometric unlock"
            />
          }
        />
        <Row
          label="Monthly income"
          hint="Update what you expect to earn each month."
          control={
            <Button variant="outline" size="sm" className="rounded-full font-bold" onClick={() => setEditIncome(true)}>
              Edit
            </Button>
          }
        />
      </Section>

      <div className="space-y-2 pb-4">
        <Button
          variant="outline"
          size="lg"
          className="h-13 w-full rounded-2xl font-bold"
          onClick={() => {
            actions.signOut();
            void navigate({ to: "/" });
          }}
        >
          <LogOut className="size-4" />
          Log out
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="h-13 w-full rounded-2xl font-bold text-destructive hover:text-destructive"
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2 className="size-4" />
          Delete my data
        </Button>
      </div>

      <ResponsiveSheet
        open={editIncome}
        onOpenChange={setEditIncome}
        title="Monthly income"
        description="This is the base your plan is built on."
      >
        <div className="space-y-5">
          <CurrencyInput value={income === 0 ? "" : income} onChange={setIncome} size="lg" autoFocus label="Amount" />
          <Button
            size="lg"
            className="w-full rounded-2xl font-bold"
            onClick={() => {
              actions.setPlanField(state.plans[state.plans.length - 1]?.month ?? "", { income });
              toast.success("Income updated");
              setEditIncome(false);
            }}
          >
            Save
          </Button>
        </div>
      </ResponsiveSheet>

      <ResponsiveSheet
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete everything?"
        description="Your plan, budgets, transactions and goals will be permanently removed from this device."
      >
        <div className="space-y-3">
          <Button
            size="lg"
            variant="destructive"
            className="w-full rounded-2xl font-bold"
            onClick={() => {
              actions.deleteAccount();
              void navigate({ to: "/" });
            }}
          >
            Yes, delete my data
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full rounded-2xl font-bold"
            onClick={() => setConfirmDelete(false)}
          >
            Keep my data
          </Button>
        </div>
      </ResponsiveSheet>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border bg-card p-5 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          {icon}
        </span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, hint, control }: { label: string; hint: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {control}
    </div>
  );
}
