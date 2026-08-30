import type { Category } from "./types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "rent", name: "Rent", kind: "fixed", icon: "home" },
  { id: "electricity", name: "Electricity", kind: "fixed", icon: "zap" },
  { id: "internet", name: "Internet", kind: "fixed", icon: "wifi" },
  { id: "phone", name: "Phone", kind: "fixed", icon: "smartphone" },
  { id: "education", name: "Education", kind: "fixed", icon: "graduation-cap" },
  { id: "loan", name: "Loan / Installment", kind: "fixed", icon: "landmark" },
  { id: "subscriptions", name: "Subscriptions", kind: "fixed", icon: "repeat" },
  { id: "food", name: "Food", kind: "variable", icon: "utensils" },
  { id: "travel", name: "Travel", kind: "variable", icon: "bus" },
  { id: "shopping", name: "Shopping", kind: "variable", icon: "shopping-bag" },
  { id: "entertainment", name: "Entertainment", kind: "variable", icon: "clapperboard" },
  { id: "personal", name: "Personal", kind: "variable", icon: "user" },
  { id: "other", name: "Other", kind: "variable", icon: "circle-dashed" },
];

/** Rough share-of-income estimates used by "estimate for me" during onboarding. */
export const VARIABLE_ESTIMATE_SHARE: Record<string, number> = {
  food: 0.14,
  travel: 0.06,
  shopping: 0.05,
  entertainment: 0.03,
  personal: 0.04,
  other: 0.02,
};

export const GOAL_PRESETS = [
  { id: "car", name: "Car", icon: "car" },
  { id: "laptop", name: "Laptop", icon: "laptop" },
  { id: "phone", name: "Phone", icon: "smartphone" },
  { id: "business", name: "Business", icon: "briefcase" },
  { id: "travel", name: "Travel", icon: "plane" },
  { id: "home", name: "Home", icon: "house" },
  { id: "education", name: "Education", icon: "graduation-cap" },
  { id: "custom", name: "Custom", icon: "sparkles" },
];
