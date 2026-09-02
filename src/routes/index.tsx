import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Target, Wallet } from "lucide-react";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/money/ProgressMeter";
import { StatusPill } from "@/components/money/StatusPill";
import { useApp } from "@/lib/store/app-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nisaab — Know what you can safely spend today" },
      {
        name: "description",
        content:
          "Nisaab is a personal money control system for salaried people: plan your month, track spending, build savings and reach your goals.",
      },
      { property: "og:title", content: "Nisaab — Know what you can safely spend today" },
      {
        property: "og:description",
        content: "Plan your money. Track your spending. Build your future.",
      },
    ],
  }),
  component: Landing,
});

function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1250);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-hero">
      <LogoMark className="size-16 animate-rise" />
      <span className="mt-4 text-lg font-extrabold tracking-tight text-white">Nisaab</span>
      <div className="mt-8 h-1 w-28 overflow-hidden rounded-full bg-white/25">
        <div className="h-full w-1/3 rounded-full bg-white animate-sheen" />
      </div>
    </div>
  );
}

function Landing() {
  const [splash, setSplash] = useState(true);
  const { state, ready } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && state.onboarded && state.authenticated) {
      void navigate({ to: "/app" });
    }
  }, [ready, state.onboarded, state.authenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {splash ? <Splash onDone={() => setSplash(false)} /> : null}

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Wordmark />
        <Button asChild variant="ghost" className="rounded-full font-semibold">
          <Link to="/auth" search={{ mode: "login" }}>
            Log in
          </Link>
        </Button>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20">
        <section className="grid items-center gap-12 py-8 lg:grid-cols-2 lg:py-16">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
              <ShieldCheck className="size-3.5" aria-hidden />
              Not a bank. Not a wallet. Your money stays yours.
            </span>
            <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Know what you can safely spend today without hurting tomorrow.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              Plan your money. Track your spending. Build your future.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-2xl px-7 text-base font-bold shadow-hero">
                <Link to="/terms">
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-2xl px-7 text-base font-bold">
                <Link to="/auth" search={{ mode: "login" }}>
                  Log in
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t pt-6">
              <Highlight icon={<Wallet className="size-4" />} title="Safe to spend" body="Daily clarity" />
              <Highlight icon={<Target className="size-4" />} title="Real goals" body="With timelines" />
              <Highlight icon={<ShieldCheck className="size-4" />} title="Your data" body="Stays private" />
            </dl>
          </div>

          <DemoPreview />
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Nisaab helps you plan and track your own money. It never holds, moves or transfers funds.</p>
          <Link to="/terms" className="font-semibold text-foreground underline-offset-4 hover:underline">
            Terms & privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Highlight({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-sm font-bold">
        <span className="text-primary">{icon}</span>
        {title}
      </dt>
      <dd className="mt-0.5 text-xs text-muted-foreground">{body}</dd>
    </div>
  );
}

function DemoPreview() {
  return (
    <div className="relative animate-rise" style={{ animationDelay: "120ms" }}>
      <span className="absolute -top-3 left-4 z-10 rounded-full bg-foreground px-3 py-1 text-[11px] font-bold text-background">
        Product preview · sample numbers
      </span>
      <div className="rounded-[2rem] border bg-card p-4 shadow-card">
        <div className="rounded-3xl bg-gradient-hero p-6 text-white shadow-hero">
          <p className="text-xs font-semibold tracking-wide text-white/75 uppercase">Safe to spend</p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight tabular">Rs. 18,400</p>
          <p className="mt-2 text-sm text-white/80">Based on your spending and upcoming commitments.</p>
          <StatusPill health="good" onDark className="mt-4">
            You're on track
          </StatusPill>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            ["Income", "Rs. 150K"],
            ["Spent", "Rs. 91K"],
            ["Saved", "Rs. 32K"],
            ["Left", "Rs. 27K"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-muted px-2.5 py-3 text-center">
              <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-sm font-extrabold tabular">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3 rounded-2xl border p-4">
          {[
            ["Food", "Rs. 14K / Rs. 20K", 0.7, "good"],
            ["Travel", "Rs. 7K / Rs. 10K", 0.7, "good"],
            ["Shopping", "Rs. 9K / Rs. 8K", 1, "over"],
          ].map(([name, amount, value, health]) => (
            <div key={name as string}>
              <div className="mb-1.5 flex items-baseline justify-between text-xs font-semibold">
                <span>{name}</span>
                <span className="tabular text-muted-foreground">{amount}</span>
              </div>
              <ProgressMeter value={value as number} health={health as "good" | "over"} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-accent p-4">
          <div className="flex-1">
            <p className="text-xs font-bold text-accent-foreground">Car goal</p>
            <p className="mt-0.5 text-sm font-extrabold tabular">Rs. 640K / Rs. 1M</p>
            <ProgressMeter value={0.64} gradient className="mt-2" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold tabular text-primary">64%</p>
            <p className="text-[11px] font-semibold text-muted-foreground">9 months</p>
          </div>
        </div>
      </div>
    </div>
  );
}
