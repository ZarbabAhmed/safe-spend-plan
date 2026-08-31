import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { monthKey, monthLabel, shiftMonth } from "@/lib/finance/format";
import { useApp } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MonthSelector({ compact = false }: { compact?: boolean }) {
  const { month, setMonth } = useApp();
  const current = monthKey(new Date());
  const options = Array.from({ length: 12 }, (_, i) => shiftMonth(current, -i));
  const atLatest = month >= current;

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-full"
        aria-label="Previous month"
        onClick={() => setMonth(shiftMonth(month, -1))}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 rounded-full px-3 font-semibold">
            {!compact && <Calendar className="size-3.5" />}
            {monthLabel(month, compact ? "short" : "long")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="max-h-72 overflow-y-auto">
          {options.map((m) => (
            <DropdownMenuItem key={m} onSelect={() => setMonth(m)} className="font-medium">
              {monthLabel(m)}
              {m === current ? <span className="ml-auto text-xs text-muted-foreground">Current</span> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-full"
        aria-label="Next month"
        disabled={atLatest}
        onClick={() => setMonth(shiftMonth(month, 1))}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
