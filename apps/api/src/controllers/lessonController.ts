import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createLesson, getLessonById, listLessons } from "../services/lessonService";

export async function getLessons(req: Request, res: Response) {
  const lessons = await listLessons(req.user?.userId);
  res.json(lessons);
}

export async function getLesson(req: Request, res: Response) {
  const lesson = await getLessonById(req.params.id, req.user?.userId);
  res.json(lesson);
}

export async function postLesson(req: Request, res: Response) {
  const lesson = await createLesson(req.body);
  res.status(StatusCodes.CREATED).json(lesson);
}

