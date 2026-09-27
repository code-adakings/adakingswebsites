"use server";

import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { sendNewApplicationAlert, type NewApplicationAlert } from "@/lib/careers-emails";
import { isAcceptingApplications } from "@/lib/career-utils";
import {
  isEmploymentType,
  normalizeGhanaPhone,
  readApplicationValues,
  validateApplication,
} from "@/lib/job-application";
import type { JobApplicationResult, JobPostingCard } from "@/types/career";

/** Honeypot input name; real visitors never see or fill it. */
const HONEYPOT_FIELD = "hp_field";

const PDF_MAGIC = "%PDF-";

type JobForApplication = Pick<JobPostingCard, "_id" | "title" | "status" | "deadline">;

function readCv(formData: FormData): File | null {
  const value = formData.get("cv");
  // An empty file input still submits a zero-byte, nameless File.
  return value instanceof File && value.size > 0 ? value : null;
}

export async function submitJobApplication(formData: FormData): Promise<JobApplicationResult> {
  if (String(formData.get(HONEYPOT_FIELD) ?? "")) {
    // Pretend it worked so bots don't learn to adapt.
    return { status: "success", message: "Application received." };
  }

  const values = readApplicationValues(formData);
  const cv = readCv(formData);
  const errors = validateApplication(values, cv && { name: cv.name, size: cv.size, type: cv.type });
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields and try again.", errors };
  }

  if (!writeClient) {
    console.error("[careers] SANITY_API_WRITE_TOKEN is not set; cannot save job applications.");
    return {
      status: "error",
      message: "Applications are temporarily unavailable. Please try again later.",
    };
  }

  const jobId = String(formData.get("jobId") ?? "");
  const job = jobId
    ? await writeClient.fetch<JobForApplication | null>(
        `*[_type == "jobPosting" && _id == $jobId][0]{ _id, title, status, deadline }`,
        { jobId },
      )
    : null;
  if (!job || !isAcceptingApplications(job)) {
    return { status: "error", message: "This position is no longer accepting applications." };
  }

  const phone = normalizeGhanaPhone(values.phone) ?? values.phone;
  const employmentType = isEmploymentType(values.employmentType) ? values.employmentType : null;
  let cvAssetId: string | null = null;
  let applicationId = "";

  try {
    if (cv) {
      const bytes = Buffer.from(await cv.arrayBuffer());
      // The browser-reported type is just a hint; check the file really is a PDF.
      if (bytes.subarray(0, PDF_MAGIC.length).toString("latin1") !== PDF_MAGIC) {
        return {
          status: "error",
          message: "Please fix the highlighted fields and try again.",
          errors: { cv: "That file doesn't look like a valid PDF." },
        };
      }
      const asset = await writeClient.assets.upload("file", bytes, {
        // Neutral name: the original filename often contains the applicant's name.
        filename: `cv-${randomUUID()}.pdf`,
        contentType: "application/pdf",
      });
      cvAssetId = asset._id;
    }

    applicationId = `jobApplication.${randomUUID()}`;
    await writeClient.create({
      // The "." makes the document private: it never appears in anonymous API reads.
      _id: applicationId,
      _type: "jobApplication",
      status: "New",
      job: { _type: "reference", _ref: job._id, _weak: true },
      jobTitle: job.title,
      fullName: values.fullName,
      phone,
      ...(values.email ? { email: values.email } : {}),
      areaOfResidence: values.areaOfResidence,
      ...(employmentType ? { employmentType } : {}),
      introduction: values.introduction,
      ...(cvAssetId ? { cv: { _type: "file", asset: { _type: "reference", _ref: cvAssetId } } } : {}),
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[careers] saving job application failed:", error);
    if (cvAssetId) {
      // Don't leave an orphaned CV behind if the application itself wasn't saved.
      await writeClient.delete(cvAssetId).catch(() => undefined);
    }
    return {
      status: "error",
      message: "Something went wrong sending your application. Please try again in a moment.",
    };
  }

  // The application is already saved, so a mail outage must never fail it or
  // slow the applicant's response: send the alert after the response is flushed.
  const alert: NewApplicationAlert = {
    applicationId,
    jobTitle: job.title,
    fullName: values.fullName,
    phone,
    email: values.email || undefined,
    areaOfResidence: values.areaOfResidence,
    employmentType: employmentType ?? undefined,
    introduction: values.introduction,
    hasCv: Boolean(cvAssetId),
  };
  after(() =>
    sendNewApplicationAlert(alert).catch((error) => {
      console.error(`[careers] new-application email failed for ${applicationId}:`, error);
    }),
  );

  return {
    status: "success",
    message: `Thanks, ${values.fullName.split(" ")[0]}! We've received your application for ${job.title} and will be in touch.`,
  };
}
