import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Wordmark } from "@/components/brand/Logo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & privacy — Nisaab" },
      {
        name: "description",
        content: "How Nisaab handles your money data: your money stays in your own accounts, always.",
      },
      { property: "og:title", content: "Terms & privacy — Nisaab" },
      {
        property: "og:description",
        content: "Nisaab is a money planning tool. It never holds or moves your funds.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-5">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/" aria-label="Back">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <Wordmark />
      </header>

      <main className="mx-auto max-w-2xl px-5 pb-32">
        <h1 className="text-3xl font-extrabold tracking-tight">Before we begin</h1>
        <p className="mt-2 text-muted-foreground">
          A short, plain-language summary of what Nisaab is — and what it isn't.
        </p>

        <div className="mt-6 space-y-4">
          <Section
            title="Nisaab is a planning tool, not a bank"
            body="Your money stays in your own bank accounts, wallets and cash. Nisaab never holds, moves, transfers or invests funds on your behalf."
          />
          <Section
            title="You record, we calculate"
            body="You tell Nisaab about your income, commitments and spending. Nisaab turns that into a clear plan and a Safe to Spend number so you always know where you stand."
          />
          <Section
            title="Your data stays on your device"
            body="In this version everything you enter is stored locally on this device. Nothing is shared, sold or sent anywhere. You can delete everything at any time from Settings."
          />
          <Section
            title="Guidance, not financial advice"
            body="Nisaab's suggestions are simple math based on the numbers you provide. They are not regulated financial, tax or investment advice."
          />
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border bg-card p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm text-muted-foreground">
            You stay in full control. Nisaab is designed to be honest and non-judgmental — no shaming, no pressure,
            no hidden fees.
          </p>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-2xl space-y-4 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <label className="flex items-start gap-3 text-sm font-medium">
            <Checkbox
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              className="mt-0.5"
              aria-label="I agree to the terms and privacy summary"
            />
            <span>I understand and agree to the terms and privacy summary above.</span>
          </label>
          <Button
            size="lg"
            className="h-13 w-full rounded-2xl text-base font-bold"
            disabled={!agreed}
            onClick={() => void navigate({ to: "/auth", search: { mode: "signup" } })}
          >
            Agree & continue
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="text-base font-bold">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </section>
  );
}
