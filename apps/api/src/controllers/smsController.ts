import { Request, Response } from "express";
import { handleSmsWebhook } from "../services/smsService";

export async function webhook(req: Request, res: Response) {
  const result = await handleSmsWebhook(req.body.from, req.body.text);
  res.json(result);
}

