"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const palette = ["#0f766e", "#f97316", "#34d399", "#1d4ed8", "#f59e0b", "#475569"];

export function FinanceBarChart({
  data,
}: {
  data: Array<{ sector: string; amount: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="#0f766e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FinancePieChart({
  data,
}: {
  data: Array<{ sector: string; percentage: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="percentage" nameKey="sector" outerRadius={100} innerRadius={60}>
            {data.map((entry, index) => (
              <Cell key={entry.sector} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

