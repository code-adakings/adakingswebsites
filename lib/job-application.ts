/**
 * Job application rules shared by the browser form (instant feedback) and the
 * server action (the real gate). Keep this file free of server-only imports.
 */
import {
  EMPLOYMENT_TYPES,
  type EmploymentType,
  type JobApplicationErrors,
  type JobApplicationField,
} from "@/types/career";

/**
 * Vercel rejects function request bodies over 4.5 MB, and the CV travels in the
 * same request as the other fields, so cap it safely below that.
 */
export const MAX_CV_BYTES = 4 * 1024 * 1024;
export const MAX_CV_LABEL = "4 MB";
export const INTRO_MIN = 30;
export const INTRO_MAX = 1000;

/** Ghana numbers: 0XXXXXXXXX, 233XXXXXXXXX or +233XXXXXXXXX (mobile 2x/5x, landline 3x). */
const GHANA_PHONE = /^(?:\+?233|0)([235]\d{8})$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Field order, used to focus the first invalid control. */
export const APPLICATION_FIELDS: readonly JobApplicationField[] = [
  "fullName",
  "phone",
  "email",
  "areaOfResidence",
  "employmentType",
  "introduction",
  "cv",
];

export type JobApplicationValues = {
  fullName: string;
  phone: string;
  email: string;
  areaOfResidence: string;
  employmentType: string;
  introduction: string;
};

export type CvMeta = { name: string; size: number; type: string };

export function isApplicationField(name: string): name is JobApplicationField {
  return (APPLICATION_FIELDS as readonly string[]).includes(name);
}

export function isEmploymentType(value: string): value is EmploymentType {
  return (EMPLOYMENT_TYPES as readonly string[]).includes(value);
}

/** Returns the number in E.164 (+233XXXXXXXXX), or null if it isn't a valid Ghana number. */
export function normalizeGhanaPhone(raw: string): string | null {
  const match = GHANA_PHONE.exec(raw.replace(/[\s().-]/g, ""));
  return match ? `+233${match[1]}` : null;
}

export function readApplicationValues(data: FormData): JobApplicationValues {
  const text = (name: keyof JobApplicationValues) => {
    const value = data.get(name);
    return typeof value === "string" ? value.trim() : "";
  };
  return {
    fullName: text("fullName"),
    phone: text("phone"),
    email: text("email"),
    areaOfResidence: text("areaOfResidence"),
    employmentType: text("employmentType"),
    introduction: text("introduction"),
  };
}

export function validateCv(cv: CvMeta | null): string | undefined {
  if (!cv) return undefined;
  const looksLikePdf = cv.name.toLowerCase().endsWith(".pdf") && (cv.type === "" || cv.type === "application/pdf");
  if (!looksLikePdf) return "Please upload your CV as a PDF file.";
  if (cv.size > MAX_CV_BYTES) return `Your CV must be ${MAX_CV_LABEL} or smaller.`;
  return undefined;
}

export function validateApplication(values: JobApplicationValues, cv: CvMeta | null): JobApplicationErrors {
  const errors: JobApplicationErrors = {};

  if (values.fullName.length < 2) errors.fullName = "Please enter your full name.";
  else if (values.fullName.length > 120) errors.fullName = "Please shorten your name to 120 characters.";
  if (!values.phone) errors.phone = "Please enter your phone number.";
  else if (!normalizeGhanaPhone(values.phone))
    errors.phone = "Enter a valid Ghana number, e.g. 024 123 4567 or +233 24 123 4567.";
  if (values.email && (!EMAIL.test(values.email) || values.email.length > 254))
    errors.email = "Please enter a valid email address.";
  if (!values.areaOfResidence) errors.areaOfResidence = "Please tell us where you live.";
  else if (values.areaOfResidence.length > 120) errors.areaOfResidence = "Please shorten this to 120 characters.";
  if (values.employmentType && !isEmploymentType(values.employmentType))
    errors.employmentType = "Please choose an employment type.";
  if (values.introduction.length < INTRO_MIN)
    errors.introduction = `Tell us a little more — at least ${INTRO_MIN} characters.`;
  else if (values.introduction.length > INTRO_MAX)
    errors.introduction = `Please keep your introduction under ${INTRO_MAX} characters.`;

  const cvError = validateCv(cv);
  if (cvError) errors.cv = cvError;

  return errors;
}
