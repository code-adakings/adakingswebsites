"use server";

import { sendEmailNotification } from "@/lib/email";
import { createApplication } from "@/lib/lending/server";
import { sendApplicationReceivedEmails } from "@/lib/lending/emails";

type NewFrontiersFields = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  amount: string;
  message: string;
  acknowledged: boolean;
};

export type NewFrontiersFieldErrors = Partial<Record<keyof Omit<NewFrontiersFields, "message">, string>>;

export type NewFrontiersLendingState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: NewFrontiersFieldErrors;
  /** The lender's private application page, when the application was saved. */
  applicationPath?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function submitNewFrontiersLending(
  _prevState: NewFrontiersLendingState,
  formData: FormData,
): Promise<NewFrontiersLendingState> {
  const values: NewFrontiersFields = {
    fullName: field(formData, "fullName"),
    phone: field(formData, "phone"),
    email: field(formData, "email"),
    address: field(formData, "address"),
    amount: field(formData, "amount"),
    message: field(formData, "message"),
    acknowledged: formData.get("acknowledged") === "on",
  };

  const errors: NewFrontiersFieldErrors = {};
  if (!values.fullName) errors.fullName = "Full name is required.";
  if (!values.phone) errors.phone = "Phone number is required.";
  if (!values.email) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address.";
  if (!values.address) errors.address = "Residential address is required for your agreement.";
  if (!values.amount) errors.amount = "Select an intended investment amount.";
  if (!values.acknowledged) errors.acknowledged = "You must acknowledge this before submitting.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      errors,
      message: "Please fix the highlighted fields and try again.",
    };
  }

  const { amount, ...applicant } = values;

  try {
    const application = await createApplication({ ...applicant, requestedAmount: amount });
    await sendApplicationReceivedEmails(application);
    return {
      status: "success",
      applicationPath: `/new-frontiers/d/${application.publicToken}`,
      message:
        "Thank you. We've emailed you a link to your private application page, and we'll reach out shortly to discuss terms.",
    };
  } catch (error) {
    console.error("[new-frontiers] saving application failed:", error);
  }

  // Couldn't save the application (e.g. Sanity unconfigured) — still capture
  // the lead by email so the team can follow up manually.
  try {
    await sendEmailNotification({
      subject: `New Operation New Frontiers enquiry (NOT SAVED) — ${values.fullName}`,
      replyTo: values.email,
      text: [
        "A lending application was submitted but could not be saved to Sanity. Follow up manually.",
        "",
        `Name: ${values.fullName}`,
        `Phone: ${values.phone}`,
        `Email: ${values.email}`,
        `Address: ${values.address}`,
        `Intended amount: ${values.amount}`,
        `Message: ${values.message || "(none)"}`,
      ].join("\n"),
    });
    return {
      status: "success",
      message: "Thank you. We'll personally reach out to discuss terms and your lending agreement.",
    };
  } catch (error) {
    console.error("[new-frontiers] fallback notification failed:", error);
    return {
      status: "error",
      message: "Something went wrong submitting your request. Please try again or email us directly.",
    };
  }
}
