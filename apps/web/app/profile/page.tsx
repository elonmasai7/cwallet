"use client";

import { useEffect, useState } from "react";
import { NavShell } from "@/components/nav-shell";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

type Notification = {
  id: string;
  title: string;
  body: string;
  channel: string;
  createdAt: string;
};

type PointPayload = {
  pointsTotal: number;
  level: string;
  pointEvents: Array<{ id: string; points: number; reason: string; createdAt: string }>;
};

export default function ProfilePage() {
  const { user, accessToken } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [points, setPoints] = useState<PointPayload | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    void Promise.all([
      apiFetch<PointPayload>("/user/points", { token: accessToken }),
      apiFetch<Notification[]>("/notifications", { token: accessToken }),
    ]).then(([pointsResponse, notificationsResponse]) => {
      setPoints(pointsResponse);
      setNotifications(notificationsResponse);
    });
  }, [accessToken]);

  return (
    <NavShell>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel">
          <h1 className="section-title">Your profile</h1>
          {user ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Level</p>
                <p className="font-medium">{points?.level || user.level}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Points</p>
                <p className="font-medium">{points?.pointsTotal ?? user.pointsTotal}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Sign in to view your profile.</p>
          )}
        </section>
        <section className="space-y-6">
          <div className="panel">
            <h2 className="section-title">Recent point activity</h2>
            <div className="mt-4 space-y-3">
              {points?.pointEvents.map((event) => (
                <div key={event.id} className="rounded-2xl bg-slate-50 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span>{event.reason}</span>
                    <span className="font-semibold text-ocean">+{event.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <h2 className="section-title">Notifications</h2>
            <div className="mt-4 space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </NavShell>
  );
}
