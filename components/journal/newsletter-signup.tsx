"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="rounded-3xl bg-brand-black p-8 text-white sm:p-10">
      <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
        Stay in the loop
      </h3>
      <p className="mt-2 max-w-md text-sm text-white/70">
        Get new stories from the Adakings Journal — company news, culture, and
        recipes — straight to your inbox.
      </p>
      {submitted ? (
        <p className="mt-6 text-sm font-medium text-brand-gold">
          Thanks — we&apos;ll be in touch at {email}.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
          />
          <Button
            type="submit"
            className="shrink-0 bg-primary text-primary-foreground hover:bg-brand-red-dark"
          >
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
}
