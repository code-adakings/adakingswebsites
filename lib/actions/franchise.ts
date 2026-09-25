"use server";

import { saveFranchiseLead, type FranchiseLead } from "@/lib/franchise-leads";

type FranchiseLeadFields = Omit<FranchiseLead, "submittedAt">;

export type FranchiseEnquiryFieldErrors = Partial<Record<keyof FranchiseLeadFields, string>>;

export type FranchiseEnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FranchiseEnquiryFieldErrors;
};

export const initialFranchiseEnquiryState: FranchiseEnquiryState = { status: "idle" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function submitFranchiseEnquiry(
  _prevState: FranchiseEnquiryState,
  formData: FormData,
): Promise<FranchiseEnquiryState> {
  const values: FranchiseLeadFields = {
    fullName: field(formData, "fullName"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
    city: field(formData, "city"),
    country: field(formData, "country"),
    businessExperience: field(formData, "businessExperience"),
    investmentInterest: field(formData, "investmentInterest"),
    message: field(formData, "message"),
  };

  const errors: FranchiseEnquiryFieldErrors = {};
  if (!values.fullName) errors.fullName = "Full name is required.";
  if (!values.email) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address.";
  if (!values.phone) errors.phone = "Phone number is required.";
  if (!values.city) errors.city = "City is required.";
  if (!values.country) errors.country = "Country is required.";
  if (!values.businessExperience) errors.businessExperience = "Tell us about your business experience.";
  if (!values.investmentInterest) errors.investmentInterest = "Tell us about your investment interest.";
  if (!values.message) errors.message = "Tell us a bit about your enquiry.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      errors,
      message: "Please fix the highlighted fields and try again.",
    };
  }

  try {
    await saveFranchiseLead({ ...values, submittedAt: new Date().toISOString() });
  } catch {
    return {
      status: "error",
      message: "Something went wrong submitting your enquiry. Please try again or email us directly.",
    };
  }

  return {
    status: "success",
    message: `Thanks, ${values.fullName.split(" ")[0]} — our franchise team will be in touch shortly.`,
  };
}
