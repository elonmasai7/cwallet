"use client";

import { FormEvent, useEffect, useState } from "react";
import { NavShell } from "@/components/nav-shell";
import { apiFetch } from "@/lib/api";
import { Lesson } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";

type ProgressResponse = {
  score: number;
  totalQuestions: number;
  gamification: { totalPoints: number; level: string };
};

export default function LessonsPage() {
  const token = useAuthStore((state) => state.accessToken);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    void apiFetch<Lesson[]>("/lessons", { token }).then((response) => {
      setLessons(response);
      setSelectedLesson(response[0] || null);
    });
  }, [token]);

  async function submitQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedLesson || !token) {
      setFeedback("Sign in to submit lesson progress.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const answers = selectedLesson.quizzes.map((quiz) => Number(formData.get(quiz.id)));

    const response = await apiFetch<ProgressResponse>("/progress/complete", {
      method: "POST",
      token,
      body: JSON.stringify({ lessonId: selectedLesson.id, answers }),
    });

    setFeedback(
      `Score ${response.score}/${response.totalQuestions}. You are now ${response.gamification.level}.`,
    );
  }

  return (
    <NavShell>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel">
          <h1 className="section-title">Financial literacy lessons</h1>
          <div className="mt-5 space-y-3">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setSelectedLesson(lesson)}
                className="w-full rounded-2xl border border-slate-200 p-4 text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{lesson.category}</p>
                    <h2 className="font-semibold">{lesson.title}</h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                    {lesson.completed ? "Completed" : `${lesson.pointsAward} pts`}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{lesson.summary}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          {selectedLesson ? (
            <>
              <p className="text-sm text-slate-500">{selectedLesson.category}</p>
              <h2 className="section-title mt-1">{selectedLesson.title}</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                {selectedLesson.content}
              </p>

              <form className="mt-6 space-y-5" onSubmit={(event) => void submitQuiz(event)}>
                {selectedLesson.quizzes.map((quiz) => (
                  <fieldset key={quiz.id} className="rounded-2xl bg-slate-50 p-4">
                    <legend className="font-medium">{quiz.question}</legend>
                    <div className="mt-3 space-y-2">
                      {quiz.options.map((option, index) => (
                        <label key={option} className="flex items-center gap-3 text-sm">
                          <input type="radio" name={quiz.id} value={index} required />
                          {option}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
                {feedback ? <p className="text-sm text-ocean">{feedback}</p> : null}
                <button type="submit" className="rounded-2xl bg-ink px-5 py-3 font-medium text-white">
                  Complete lesson
                </button>
              </form>
            </>
          ) : (
            <p className="text-sm text-slate-500">No lessons available.</p>
          )}
        </section>
      </div>
    </NavShell>
  );
}

