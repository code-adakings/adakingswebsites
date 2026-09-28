import "server-only";
import { NOTIFY_EMAIL, sendEmailNotification, senderAs } from "@/lib/email";
import { siteConfig } from "@/lib/site-config";

/** Hiring-team inbox. Falls back to the general form-notification address. */
export const CAREERS_NOTIFY_EMAIL = process.env.CAREERS_NOTIFY_EMAIL || NOTIFY_EMAIL;

/** Careers sender. Must be on a Resend-verified domain; defaults to the site sender renamed. */
const CAREERS_FROM_EMAIL = process.env.CAREERS_FROM_EMAIL || senderAs("Adakings Careers");

export type NewApplicationAlert = {
  applicationId: string;
  jobTitle: string;
  fullName: string;
  phone: string;
  email?: string;
  areaOfResidence: string;
  employmentType?: string;
  introduction: string;
  hasCv: boolean;
};

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Opens the document in Studio (sign-in required), where the CV can be downloaded. */
function studioUrl(applicationId: string) {
  return `${siteConfig.url}/studio/intent/edit/id=${encodeURIComponent(applicationId)};type=jobApplication/`;
}

export async function sendNewApplicationAlert(app: NewApplicationAlert): Promise<void> {
  const url = studioUrl(app.applicationId);
  const rows: [string, string][] = [
    ["Position", app.jobTitle],
    ["Name", app.fullName],
    ["Phone", app.phone],
    ["Email", app.email || "Not provided"],
    ["Area of residence", app.areaOfResidence],
    ["Employment type", app.employmentType || "No preference"],
    ["CV", app.hasCv ? "Attached (open in Studio)" : "Not provided"],
  ];

  const text = [
    `New application for ${app.jobTitle}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Introduction:",
    app.introduction,
    "",
    `Review in Studio: ${url}`,
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#f5f5f4;font-family:Helvetica,Arial,sans-serif;color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#111;padding:20px 28px;color:#d4a017;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">Adakings Careers</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px">New application: ${escapeHtml(app.jobTitle)}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid #e7e5e4;border-radius:10px">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 14px;font-size:13px;color:#666;border-bottom:1px solid #f0efee">${escapeHtml(label)}</td><td align="right" style="padding:10px 14px;font-size:14px;font-weight:bold;border-bottom:1px solid #f0efee">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>
<p style="margin:0 0 6px;font-size:13px;color:#666">Introduction</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.55;color:#333;white-space:pre-line">${escapeHtml(app.introduction)}</p>
<a href="${url}" style="display:inline-block;background:#ce1126;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:bold;font-size:15px">Review in Studio</a>
<p style="margin:24px 0 0;font-size:12px;color:#888">Update the status and add notes in Studio → Careers → Applications.${app.email ? " Reply to this email to contact the applicant." : ""}</p>
</td></tr></table>
<p style="font-size:12px;color:#999;margin:16px 0 0">Adakings Careers · adakings.com</p>
</td></tr></table></body></html>`;

  await sendEmailNotification({
    to: CAREERS_NOTIFY_EMAIL,
    from: CAREERS_FROM_EMAIL,
    subject: `New application: ${app.jobTitle} · ${app.fullName}${app.hasCv ? "" : " (no CV)"}`,
    text,
    html,
    replyTo: app.email,
  });
}
