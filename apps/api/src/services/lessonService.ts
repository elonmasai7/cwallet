import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/httpError";
import { awardPoints } from "./gamificationService";
import { createNotification } from "./notificationService";

export async function listLessons(userId?: string) {
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    include: {
      quizzes: true,
      progress: userId
        ? {
            where: { userId },
            select: { completedAt: true, score: true },
          }
        : false,
    },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return lessons.map((lesson) => {
    const completed = Array.isArray(lesson.progress) && lesson.progress.length > 0;
    return {
      ...lesson,
      completed,
      progress: undefined,
    };
  });
}

export async function getLessonById(lessonId: string, userId?: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      quizzes: true,
      progress: userId
        ? {
            where: { userId },
          }
        : false,
    },
  });

  if (!lesson) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Lesson not found");
  }

  return lesson;
}

export async function createLesson(data: {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  order: number;
  pointsAward: number;
  quizzes: Array<{
    question: string;
    options: string[];
    answerIndex: number;
    explanation?: string;
  }>;
}) {
  return prisma.lesson.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      category: data.category,
      order: data.order,
      pointsAward: data.pointsAward,
      quizzes: {
        create: data.quizzes.map((quiz) => ({
          ...quiz,
          options: quiz.options,
        })),
      },
    },
    include: { quizzes: true },
  });
}

export async function completeLesson(userId: string, lessonId: string, answers: number[]) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { quizzes: true },
  });

  if (!lesson) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Lesson not found");
  }

  const existingProgress = await prisma.progress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });

  if (existingProgress) {
    throw new HttpError(StatusCodes.CONFLICT, "Lesson already completed");
  }

  const score = lesson.quizzes.reduce((sum, quiz, index) => {
    return sum + (answers[index] === quiz.answerIndex ? 1 : 0);
  }, 0);

  const nextLesson = await prisma.lesson.findFirst({
    where: {
      category: lesson.category,
      order: lesson.order + 1,
    },
  });

  const progress = await prisma.progress.create({
    data: {
      userId,
      lessonId,
      score,
      unlockedNext: Boolean(nextLesson),
    },
  });

  const gamification = await awardPoints(userId, lesson.pointsAward, `Completed lesson: ${lesson.title}`);
  await createNotification(
    userId,
    "Lesson completed",
    `You earned ${lesson.pointsAward} points for finishing ${lesson.title}.`,
  );

  return {
    progress,
    score,
    totalQuestions: lesson.quizzes.length,
    unlockedLessonId: nextLesson?.id ?? null,
    gamification,
  };
}

