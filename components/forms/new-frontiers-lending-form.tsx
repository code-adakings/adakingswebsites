"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";
import { trackEvent } from "@/lib/analytics";
import {
  submitNewFrontiersLending,
  type NewFrontiersLendingState,
} from "@/lib/actions/new-frontiers";

const initialNewFrontiersLendingState: NewFrontiersLendingState = { status: "idle" };

const DEFAULT_INVESTMENT_AMOUNTS = [
  "GHS 1,000",
  "GHS 2,500",
  "GHS 5,000",
  "GHS 10,000",
  "GHS 20,000",
  "GHS 50,000+",
];

const DEFAULT_ACKNOWLEDGEMENT_TEXT =
  "I understand this is a private lending facility and not an equity investment.";

const DEFAULT_SUBMIT_LABEL = "Request Lending Agreement";

export function NewFrontiersLendingForm({
  investmentAmountOptions = DEFAULT_INVESTMENT_AMOUNTS,
  acknowledgementText = DEFAULT_ACKNOWLEDGEMENT_TEXT,
  submitLabel = DEFAULT_SUBMIT_LABEL,
}: {
  investmentAmountOptions?: string[];
  acknowledgementText?: string;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState<NewFrontiersLendingState, FormData>(
    submitNewFrontiersLending,
    initialNewFrontiersLendingState,
  );
  const [agreed, setAgreed] = React.useState(false);
  const tracked = React.useRef(false);

  React.useEffect(() => {
    if (state.status === "success" && !tracked.current) {
      tracked.current = true;
      trackEvent("new_frontiers_submit");
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-10 text-center">
        <CheckCircle2 className="size-10 text-brand-gold" />
        <p className="text-lg font-semibold text-white">Request received</p>
        <p className="max-w-sm text-sm text-white/70">{state.message}</p>
        {state.applicationPath ? (
          <Link
            href={state.applicationPath}
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:underline"
          >
            View your application <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-white">
            Full Name
          </label>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
            aria-invalid={Boolean(state.errors?.fullName)}
            aria-describedby={state.errors?.fullName ? "fullName-error" : undefined}
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
          />
          {state.errors?.fullName ? (
            <p id="fullName-error" className="text-xs font-medium text-red-400">
              {state.errors.fullName}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-white">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            aria-invalid={Boolean(state.errors?.phone)}
            aria-describedby={state.errors?.phone ? "phone-error" : undefined}
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
          />
          {state.errors?.phone ? (
            <p id="phone-error" className="text-xs font-medium text-red-400">
              {state.errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(state.errors?.email)}
          aria-describedby={state.errors?.email ? "email-error" : undefined}
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
        />
        {state.errors?.email ? (
          <p id="email-error" className="text-xs font-medium text-red-400">
            {state.errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium text-white">
          Residential Address
        </label>
        <Input
          id="address"
          name="address"
          autoComplete="street-address"
          required
          aria-invalid={Boolean(state.errors?.address)}
          aria-describedby={state.errors?.address ? "address-error" : undefined}
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
        />
        {state.errors?.address ? (
          <p id="address-error" className="text-xs font-medium text-red-400">
            {state.errors.address}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium text-white">
          Intended Investment Amount
        </label>
        <select
          id="amount"
          name="amount"
          required
          defaultValue=""
          aria-invalid={Boolean(state.errors?.amount)}
          aria-describedby={state.errors?.amount ? "amount-error" : undefined}
          className={cn(
            "h-8 w-full min-w-0 rounded-lg border border-white/20 bg-white/10 px-2.5 text-base text-white transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm",
            "[&_option]:text-foreground",
          )}
        >
          <option value="" disabled>
            Select an amount
          </option>
          {investmentAmountOptions.map((amount) => (
            <option key={amount} value={amount}>
              {amount}
            </option>
          ))}
        </select>
        {state.errors?.amount ? (
          <p id="amount-error" className="text-xs font-medium text-red-400">
            {state.errors.amount}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-white">
          Message <span className="font-normal text-white/50">(optional)</span>
        </label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Anything you'd like us to know before we send your agreement."
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="acknowledged" className="flex items-start gap-3 text-sm text-white/80">
          <input
            id="acknowledged"
            name="acknowledged"
            type="checkbox"
            required
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            aria-invalid={Boolean(state.errors?.acknowledged)}
            aria-describedby={state.errors?.acknowledged ? "acknowledged-error" : undefined}
            className="mt-0.5 size-4 shrink-0 rounded border-white/30 bg-white/10 text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <span>{acknowledgementText}</span>
        </label>
        {state.errors?.acknowledged ? (
          <p id="acknowledged-error" className="text-xs font-medium text-red-400">
            {state.errors.acknowledged}
          </p>
        ) : null}
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm font-medium text-red-400">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={!agreed || isPending}
        className="h-11 w-full bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
      >
        {isPending ? "Submitting…" : submitLabel}
      </Button>
    </form>
  );
}
