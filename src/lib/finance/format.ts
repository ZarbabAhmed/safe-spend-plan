import { getCurrency } from "./currencies";

export function formatMoney(amount: number, currency: string, opts?: { compact?: boolean; decimals?: boolean }): string {
  const def = getCurrency(currency);
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  let body: string;
  if (opts?.compact && abs >= 1000) {
    if (abs >= 1_000_000) body = `${trim(abs / 1_000_000)}M`;
    else body = `${trim(abs / 1000)}K`;
  } else {
    body = abs.toLocaleString(def.locale, {
      minimumFractionDigits: opts?.decimals ? 2 : 0,
      maximumFractionDigits: opts?.decimals ? 2 : 0,
    });
  }
  return `${sign}${def.prefix}${body}`;
}

function trim(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatPercent(value: number, decimals = 0): string {
  return `${(Math.round(value * 10 ** (decimals + 2)) / 10 ** decimals).toFixed(decimals)}%`;
}

export function monthKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string, style: "long" | "short" = "long"): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y!, (m ?? 1) - 1, 1);
  return d.toLocaleDateString("en-US", { month: style, year: "numeric" });
}

export function shiftMonth(key: string, delta: number): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y!, (m ?? 1) - 1 + delta, 1);
  return monthKey(d);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysInMonth(key: string): number {
  const [y, m] = key.split("-").map(Number);
  return new Date(y!, m!, 0).getDate();
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

export function monthsBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO);
  const b = new Date(toISO);
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}
