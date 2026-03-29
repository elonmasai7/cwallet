"use client";

import { useEffect, useState } from "react";
import { NavShell } from "@/components/nav-shell";
import { FinanceBarChart, FinancePieChart } from "@/components/charts";
import { apiFetch } from "@/lib/api";

type DashboardData = {
  estimatedMonthlyTaxContribution: number;
  yearlyProjection: number;
  currency: string;
  allocationBreakdown: Array<{ sector: string; percentage: number; amount: number }>;
  insights: string[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    void apiFetch<DashboardData>("/dashboard/public-finance").then(setData);
  }, []);

  return (
    <NavShell>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="panel">
            <h1 className="section-title">Public finance dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">
              The MVP uses static budget data now and is already structured for live government APIs later.
            </p>
            {data ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Estimated monthly contribution</p>
                  <p className="mt-2 text-3xl font-semibold">
                    {data.currency} {data.estimatedMonthlyTaxContribution.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Projected yearly contribution</p>
                  <p className="mt-2 text-3xl font-semibold">
                    {data.currency} {data.yearlyProjection.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">Loading dashboard...</p>
            )}
          </section>

          <section className="panel">
            <h2 className="section-title">Allocation by sector</h2>
            {data ? <FinanceBarChart data={data.allocationBreakdown} /> : null}
          </section>
        </div>

        <div className="space-y-6">
          <section className="panel">
            <h2 className="section-title">Budget mix</h2>
            {data ? <FinancePieChart data={data.allocationBreakdown} /> : null}
          </section>
          <section className="panel">
            <h2 className="section-title">Insights</h2>
            <div className="mt-4 space-y-3">
              {data?.insights.map((insight) => (
                <div key={insight} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  {insight}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </NavShell>
  );
}

