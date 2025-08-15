import { create } from "zustand";

type User = {
  id: number;
  email: string;
  role: "user" | "admin";
};

type AuthStore = {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  hydrate: () => {
    console.log("Hydrating auth store...");
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user, isHydrated: true });
        console.log("Hydrated with token and user");
      } catch {
        set({ isHydrated: true });
        console.log("Hydrate failed: invalid user JSON");
      }
    } else {
      set({ isHydrated: true });
      console.log("No token or user found in localStorage");
    }
  },

  setHydrated: (hydrated) => set({ isHydrated: hydrated }),
}));
