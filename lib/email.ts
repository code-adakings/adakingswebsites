import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sender identity — must be on a domain verified in the Resend dashboard.
 * Falls back to Resend's shared sandbox address, which only delivers to the
 * email the Resend account itself is signed up with (fine for testing,
 * not for production — verify a domain and set RESEND_FROM_EMAIL for that).
 */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Adakings Website <onboarding@resend.dev>";

export const NOTIFY_EMAIL = process.env.NEW_FRONTIERS_NOTIFY_EMAIL || siteConfig.contact.supportEmail;

export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<void> {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured — skipping email");
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    replyTo,
    subject,
    text,
    ...(html ? { html } : {}),
  });

  if (error) {
    throw new Error(`Resend failed to send email: ${error.message}`);
  }
}

/** Internal notification to the Adakings team. */
export async function sendEmailNotification({
  to = NOTIFY_EMAIL,
  ...email
}: {
  subject: string;
  text: string;
  replyTo?: string;
  to?: string;
}): Promise<void> {
  await sendEmail({ to, ...email });
}
