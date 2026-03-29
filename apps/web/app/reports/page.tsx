"use client";

import { FormEvent, useEffect, useState } from "react";
import { NavShell } from "@/components/nav-shell";
import { API_URL, apiFetch } from "@/lib/api";
import { Report } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";

export default function ReportsPage() {
  const { accessToken, user } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function loadReports() {
    if (!accessToken) {
      setReports([]);
      return;
    }

    const response = await apiFetch<{ items: Report[] }>("/reports?page=1&pageSize=20", {
      token: accessToken,
    });
    setReports(response.items);
  }

  useEffect(() => {
    void loadReports();
  }, [accessToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      setMessage("Please sign in to submit a report.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`${API_URL}/reports`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not submit report.");
      return;
    }

    setMessage("Report submitted successfully.");
    await loadReports();
    event.currentTarget.reset();
  }

  async function updateStatus(reportId: string, status: string) {
    if (!accessToken) {
      return;
    }

    await apiFetch(`/reports/${reportId}`, {
      method: "PATCH",
      token: accessToken,
      body: JSON.stringify({ status }),
    });

    await loadReports();
  }

  return (
    <NavShell>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel">
          <h1 className="section-title">Report an issue</h1>
          <p className="mt-2 text-sm text-slate-600">
            Capture stalled projects, suspected corruption, or service delivery problems.
          </p>
          <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <input name="title" placeholder="Issue title" className="w-full rounded-2xl border p-3" required />
            <textarea
              name="description"
              placeholder="Describe what you observed"
              className="min-h-32 w-full rounded-2xl border p-3"
              required
            />
            <input name="location" placeholder="Location" className="w-full rounded-2xl border p-3" />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="latitude" type="number" step="any" placeholder="Latitude" className="rounded-2xl border p-3" />
              <input name="longitude" type="number" step="any" placeholder="Longitude" className="rounded-2xl border p-3" />
            </div>
            <input name="image" type="file" accept="image/*" className="w-full rounded-2xl border p-3" />
            {message ? <p className="text-sm text-ocean">{message}</p> : null}
            <button type="submit" className="rounded-2xl bg-ink px-5 py-3 font-medium text-white">
              Submit report
            </button>
          </form>
        </section>

        <section className="panel">
          <h2 className="section-title">Recent reports</h2>
          <div className="mt-5 space-y-4">
            {reports.map((report) => (
              <article key={report.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{report.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                      {report.location || "No location"} • {report.status}
                    </p>
                  </div>
                  {user?.role === "ADMIN" ? (
                    <select
                      defaultValue={report.status}
                      onChange={(event) => void updateStatus(report.id, event.target.value)}
                      className="rounded-xl border p-2 text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </NavShell>
  );
}

