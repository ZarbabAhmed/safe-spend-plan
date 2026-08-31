import type { AppState } from "@/lib/finance/types";

/**
 * Storage boundary. Today it is browser storage; connecting a real backend
 * later means implementing this interface, not rewriting any screen.
 */
export interface StateRepository {
  load(): Promise<AppState | null>;
  save(state: AppState): Promise<void>;
  clear(): Promise<void>;
}

const KEY = "nisaab.state.v1";

export const localRepository: StateRepository = {
  async load() {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AppState) : null;
    } catch {
      return null;
    }
  },
  async save(state) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — the session still works in memory */
    }
  },
  async clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(KEY);
  },
};
