"use client";

import { useEffect, useState } from "react";
import { NavShell } from "@/components/nav-shell";
import { apiFetch } from "@/lib/api";

type LeaderboardEntry = {
  id: string;
  name: string;
  pointsTotal: number;
  level: string;
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    void apiFetch<LeaderboardEntry[]>("/leaderboard").then(setEntries);
  }, []);

  return (
    <NavShell>
      <section className="panel">
        <h1 className="section-title">Community leaderboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Points are earned from lessons and verified civic participation actions.
        </p>
        <div className="mt-6 grid gap-3">
          {entries.map((entry, index) => (
            <div key={entry.id} className="grid items-center gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[60px_1fr_auto]">
              <div className="text-2xl font-semibold text-slate-400">#{index + 1}</div>
              <div>
                <p className="font-medium">{entry.name}</p>
                <p className="text-sm text-slate-500">{entry.level}</p>
              </div>
              <div className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
                {entry.pointsTotal} pts
              </div>
            </div>
          ))}
        </div>
      </section>
    </NavShell>
  );
}

