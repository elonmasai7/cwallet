import Link from "next/link";
import { NavShell } from "@/components/nav-shell";

const featureCards = [
  "Financial literacy lessons with quizzes and progress tracking",
  "Public finance dashboard showing how money flows into sectors",
  "Citizen issue reporting with evidence, location, and admin review",
  "Gamification through points, levels, and leaderboards",
  "SMS onboarding and reporting flow via Africa's Talking",
];

export default function HomePage() {
  return (
    <NavShell>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel bg-ink text-white">
          <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm">
            Civic fintech for accountability
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
            CivicWallet turns public finance into something people can learn, question, and improve.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-200">
            Teach budgeting and taxes, show how public money is allocated, and let citizens escalate issues across web, mobile, and SMS.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/auth" className="rounded-full bg-sunrise px-5 py-3 font-medium text-white">
              Create account
            </Link>
            <Link href="/dashboard" className="rounded-full border border-white/20 px-5 py-3 font-medium text-white">
              Explore dashboard
            </Link>
          </div>
        </div>
        <div className="panel">
          <h2 className="section-title">Why it matters</h2>
          <div className="mt-4 space-y-3">
            {featureCards.map((card) => (
              <div key={card} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {card}
              </div>
            ))}
          </div>
        </div>
      </section>
    </NavShell>
  );
}

