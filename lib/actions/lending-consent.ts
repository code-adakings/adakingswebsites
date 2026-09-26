"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { advanceToPaymentPending, getApplicationByToken, getLendingSettings, recordConsent } from "@/lib/lending/server";
import { sendConsentSignedEmails, sendEmailForCurrentStatus } from "@/lib/lending/emails";

export type LendingConsentState = { error?: string };

const normalizeName = (name: string) => name.toLowerCase().replace(/\s+/g, " ").trim();

/** Lender step APPROVED → PAYMENT_PENDING: reveals (and emails) the payment details. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- useActionState passes the previous state
export async function proceedToPayment(token: string, _prevState: LendingConsentState): Promise<LendingConsentState> {
  const app = await getApplicationByToken(token);
  if (!app) return { error: "This agreement could not be found." };
  if (app.status === "APPROVED") {
    try {
      await advanceToPaymentPending(app);
    } catch (error) {
      console.error("[lending] proceed to payment failed:", error);
      return { error: "Something changed on our side. Please refresh the page and try again." };
    }
    after(async () => {
      await sendEmailForCurrentStatus(app._id).catch((error) =>
        console.error("[lending] payment instructions email failed:", error),
      );
    });
  }
  redirect(`/new-frontiers/d/${token}#payment`);
}

/**
 * The lender's electronic signature. Only possible once finance has verified
 * the payment, and only once — the consent record is permanent.
 */
export async function signLendingAgreement(
  token: string,
  _prevState: LendingConsentState,
  formData: FormData,
): Promise<LendingConsentState> {
  const typedName = String(formData.get("signatureName") ?? "").replace(/\s+/g, " ").trim();
  if (formData.get("consent") !== "on") {
    return { error: "Please tick the box to confirm the statement above." };
  }

  const [app, settings] = await Promise.all([getApplicationByToken(token), getLendingSettings()]);
  if (!app) return { error: "This agreement could not be found." };
  if (app.status !== "PAYMENT_RECEIVED" || app.consentAt) {
    return { error: "This agreement isn't open for consent. Please refresh the page." };
  }
  if (normalizeName(typedName) !== normalizeName(app.fullName)) {
    return { error: `Type your full name exactly as it appears on the agreement: ${app.fullName}` };
  }

  const requestHeaders = await headers();
  try {
    await recordConsent(app, settings, {
      name: typedName,
      ip: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? requestHeaders.get("x-real-ip") ?? undefined,
      userAgent: requestHeaders.get("user-agent") ?? undefined,
    });
  } catch (error) {
    console.error("[lending] recording consent failed:", error);
    return { error: "We couldn't record your consent. Please refresh the page and try again." };
  }

  after(async () => {
    const signed = await getApplicationByToken(token);
    if (signed) await sendConsentSignedEmails(signed);
  });

  redirect(`/new-frontiers/d/${token}#execution`);
}
