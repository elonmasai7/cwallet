"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminGuard } from "@/components/admin-guard";
import { NavShell } from "@/components/nav-shell";
import { apiFetch } from "@/lib/api";
import { Lesson, Report } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";

type LeaderboardEntry = {
  id: string;
  name: string;
  pointsTotal: number;
  level: string;
};

export default function AdminPage() {
  const token = useAuthStore((state) => state.accessToken);
  const [reports, setReports] = useState<Report[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function loadAdminData() {
    if (!token) {
      return;
    }

    const [reportResponse, lessonResponse, leaderboardResponse] = await Promise.all([
      apiFetch<{ items: Report[] }>("/reports?page=1&pageSize=50", { token }),
      apiFetch<Lesson[]>("/lessons", { token }),
      apiFetch<LeaderboardEntry[]>("/leaderboard", { token }),
    ]);

    setReports(reportResponse.items);
    setLessons(lessonResponse);
    setLeaderboard(leaderboardResponse);
  }

  useEffect(() => {
    void loadAdminData();
  }, [token]);

  const moderationCounts = useMemo(() => {
    return reports.reduce(
      (accumulator, report) => {
        accumulator.total += 1;
        if (report.status === "PENDING") {
          accumulator.pending += 1;
        }
        if (report.status === "RESOLVED") {
          accumulator.resolved += 1;
        }
        return accumulator;
      },
      { total: 0, pending: 0, resolved: 0 },
    );
  }, [reports]);

  async function handleLessonCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setMessage("Admin authentication is required.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const optionLines = String(formData.get("options"))
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    try {
      await apiFetch("/lessons", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: String(formData.get("title")),
          slug: String(formData.get("slug")),
          summary: String(formData.get("summary")),
          content: String(formData.get("content")),
          category: String(formData.get("category")),
          order: Number(formData.get("order")),
          pointsAward: Number(formData.get("pointsAward")),
          quizzes: [
            {
              question: String(formData.get("question")),
              options: optionLines,
              answerIndex: Number(formData.get("answerIndex")),
              explanation: String(formData.get("explanation") || ""),
            },
          ],
        }),
      });

      setMessage("Lesson created successfully.");
      event.currentTarget.reset();
      await loadAdminData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create lesson.");
    }
  }

  async function updateStatus(reportId: string, status: string) {
    if (!token) {
      return;
    }

    await apiFetch(`/reports/${reportId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status }),
    });

    await loadAdminData();
  }

  return (
    <NavShell>
      <AdminGuard>
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <div className="panel">
              <p className="text-sm text-slate-500">Published lessons</p>
              <p className="mt-3 text-3xl font-semibold">{lessons.length}</p>
            </div>
            <div className="panel">
              <p className="text-sm text-slate-500">Pending reports</p>
              <p className="mt-3 text-3xl font-semibold">{moderationCounts.pending}</p>
            </div>
            <div className="panel">
              <p className="text-sm text-slate-500">Resolved reports</p>
              <p className="mt-3 text-3xl font-semibold">{moderationCounts.resolved}</p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="panel">
              <h1 className="section-title">Publish a lesson</h1>
              <p className="mt-2 text-sm text-slate-600">
                Create a new financial literacy lesson with one starter quiz question for the MVP.
              </p>
              <form className="mt-6 space-y-4" onSubmit={(event) => void handleLessonCreate(event)}>
                <input name="title" placeholder="Lesson title" className="w-full rounded-2xl border p-3" required />
                <input name="slug" placeholder="lesson-slug" className="w-full rounded-2xl border p-3" required />
                <input name="category" placeholder="Taxes" className="w-full rounded-2xl border p-3" required />
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="order" type="number" min="1" placeholder="Order" className="rounded-2xl border p-3" required />
                  <input name="pointsAward" type="number" min="1" defaultValue="10" className="rounded-2xl border p-3" required />
                </div>
                <textarea name="summary" placeholder="Short lesson summary" className="min-h-24 w-full rounded-2xl border p-3" required />
                <textarea name="content" placeholder="Lesson content" className="min-h-36 w-full rounded-2xl border p-3" required />
                <input name="question" placeholder="Quiz question" className="w-full rounded-2xl border p-3" required />
                <textarea
                  name="options"
                  placeholder={"One option per line\nOption two\nOption three\nOption four"}
                  className="min-h-28 w-full rounded-2xl border p-3"
                  required
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="answerIndex" type="number" min="0" placeholder="Correct option index" className="rounded-2xl border p-3" required />
                  <input name="explanation" placeholder="Quiz explanation" className="rounded-2xl border p-3" />
                </div>
                {message ? <p className="text-sm text-ocean">{message}</p> : null}
                <button type="submit" className="rounded-2xl bg-ink px-5 py-3 font-medium text-white">
                  Publish lesson
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <section className="panel">
                <h2 className="section-title">Moderation queue</h2>
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
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="panel">
                <h2 className="section-title">Top citizens</h2>
                <div className="mt-5 space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <div>
                        <p className="text-sm text-slate-500">Rank #{index + 1}</p>
                        <p className="font-medium">{entry.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{entry.pointsTotal} pts</p>
                        <p className="text-sm text-slate-500">{entry.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      </AdminGuard>
    </NavShell>
  );
}

