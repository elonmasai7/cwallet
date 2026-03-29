import AfricaTalking from "africastalking";
import { env } from "../config/env";

const canSendSms = Boolean(env.AFRICASTALKING_API_KEY);

const africasTalking = canSendSms
  ? AfricaTalking({
      apiKey: env.AFRICASTALKING_API_KEY!,
      username: env.AFRICASTALKING_USERNAME,
    })
  : null;

export async function sendSms(to: string, message: string) {
  if (!canSendSms || !africasTalking) {
    return { simulated: true, to, message };
  }

  return africasTalking.SMS.send({
    to: [to],
    message,
    from: env.AFRICASTALKING_SMS_FROM,
  });
}

