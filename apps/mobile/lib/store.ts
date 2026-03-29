import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  pointsTotal: number;
  level: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (payload: { user: User; accessToken: string; refreshToken: string }) => Promise<void>;
  hydrate: () => Promise<void>;
  clear: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setSession: async (payload) => {
    await AsyncStorage.setItem("civicwallet-auth", JSON.stringify(payload));
    set(payload);
  },
  hydrate: async () => {
    const raw = await AsyncStorage.getItem("civicwallet-auth");
    if (raw) {
      set(JSON.parse(raw));
    }
  },
  clear: async () => {
    await AsyncStorage.removeItem("civicwallet-auth");
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));

