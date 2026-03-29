"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AdminGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="panel">
        <h1 className="section-title">Admin access required</h1>
        <p className="mt-2 text-sm text-slate-600">Please sign in with an admin account to access this workspace.</p>
        <Link href="/auth" className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
          Go to sign in
        </Link>
      </div>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="panel">
        <h1 className="section-title">Restricted workspace</h1>
        <p className="mt-2 text-sm text-slate-600">
          This console is available only to administrators with moderation and content publishing privileges.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

