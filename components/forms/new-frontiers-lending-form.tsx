"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";
import { trackEvent } from "@/lib/analytics";

const INVESTMENT_AMOUNTS = [
  "GHS 1,000",
  "GHS 2,500",
  "GHS 5,000",
  "GHS 10,000",
  "GHS 20,000",
  "GHS 50,000+",
];

type LendingFormPayload = {
  fullName: string;
  phone: string;
  email: string;
  amount: string;
  message: string;
  acknowledged: boolean;
};

export function NewFrontiersLendingForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload: LendingFormPayload = {
      fullName: String(data.get("fullName") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      amount: String(data.get("amount") ?? ""),
      message: String(data.get("message") ?? ""),
      acknowledged: data.get("acknowledged") === "on",
    };

    setIsSubmitting(true);
    console.log("Operation New Frontiers — lending agreement request", payload);
    trackEvent("new_frontiers_submit");
    setIsSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-10 text-center">
        <CheckCircle2 className="size-10 text-brand-gold" />
        <p className="text-lg font-semibold text-white">Request received</p>
        <p className="max-w-sm text-sm text-white/70">
          Thank you. We&rsquo;ll personally reach out with the lending agreement, repayment
          schedule, and onboarding instructions.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
          />
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
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
          />
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
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
        />
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
          className={cn(
            "h-8 w-full min-w-0 rounded-lg border border-white/20 bg-white/10 px-2.5 text-base text-white transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm",
            "[&_option]:text-foreground",
          )}
        >
          <option value="" disabled>
            Select an amount
          </option>
          {INVESTMENT_AMOUNTS.map((amount) => (
            <option key={amount} value={amount}>
              {amount}
            </option>
          ))}
        </select>
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

      <label htmlFor="acknowledged" className="flex items-start gap-3 text-sm text-white/80">
        <input
          id="acknowledged"
          name="acknowledged"
          type="checkbox"
          required
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-white/30 bg-white/10 text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <span>
          I understand this is a private lending facility and not an equity investment.
        </span>
      </label>

      <Button
        type="submit"
        disabled={!agreed || isSubmitting}
        className="h-11 w-full bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
      >
        {isSubmitting ? "Submitting…" : "Request Lending Agreement"}
      </Button>
    </form>
  );
}
