import { prisma } from "../lib/prisma";
import { registerUser } from "./authService";
import { createReport } from "./reportService";
import { sendSms } from "../lib/africasTalking";

function normalizeText(text: string) {
  return text.trim().toUpperCase();
}

export async function handleSmsWebhook(from: string, text: string) {
  const normalized = normalizeText(text);
  const existingUser = await prisma.user.findFirst({ where: { phone: from } });

  if (normalized === "START") {
    if (!existingUser) {
      const localPart = from.replace(/\D/g, "").slice(-8) || Date.now().toString().slice(-8);
      await registerUser({
        name: `SMS User ${localPart}`,
        email: `sms-${localPart}@civicwallet.app`,
        password: `SmsUser!${localPart}`,
        phone: from,
      });
    }

    await sendSms(from, "Welcome to CivicWallet. Reply 1 for lessons, 2 to report issue.");
    return { message: "Start flow processed" };
  }

  const user = existingUser || (await prisma.user.findFirst({ where: { phone: from } }));

  if (!user) {
    await sendSms(from, "Please send START first to register with CivicWallet.");
    return { message: "User prompted to register" };
  }

  if (normalized === "1") {
    const firstLesson = await prisma.lesson.findFirst({
      where: { isPublished: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    await sendSms(
      from,
      firstLesson
        ? `Lesson: ${firstLesson.title}. ${firstLesson.summary}`
        : "No lessons are available right now.",
    );
    return { message: "Lesson delivered" };
  }

  if (normalized === "2") {
    await sendSms(
      from,
      "Reply with REPORT: title | description | location to submit an issue.",
    );
    return { message: "Report instructions sent" };
  }

  if (normalized.startsWith("REPORT:")) {
    const payload = text.slice(7).split("|").map((value) => value.trim());
    const [title, description, location] = payload;

    if (!title || !description) {
      await sendSms(from, "Invalid report format. Use REPORT: title | description | location");
      return { message: "Invalid report format" };
    }

    await createReport(
      user.id,
      {
        title,
        description,
        location,
      },
      undefined,
      "sms",
    );

    await sendSms(from, "Report received. Thank you for helping improve accountability.");
    return { message: "Report created from SMS" };
  }

  await sendSms(from, "Unknown option. Reply 1 for lessons or 2 to report issue.");
  return { message: "Fallback response sent" };
}

