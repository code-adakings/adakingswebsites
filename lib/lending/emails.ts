import "server-only";
import { sendEmail, sendEmailNotification } from "@/lib/email";
import {
  EMAIL_FOR_STATUS,
  formatCedis,
  formatDate,
  formatDateTime,
  formatPercent,
  type LendingEmailKind,
} from "@/lib/lending/shared";
import {
  enteredCurrentStatusAt,
  getApplicationById,
  lendingUrl,
  recordNotification,
  type LendingApplication,
} from "@/lib/lending/server";

type Email = { subject: string; heading: string; paragraphs: string[]; rows?: [string, string][]; cta: string };

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function render(email: Email, url: string) {
  const rows = email.rows ?? [];
  const text = [
    email.heading,
    "",
    ...email.paragraphs.flatMap((p) => [p, ""]),
    ...rows.map(([label, value]) => `${label}: ${value}`),
    rows.length ? "" : null,
    `${email.cta}: ${url}`,
    "",
    "This link is private to you — please don't forward it.",
    "Operation New Frontiers · Adakings Foods & Beverages Company",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#f5f5f4;font-family:Helvetica,Arial,sans-serif;color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#111;padding:20px 28px;color:#d4a017;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">Operation New Frontiers</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px">${escapeHtml(email.heading)}</h1>
${email.paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#333">${escapeHtml(p)}</p>`).join("")}
${
  rows.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border:1px solid #e7e5e4;border-radius:10px">${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:10px 14px;font-size:13px;color:#666;border-bottom:1px solid #f0efee">${escapeHtml(label)}</td><td align="right" style="padding:10px 14px;font-size:14px;font-weight:bold;border-bottom:1px solid #f0efee">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}</table>`
      : ""
}
<a href="${url}" style="display:inline-block;background:#ce1126;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:bold;font-size:15px">${escapeHtml(email.cta)}</a>
<p style="margin:24px 0 0;font-size:12px;color:#888">This link is private to you — please don't forward it.</p>
</td></tr></table>
<p style="font-size:12px;color:#999;margin:16px 0 0">Adakings Foods &amp; Beverages Company</p>
</td></tr></table></body></html>`;

  return { text, html };
}

function firstName(app: LendingApplication) {
  return app.fullName.split(/\s+/)[0] || app.fullName;
}

function termRows(app: LendingApplication): [string, string][] {
  return [
    ["Agreement", app.agreementNumber ?? "—"],
    ["Approved amount", formatCedis(app.negotiatedAmount)],
    ["Interest", formatPercent(app.interestRate)],
    ["Repayment", formatCedis(app.repaymentAmount)],
    [
      "Maturity",
      app.maturityDate ? formatDate(app.maturityDate) : `${app.termMonths} months after funding`,
    ],
  ];
}

const TEMPLATES: Record<LendingEmailKind | "received" | "signed", (app: LendingApplication) => Email> = {
  received: (app) => ({
    subject: "Welcome to Operation New Frontiers",
    heading: `Thank you, ${firstName(app)}`,
    paragraphs: [
      "Thank you for your interest. We're reviewing your application and will contact you shortly to discuss terms.",
      "You can check the status of your application at any time from your private page.",
    ],
    rows: [["Requested amount", app.requestedAmount ?? "—"]],
    cta: "View application",
  }),
  provisional: (app) => ({
    subject: "Your Provisional Lending Agreement is Ready",
    heading: "Your provisional agreement is ready",
    paragraphs: [
      `${firstName(app)}, thank you for discussing terms with us. Your provisional lending agreement has been prepared with the terms below.`,
      "Please read it carefully. When you're ready to fund it, select \"Proceed to payment\" on your agreement page to see our bank and Mobile Money details.",
    ],
    rows: termRows(app),
    cta: "Review your agreement",
  }),
  paymentInstructions: (app) => ({
    subject: `Payment Instructions — ${app.agreementNumber}`,
    heading: "Payment instructions",
    paragraphs: [
      "Your agreement page now shows our bank and Mobile Money details.",
      `Please use your exact payment reference, ${app.paymentReference ?? app.agreementNumber}, so we can match your transfer to your agreement.`,
      "Our finance team verifies every transfer against our bank or Mobile Money statement before your final agreement is activated.",
    ],
    rows: [
      ["Amount due", formatCedis(app.negotiatedAmount)],
      ["Payment reference", app.paymentReference ?? app.agreementNumber ?? "—"],
    ],
    cta: "View payment details",
  }),
  paymentConfirmed: (app) => ({
    subject: "Payment Confirmed — Final Agreement Ready",
    heading: "Payment confirmed",
    paragraphs: [
      `We've received your payment of ${formatCedis(app.negotiatedAmount)}. Your agreement is now verified and active.`,
      "The final step is to give your digital consent. Once you select \"I Agree\", you can download your executed agreement as a PDF.",
    ],
    rows: termRows(app),
    cta: "Sign & download final agreement",
  }),
  signed: (app) => ({
    subject: `Agreement ${app.agreementNumber} Executed`,
    heading: "Your agreement is signed",
    paragraphs: [
      `Thank you, ${firstName(app)}. Your lending agreement was signed electronically on ${formatDateTime(app.consentAt)}.`,
      "Keep a copy of the signed PDF for your records. We'll be in touch ahead of your maturity date.",
    ],
    rows: termRows(app),
    cta: "Download signed PDF",
  }),
};

