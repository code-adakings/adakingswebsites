"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/lib/analytics";
import {
  submitFranchiseEnquiry,
  initialFranchiseEnquiryState,
  type FranchiseEnquiryState,
} from "@/lib/actions/franchise";

const FIELDS: {
  name: keyof NonNullable<FranchiseEnquiryState["errors"]>;
  label: string;
  type?: string;
  autoComplete?: string;
}[] = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "country", label: "Country", autoComplete: "country-name" },
];

export function FranchiseEnquiryForm() {
  const [state, formAction, isPending] = useActionState<FranchiseEnquiryState, FormData>(
    submitFranchiseEnquiry,
    initialFranchiseEnquiryState,
  );
  const tracked = React.useRef(false);

  React.useEffect(() => {
    if (state.status === "success" && !tracked.current) {
      tracked.current = true;
      trackEvent("franchise_submit");
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-muted/40 p-10 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="text-lg font-semibold">Enquiry received</p>
        <p className="max-w-sm text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map(({ name, label, type, autoComplete }) => (
          <div key={name} className="space-y-2">
            <label htmlFor={name} className="text-sm font-medium">
              {label}
            </label>
            <Input
              id={name}
              name={name}
              type={type ?? "text"}
              autoComplete={autoComplete}
              required
              aria-invalid={Boolean(state.errors?.[name])}
              aria-describedby={state.errors?.[name] ? `${name}-error` : undefined}
            />
            {state.errors?.[name] ? (
              <p id={`${name}-error`} className="text-xs text-destructive">
                {state.errors[name]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="businessExperience" className="text-sm font-medium">
          Business experience
        </label>
        <Textarea
          id="businessExperience"
          name="businessExperience"
          rows={3}
          required
          placeholder="Tell us about your relevant business or operational experience."
          aria-invalid={Boolean(state.errors?.businessExperience)}
          aria-describedby={state.errors?.businessExperience ? "businessExperience-error" : undefined}
        />
        {state.errors?.businessExperience ? (
          <p id="businessExperience-error" className="text-xs text-destructive">
            {state.errors.businessExperience}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="investmentInterest" className="text-sm font-medium">
          Investment interest
        </label>
        <Input
          id="investmentInterest"
          name="investmentInterest"
          required
          placeholder="e.g. Ready to invest within the next 6 months"
          aria-invalid={Boolean(state.errors?.investmentInterest)}
          aria-describedby={state.errors?.investmentInterest ? "investmentInterest-error" : undefined}
        />
        {state.errors?.investmentInterest ? (
          <p id="investmentInterest-error" className="text-xs text-destructive">
            {state.errors.investmentInterest}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Tell us about your target market and why you'd like to franchise with Adakings."
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
        />
        {state.errors?.message ? (
          <p id="message-error" className="text-xs text-destructive">
            {state.errors.message}
          </p>
        ) : null}
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground hover:bg-brand-red-dark"
      >
        {isPending ? "Submitting…" : "Submit Enquiry"}
      </Button>
    </form>
  );
}
