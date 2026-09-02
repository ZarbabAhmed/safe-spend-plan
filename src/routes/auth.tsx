import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Fingerprint, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/brand/Logo";
import { useApp } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";
type Step = "identity" | "otp" | "pin";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search["mode"] === "login" ? "login" : "signup",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Nisaab" },
      { name: "description", content: "Sign in or create your Nisaab account to plan and track your money." },
      { property: "og:title", content: "Sign in — Nisaab" },
      { property: "og:description", content: "Access your personal money control system." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("identity");
  const [channel, setChannel] = useState<"phone" | "email">("phone");
  const [identity, setIdentity] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  const submitIdentity = () => {
    if (identity.trim().length < 5) {
      setError(channel === "phone" ? "Enter a valid phone number." : "Enter a valid email address.");
      return;
    }
    setError(null);
    setStep("otp");
    toast.info("Demo code: 1234", { description: "This prototype doesn't send real messages." });
  };

  const finish = () => {
    actions.signIn();
    if (isLogin && state.onboarded) {
      void navigate({ to: "/app" });
    } else {
      void navigate({ to: "/onboarding" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex w-full max-w-md items-center gap-3 px-5 py-5">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Back"
          onClick={() => (step === "identity" ? void navigate({ to: "/" }) : setStep("identity"))}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <Wordmark />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-16">
        {step === "identity" ? (
          <div className="animate-rise">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin
                ? "Sign in to pick up right where you left off."
                : "One quick step, then we'll set up your plan together."}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
              {(["phone", "email"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  aria-pressed={channel === c}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors",
                    channel === c ? "bg-card shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {c === "phone" ? <Phone className="size-4" /> : <Mail className="size-4" />}
                  {c === "phone" ? "Phone" : "Email"}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-1.5">
              <Label htmlFor="identity">{channel === "phone" ? "Phone number" : "Email address"}</Label>
              <Input
                id="identity"
                className="h-12 rounded-2xl"
                type={channel === "phone" ? "tel" : "email"}
                inputMode={channel === "phone" ? "tel" : "email"}
                placeholder={channel === "phone" ? "03xx xxxxxxx" : "you@example.com"}
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitIdentity()}
              />
              {error ? (
                <p role="alert" className="text-sm font-semibold text-destructive">
                  {error}
                </p>
              ) : null}
            </div>

            <Button size="lg" className="mt-6 h-13 w-full rounded-2xl text-base font-bold" onClick={submitIdentity}>
              Continue
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? "New to Nisaab?" : "Already have an account?"}{" "}
              <Link
                to="/auth"
                search={{ mode: isLogin ? "signup" : "login" }}
                className="font-bold text-primary underline-offset-4 hover:underline"
              >
                {isLogin ? "Create an account" : "Log in"}
              </Link>
            </p>
          </div>
        ) : step === "otp" ? (
          <OtpStep identity={identity} onVerified={() => setStep("pin")} />
        ) : (
          <PinStep isLogin={isLogin} onDone={finish} />
        )}
      </main>
    </div>
  );
}

function OtpStep({ identity, onVerified }: { identity: string; onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    if (code.length === 4) {
      if (code === "1234") {
        onVerified();
      } else {
        setError("That code doesn't match. For this demo, use 1234.");
        setCode("");
      }
    }
  }, [code, onVerified]);

  return (
    <div className="animate-rise">
      <h1 className="text-3xl font-extrabold tracking-tight">Enter your code</h1>
      <p className="mt-2 text-muted-foreground">
        We sent a 4-digit code to <span className="font-semibold text-foreground">{identity}</span>. Use{" "}
        <span className="font-bold text-primary">1234</span> in this prototype.
      </p>
      <CodeField length={4} value={code} onChange={setCode} className="mt-8" />
      {error ? (
        <p role="alert" className="mt-3 text-center text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {seconds > 0 ? (
          <span>Resend code in {seconds}s</span>
        ) : (
          <button
            type="button"
            className="font-bold text-primary underline-offset-4 hover:underline"
            onClick={() => {
              setSeconds(30);
              toast.info("Code resent — it's still 1234.");
            }}
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}

function PinStep({ isLogin, onDone }: { isLogin: boolean; onDone: () => void }) {
  const { state, actions } = useApp();
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [stage, setStage] = useState<"create" | "confirm">(isLogin ? "confirm" : "create");
  const [error, setError] = useState<string | null>(null);
  const length = state.profile.pinLength;

  useEffect(() => {
    if (stage === "create" && pin.length === length) {
      setStage("confirm");
    }
  }, [pin, stage, length]);

  useEffect(() => {
    if (stage !== "confirm" || confirm.length !== length) return;
    if (isLogin || confirm === pin) {
      onDone();
    } else {
      setError("Those didn't match. Let's try again.");
      setPin("");
      setConfirm("");
      setStage("create");
    }
  }, [confirm, pin, stage, length, isLogin, onDone]);

  const title = isLogin ? "Enter your PIN" : stage === "create" ? "Create a PIN" : "Confirm your PIN";

  return (
    <div className="animate-rise">
      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        {isLogin
          ? "Your PIN keeps your plan private on this device."
          : "You'll use this each time you open Nisaab. Any digits work in this prototype."}
      </p>
      <CodeField
        length={length}
        value={stage === "create" ? pin : confirm}
        onChange={stage === "create" ? setPin : setConfirm}
        mask
        className="mt-8"
      />
      {error ? (
        <p role="alert" className="mt-3 text-center text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}
      <Button
        variant="ghost"
        className="mx-auto mt-8 flex h-12 items-center gap-2 rounded-2xl font-bold"
        onClick={() => {
          actions.updateProfile({ biometric: true });
          onDone();
        }}
      >
        <Fingerprint className="size-4" />
        Use biometrics instead
      </Button>
    </div>
  );
}

function CodeField({
  length,
  value,
  onChange,
  mask,
  className,
}: {
  length: number;
  value: string;
  onChange: (v: string) => void;
  mask?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("relative", className)}>
      <input
        ref={ref}
        autoFocus
        inputMode="numeric"
        aria-label="Enter code"
        value={value}
        maxLength={length}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
      />
      <div className="flex justify-center gap-3">
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex size-14 items-center justify-center rounded-2xl border-2 text-2xl font-extrabold tabular transition-colors",
              i === value.length ? "border-primary bg-accent" : "bg-card",
            )}
          >
            {value[i] ? (mask ? "•" : value[i]) : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
