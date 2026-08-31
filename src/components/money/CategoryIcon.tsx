import {
  Banknote,
  Briefcase,
  Bus,
  Car,
  CircleDashed,
  Clapperboard,
  CreditCard,
  Gift,
  GraduationCap,
  Home,
  House,
  Landmark,
  Laptop,
  Plane,
  Receipt,
  Repeat,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tag,
  User,
  Utensils,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  house: House,
  zap: Zap,
  wifi: Wifi,
  smartphone: Smartphone,
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  repeat: Repeat,
  utensils: Utensils,
  bus: Bus,
  "shopping-bag": ShoppingBag,
  clapperboard: Clapperboard,
  user: User,
  "circle-dashed": CircleDashed,
  receipt: Receipt,
  tag: Tag,
  car: Car,
  laptop: Laptop,
  briefcase: Briefcase,
  plane: Plane,
  sparkles: Sparkles,
  salary: Banknote,
  bonus: Gift,
  freelance: Briefcase,
  other: CreditCard,
};

export function resolveIcon(key: string): LucideIcon {
  return ICONS[key] ?? CircleDashed;
}

export function CategoryIcon({
  icon,
  className,
  tone = "soft",
}: {
  icon: string;
  className?: string;
  tone?: "soft" | "plain" | "success";
}) {
  const Icon = resolveIcon(icon);
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
        tone === "soft" && "bg-accent text-accent-foreground",
        tone === "success" && "bg-success/12 text-success",
        tone === "plain" && "bg-muted text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-[18px]" aria-hidden />
    </span>
  );
}
