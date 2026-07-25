import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Change this to whatever password the florist wants ──────────────────────
export const ADMIN_PASSWORD = "djoy2024";

interface AdminStore {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,

      login: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),
    }),
    { name: "djoy-admin-auth" }
  )
);
