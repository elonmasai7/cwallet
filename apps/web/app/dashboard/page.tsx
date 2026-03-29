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
  headlineStats: Array<{ label: string; value: string; change: string }>;
  countySnapshot: {
    countyName: string;
    approvedBudget: number;
    absorptionRate: number;
    pendingProjects: number;
    flaggedProjects: number;
  };
  recentActivity: string[];
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
              The MVP uses demo county data for now and is already structured for live government APIs later.
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
            {data ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {data.headlineStats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-teal-700">{stat.change}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section className="panel">
            <h2 className="section-title">Allocation by sector</h2>
            {data ? <FinanceBarChart data={data.allocationBreakdown} /> : null}
          </section>

          <section className="panel">
            <h2 className="section-title">County snapshot</h2>
            {data ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">County</p>
                  <p className="mt-2 text-xl font-semibold">{data.countySnapshot.countyName}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Approved budget</p>
                  <p className="mt-2 text-xl font-semibold">
                    {data.currency} {data.countySnapshot.approvedBudget.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Absorption rate</p>
                  <p className="mt-2 text-xl font-semibold">{data.countySnapshot.absorptionRate}%</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Pending projects</p>
                  <p className="mt-2 text-xl font-semibold">{data.countySnapshot.pendingProjects}</p>
                </div>
              </div>
            ) : null}
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
          <section className="panel">
            <h2 className="section-title">Recent activity</h2>
            <div className="mt-4 space-y-3">
              {data?.recentActivity.map((activity) => (
                <div key={activity} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                  {activity}
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <h2 className="section-title">Flagged projects</h2>
            {data ? (
              <div className="rounded-3xl bg-amber-50 p-5">
                <p className="text-sm text-amber-800">Projects needing attention</p>
                <p className="mt-2 text-3xl font-semibold text-amber-950">{data.countySnapshot.flaggedProjects}</p>
                <p className="mt-2 text-sm text-amber-900">
                  Demo count for stalled, underfunded, or low-visibility county work items.
                </p>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </NavShell>
  );
}