async function sendToLender(kind: keyof typeof TEMPLATES, app: LendingApplication) {
  const email = TEMPLATES[kind](app);
  const url = kind === "signed" ? lendingUrl(app.publicToken, "/pdf") : lendingUrl(app.publicToken);
  await sendEmail({ to: app.email, subject: email.subject, ...render(email, url) });
}

/** Email 1 plus the internal new-application alert. Either can fail independently. */
export async function sendApplicationReceivedEmails(app: LendingApplication) {
  const results = await Promise.allSettled([
    sendToLender("received", app),
    sendEmailNotification({
      subject: `New Operation New Frontiers application — ${app.fullName}`,
      replyTo: app.email,
      text: [
        "New lending application submitted on the Operation New Frontiers page.",
        "",
        `Name: ${app.fullName}`,
        `Phone: ${app.phone}`,
        `Email: ${app.email}`,
        `Address: ${app.address || "(none)"}`,
        `Requested amount: ${app.requestedAmount}`,
        `Message: ${app.message || "(none)"}`,
        "",
        "Review it in Studio → New Frontiers.",
      ].join("\n"),
    }),
  ]);
  for (const result of results) {
    if (result.status === "rejected") console.error("[lending] application email failed:", result.reason);
  }
}

export async function sendConsentSignedEmails(app: LendingApplication) {
  const results = await Promise.allSettled([
    sendToLender("signed", app),
    sendEmailNotification({
      subject: `Agreement ${app.agreementNumber} signed by ${app.fullName}`,
      text: `${app.fullName} digitally signed agreement ${app.agreementNumber} (${formatCedis(app.negotiatedAmount)}) on ${formatDateTime(app.consentAt)}.`,
    }),
  ]);
  for (const result of results) {
    if (result.status === "rejected") console.error("[lending] consent email failed:", result.reason);
  }
}

/**
 * Sends the lender the email owed for the application's current status, at
 * most once (tracked in `notifications`). Safe to call repeatedly — which is
 * why the unauthenticated /api/lending/notify endpoint can expose it.
 */
export async function sendEmailForCurrentStatus(
  id: string,
): Promise<{ sent?: LendingEmailKind; skipped?: string }> {
  const app = await getApplicationById(id);
  if (!app) return { skipped: "not found" };

  const kind = EMAIL_FOR_STATUS[app.status];
  if (!kind) return { skipped: "no email for this status" };
  // Once per entry into the status — so after an admin override moves an
  // application back, re-approving it emails the lender the new terms.
  const since = enteredCurrentStatusAt(app);
  if (app.notifications?.some((n) => n.kind === kind && n.sentAt >= since)) return { skipped: "already sent" };

  await sendToLender(kind, app);
  await recordNotification(app, kind);
  return { sent: kind };
}
