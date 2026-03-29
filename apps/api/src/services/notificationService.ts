import { NotificationChannel } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { sendSms } from "../lib/africasTalking";

export async function createNotification(userId: string, title: string, body: string) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      body,
      channel: NotificationChannel.IN_APP,
    },
  });
}

export async function createSmsNotification(userId: string, phone: string | null, title: string, body: string) {
  await prisma.notification.create({
    data: {
      userId,
      title,
      body,
      channel: NotificationChannel.SMS,
    },
  });

  if (phone) {
    await sendSms(phone, `${title}: ${body}`);
  }
}

