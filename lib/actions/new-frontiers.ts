"use server";

import { saveNewFrontiersLead, type NewFrontiersLead } from "@/lib/new-frontiers-leads";

type NewFrontiersLeadFields = Omit<NewFrontiersLead, "submittedAt">;

export type NewFrontiersFieldErrors = Partial<
  Record<keyof Omit<NewFrontiersLeadFields, "message">, string>
>;

export type NewFrontiersLendingState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: NewFrontiersFieldErrors;
};

export const initialNewFrontiersLendingState: NewFrontiersLendingState = { status: "idle" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function submitNewFrontiersLending(
  _prevState: NewFrontiersLendingState,
  formData: FormData,
): Promise<NewFrontiersLendingState> {
  const values: NewFrontiersLeadFields = {
    fullName: field(formData, "fullName"),
    phone: field(formData, "phone"),
    email: field(formData, "email"),
    amount: field(formData, "amount"),
    message: field(formData, "message"),
    acknowledged: formData.get("acknowledged") === "on",
  };

  const errors: NewFrontiersFieldErrors = {};
  if (!values.fullName) errors.fullName = "Full name is required.";
  if (!values.phone) errors.phone = "Phone number is required.";
  if (!values.email) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address.";
  if (!values.amount) errors.amount = "Select an intended investment amount.";
  if (!values.acknowledged) errors.acknowledged = "You must acknowledge this before submitting.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      errors,
      message: "Please fix the highlighted fields and try again.",
    };
  }

  try {
    await saveNewFrontiersLead({ ...values, submittedAt: new Date().toISOString() });
  } catch {
    return {
      status: "error",
      message: "Something went wrong submitting your request. Please try again or email us directly.",
    };
  }

  return {
    status: "success",
    message:
      "Thank you. We'll personally reach out with the lending agreement, repayment schedule, and onboarding instructions.",
  };
}
