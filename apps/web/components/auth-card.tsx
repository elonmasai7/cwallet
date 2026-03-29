"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function AuthCard() {
  const router = useRouter();
  const { login, register, loading, error, user } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (mode === "login") {
      const success = await login(String(formData.get("email")), String(formData.get("password")));
      if (success) {
        router.push("/dashboard");
      }
      return;
    }

    const success = await register({
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      phone: String(formData.get("phone") || ""),
    });

    if (success) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="panel mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="section-title">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Access lessons, public finance insights, and civic reporting tools.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm"
        >
          {mode === "login" ? "Register" : "Login"}
        </button>
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        {mode === "register" ? (
          <input name="name" placeholder="Full name" className="w-full rounded-2xl border p-3" required />
        ) : null}
        <input name="email" type="email" placeholder="Email" className="w-full rounded-2xl border p-3" required />
        {mode === "register" ? (
          <input name="phone" type="tel" placeholder="+254700000000" className="w-full rounded-2xl border p-3" />
        ) : null}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full rounded-2xl border p-3"
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
