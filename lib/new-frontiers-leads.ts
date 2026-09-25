import "server-only";
import { writeClient } from "@/sanity/lib/write-client";
import { sendEmailNotification } from "@/lib/email";

export interface NewFrontiersLead {
  fullName: string;
  phone: string;
  email: string;
  amount: string;
  message: string;
  acknowledged: boolean;
  submittedAt: string;
}

async function saveToSanity(lead: NewFrontiersLead) {
  if (!writeClient) {
    throw new Error("SANITY_API_WRITE_TOKEN is not configured");
  }
  await writeClient.create({
    _type: "newFrontiersLead",
    ...lead,
    status: "New",
  });
}

async function notifyByEmail(lead: NewFrontiersLead) {
  await sendEmailNotification({
    subject: `New Operation New Frontiers enquiry — ${lead.fullName}`,
    replyTo: lead.email,
    text: [
      `New lending enquiry submitted on the Operation New Frontiers page.`,
      ``,
      `Name: ${lead.fullName}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email}`,
      `Intended amount: ${lead.amount}`,
      `Message: ${lead.message || "(none)"}`,
      `Acknowledged lending terms: ${lead.acknowledged ? "Yes" : "No"}`,
      `Submitted at: ${lead.submittedAt}`,
    ].join("\n"),
  });
}

/**
 * Persists a lead to Sanity (for a durable, editable record) and emails a
 * notification, in parallel. Either path can be unconfigured independently
 * (missing SANITY_API_WRITE_TOKEN or RESEND_API_KEY) — the submission only
 * fails if both fail, so partial setup still captures the lead somewhere.
 */
export async function saveNewFrontiersLead(lead: NewFrontiersLead): Promise<void> {
  const [sanityResult, emailResult] = await Promise.allSettled([
    saveToSanity(lead),
    notifyByEmail(lead),
  ]);

  if (sanityResult.status === "rejected") {
    console.error("[new-frontiers-lead] Sanity save failed:", sanityResult.reason);
  }
  if (emailResult.status === "rejected") {
    console.error("[new-frontiers-lead] Email notification failed:", emailResult.reason);
  }

  if (sanityResult.status === "rejected" && emailResult.status === "rejected") {
    throw new Error("Failed to save lead and send notification");
  }
}
