import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  BarChart3,
  Home,
  PiggyBank,
  Plus,
  Receipt,
  Settings,
  Target,
  Wallet,
} from "lucide-react";
import { Wordmark } from "@/components/brand/Logo";
import { QuickAddProvider, useQuickAdd } from "@/components/transactions/QuickAdd";
import { useApp } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const NAV = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/budget", label: "Budget", icon: Wallet, exact: false },
  { to: "/app/transactions", label: "Activity", icon: Receipt, exact: false },
  { to: "/app/savings", label: "Savings", icon: PiggyBank, exact: false },
  { to: "/app/goals", label: "Goals", icon: Target, exact: false },
] as const;

const SIDE_EXTRA = [
  { to: "/app/review", label: "Monthly review", icon: BarChart3 },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

function AppLayout() {
  const { state, ready } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !state.onboarded) {
      void navigate({ to: "/" });
    }
  }, [ready, state.onboarded, navigate]);

  return (
    <QuickAddProvider>
      <div className="min-h-screen bg-background lg:flex">
        <DesktopSidebar />
        <div className="flex min-h-screen w-full flex-col lg:min-h-0">
          <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 lg:max-w-3xl lg:px-8 lg:pb-16">
            <Outlet />
          </main>
        </div>
        <MobileNav />
      </div>
    </QuickAddProvider>
  );
}

function DesktopSidebar() {
  const { openExpense } = useQuickAdd();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r px-4 py-6 lg:flex">
      <Link to="/app" className="px-2">
        <Wordmark />
      </Link>
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {[...NAV, ...SIDE_EXTRA].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/app" }}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
          >
            <item.icon className="size-[18px]" aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>
      <Button size="lg" className="mt-4 h-12 rounded-2xl font-bold" onClick={openExpense}>
        <Plus className="size-4" />
        Add expense
      </Button>
    </aside>
  );
}

function MobileNav() {
  const { openExpense } = useQuickAdd();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur lg:hidden">
      <div className="relative mx-auto flex max-w-2xl items-stretch justify-between px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        {NAV.slice(0, 2).map((item) => (
          <NavItem key={item.to} {...item} active={isActive(pathname, item.to, item.exact)} />
        ))}
        <div className="flex w-16 shrink-0 items-start justify-center">
          <button
            type="button"
            onClick={openExpense}
            aria-label="Add expense"
            className="-mt-6 inline-flex size-14 items-center justify-center rounded-full bg-gradient-brand text-white shadow-hero transition-transform active:scale-95"
          >
            <Plus className="size-6" />
          </button>
        </div>
        {NAV.slice(2, 4).map((item) => (
          <NavItem key={item.to} {...item} active={isActive(pathname, item.to, item.exact)} />
        ))}
      </div>
    </nav>
  );
}

function isActive(pathname: string, to: string, exact: boolean) {
  return exact ? pathname === to : pathname.startsWith(to);
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" aria-hidden />
      {label}
    </Link>
  );
}
