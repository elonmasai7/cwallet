"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/lessons", label: "Lessons" },
  { href: "/reports", label: "Reports" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];

export function NavShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const visibleLinks = user?.role === "ADMIN" ? [...links, { href: "/admin", label: "Admin" }] : links;

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 md:px-8">
      <header className="panel mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold text-ink">
            CivicWallet
          </Link>
          <p className="mt-1 text-sm text-slate-600">
            Learn finance, track public money, and report civic issues.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm ${
                pathname === link.href ? "bg-ink text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-full bg-sunrise px-4 py-2 text-sm font-medium text-white"
            >
              Log out
            </button>
          ) : (
            <Link href="/auth" className="rounded-full bg-ocean px-4 py-2 text-sm font-medium text-white">
              Sign in
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
