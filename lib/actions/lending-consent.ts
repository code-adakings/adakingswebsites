"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getApplicationByToken, recordConsent } from "@/lib/lending/server";
import { sendConsentSignedEmails } from "@/lib/lending/emails";

export type LendingConsentState = { error?: string };

const normalizeName = (name: string) => name.toLowerCase().replace(/\s+/g, " ").trim();

export async function signLendingAgreement(
  token: string,
  _prevState: LendingConsentState,
  formData: FormData,
): Promise<LendingConsentState> {
  const typedName = String(formData.get("signatureName") ?? "").trim();
  if (formData.get("consent") !== "on") {
    return { error: "Please tick the box to confirm you agree to the terms." };
  }

  const app = await getApplicationByToken(token);
  if (!app) return { error: "This agreement could not be found." };
  if (app.status !== "PAYMENT_RECEIVED") {
    return { error: "This agreement isn't ready for signature. Please refresh the page." };
  }
  if (normalizeName(typedName) !== normalizeName(app.fullName)) {
    return { error: `Type your full name exactly as it appears on the agreement: ${app.fullName}` };
  }

  const requestHeaders = await headers();
  try {
    await recordConsent(app, {
      name: typedName,
      ip: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? requestHeaders.get("x-real-ip") ?? undefined,
      userAgent: requestHeaders.get("user-agent") ?? undefined,
    });
  } catch (error) {
    console.error("[lending] recording consent failed:", error);
    return { error: "We couldn't record your signature. Please refresh the page and try again." };
  }

  after(async () => {
    const signed = await getApplicationByToken(token);
    if (signed) await sendConsentSignedEmails(signed);
  });

  redirect(`/new-frontiers/d/${token}#execution`);
}
