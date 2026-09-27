"use client";

import * as React from "react";
import { FileText, Info, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/lib/analytics";
import { submitJobApplication } from "@/lib/actions/job-application";
import {
  APPLICATION_FIELDS,
  INTRO_MAX,
  MAX_CV_LABEL,
  isApplicationField,
  readApplicationValues,
  validateApplication,
  validateCv,
  type CvMeta,
} from "@/lib/job-application";
import { EMPLOYMENT_TYPES, type EmploymentType, type JobApplicationErrors } from "@/types/career";

const CV_HINT = `Optional, but a CV helps us review your application properly. PDF only, up to ${MAX_CV_LABEL}.`;

function cvMeta(file: File | null): CvMeta | null {
  return file && { name: file.name, size: file.size, type: file.type };
}

function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function Field({
  id,
  label,
  required,
  recommended,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  /** Optional, but shown with a "Recommended" tag instead of "(optional)". */
  recommended?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? (
          <span className="text-primary" aria-hidden>
            {" "}
            *
          </span>
        ) : recommended ? (
          <Badge variant="outline" className="ml-2 border-primary/20 bg-primary/5 align-middle text-primary">
            Recommended
          </Badge>
        ) : (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** aria wiring shared by every control. */
function describedBy(id: string, error?: string, hint?: string) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}

export function ApplicationForm({
  jobId,
  jobTitle,
  defaultEmploymentType,
}: {
  jobId: string;
  jobTitle: string;
  defaultEmploymentType: EmploymentType;
}) {
  const [errors, setErrors] = React.useState<JobApplicationErrors>({});
  const [cv, setCv] = React.useState<File | null>(null);
  const [introLength, setIntroLength] = React.useState(0);
  const [isSubmitting, startSubmit] = React.useTransition();
  const cvInputRef = React.useRef<HTMLInputElement>(null);

  function clearError(name: string) {
    if (!isApplicationField(name)) return;
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function handleCvChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    const error = validateCv(cvMeta(file));
    setCv(file);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next.cv = error;
      else delete next.cv;
      return next;
    });
  }

  function removeCv() {
    setCv(null);
    clearError("cv");
    if (cvInputRef.current) cvInputRef.current.value = "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validateApplication(readApplicationValues(formData), cvMeta(cv));
    showErrors(form, nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    formData.set("jobId", jobId);
    // An untouched file input still submits an empty File; drop it.
    if (!cv) formData.delete("cv");

    startSubmit(async () => {
      let result;
      try {
        result = await submitJobApplication(formData);
      } catch {
        // Network failure, or the request was rejected before reaching the action.
        toast.error("We couldn't send your application", {
          description: "Please check your connection and try again.",
        });
        return;
      }

      if (result.status === "error") {
        if (result.errors) showErrors(form, result.errors);
        toast.error("Application not sent", { description: result.message });
        return;
      }

      trackEvent("career_apply", { method: "application_form", role: jobTitle });
      toast.success("Application received", { description: result.message });
      form.reset();
      setCv(null);
      setIntroLength(0);
      setErrors({});
    });
  }

  function showErrors(form: HTMLFormElement, nextErrors: JobApplicationErrors) {
    setErrors(nextErrors);
    const firstInvalid = APPLICATION_FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={(event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement && target.type === "file") return;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
          clearError(target.name);
        }
      }}
      noValidate
      aria-label={`Apply for ${jobTitle}`}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full name" required error={errors.fullName} className="sm:col-span-2">
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
            className="h-10"
            {...describedBy("fullName", errors.fullName)}
          />
        </Field>

        <Field id="phone" label="Phone number" required error={errors.phone} hint="Ghana number, e.g. 024 123 4567">
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="024 123 4567"
            required
            className="h-10"
            {...describedBy("phone", errors.phone, "Ghana number, e.g. 024 123 4567")}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="h-10"
            {...describedBy("email", errors.email)}
          />
        </Field>

        <Field
          id="areaOfResidence"
          label="Area of residence"
          required
          error={errors.areaOfResidence}
          hint="e.g. Legon, Madina, East Legon"
        >
          <Input
            id="areaOfResidence"
            name="areaOfResidence"
            autoComplete="address-level2"
            required
            className="h-10"
            {...describedBy("areaOfResidence", errors.areaOfResidence, "e.g. Legon, Madina, East Legon")}
          />
        </Field>

        <Field id="employmentType" label="Employment type" error={errors.employmentType}>
          <select
            id="employmentType"
            name="employmentType"
            defaultValue={defaultEmploymentType}
            {...describedBy("employmentType", errors.employmentType)}
            className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm"
          >
            <option value="">No preference</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="introduction" label="Short introduction" required error={errors.introduction}>
        <Textarea
          id="introduction"
          name="introduction"
          rows={5}
          required
          maxLength={INTRO_MAX}
          placeholder="Tell us about yourself, any relevant experience, and why you'd like to join Adakings."
          onInput={(event) => setIntroLength(event.currentTarget.value.length)}
          className="min-h-32"
          {...describedBy("introduction", errors.introduction)}
        />
        <p className="text-right text-xs text-muted-foreground" aria-live="polite">
          {introLength}/{INTRO_MAX}
        </p>
      </Field>

      <Field id="cv" label="Upload CV" recommended error={errors.cv} hint={CV_HINT}>
        <input
          ref={cvInputRef}
          id="cv"
          name="cv"
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleCvChange}
          className="peer sr-only"
          {...describedBy("cv", errors.cv, CV_HINT)}
        />
        {cv && !errors.cv ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{cv.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(cv.size)}</p>
            </div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={removeCv} aria-label="Remove CV">
              <X />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="cv"
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-input bg-background px-4 py-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/5 peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
              errors.cv && "border-destructive",
            )}
          >
            <Upload className="size-5 text-muted-foreground" aria-hidden />
            <span className="text-sm font-medium">
              <span className="text-primary">Choose a file</span> to upload
            </span>
          </label>
        )}
      </Field>

      {!cv ? (
        <p className="flex gap-2 rounded-xl border border-brand-gold/40 bg-brand-gold/10 p-3 text-sm text-foreground/80">
          <Info className="mt-0.5 size-4 shrink-0 text-brand-gold-dark" aria-hidden />
          <span>
            No CV attached yet. You can still apply without one, but a CV gives our hiring team a much fuller picture of
            your experience.
          </span>
        </p>
      ) : null}

      {/* Honeypot: hidden from people and assistive tech; bots that fill it are dropped server-side. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="hp_field">Leave this field empty</label>
        <input id="hp_field" name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-11 w-full bg-primary text-base text-primary-foreground hover:bg-brand-red-dark"
      >
        {isSubmitting ? "Submitting…" : "Submit application"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Fields marked <span className="text-primary">*</span> are required. We only use your details to review
        your application.
      </p>
    </form>
  );
}
