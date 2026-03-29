"use client";

import { create } from "zustand";
import { apiFetch } from "@/lib/api";
import { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  initialize: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
};

function persistSession(user: User | null, accessToken: string | null, refreshToken: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!user || !accessToken || !refreshToken) {
    localStorage.removeItem("civicwallet-auth");
    return;
  }

  localStorage.setItem(
    "civicwallet-auth",
    JSON.stringify({ user, accessToken, refreshToken }),
  );
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  initialize: () => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = localStorage.getItem("civicwallet-auth");
    if (!stored) {
      return;
    }

    const parsed = JSON.parse(stored);
    set({
      user: parsed.user,
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
    });
  },
  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await apiFetch<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      persistSession(response.user, response.accessToken, response.refreshToken);
      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        loading: false,
      });
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      return false;
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });

    try {
      const response = await apiFetch<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      persistSession(response.user, response.accessToken, response.refreshToken);
      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        loading: false,
      });
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      });
      return false;
    }
  },
  logout: async () => {
    const refreshToken = get().refreshToken;

    if (refreshToken) {
      await apiFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }).catch(() => undefined);
    }

    persistSession(null, null, null);
    set({ user: null, accessToken: null, refreshToken: null, error: null });
  },
}));
