"use client";

import * as React from "react";
import { useActionState } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signLendingAgreement, type LendingConsentState } from "@/lib/actions/lending-consent";

export function LendingConsentForm({ token, lenderName }: { token: string; lenderName: string }) {
  const [state, formAction, isPending] = useActionState<LendingConsentState, FormData>(
    signLendingAgreement.bind(null, token),
    {},
  );
  const [agreed, setAgreed] = React.useState(false);
  const [name, setName] = React.useState("");

  return (
    <form action={formAction} className="space-y-5">
      <label htmlFor="consent" className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary"
        />
        <span>
          I have read and agree to the terms of this Lending Agreement. I understand this constitutes my
          electronic signature.
        </span>
      </label>

      <div className="space-y-2">
        <label htmlFor="signatureName" className="text-sm font-medium">
          Type your full name to sign
        </label>
        <Input
          id="signatureName"
          name="signatureName"
          autoComplete="name"
          placeholder={lenderName}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11 font-serif text-lg italic"
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={!agreed || !name.trim() || isPending} className="h-11 w-full text-base sm:w-auto sm:px-8">
        <PenLine className="size-4" />
        {isPending ? "Signing…" : "Sign Agreement"}
      </Button>
    </form>
  );
}
