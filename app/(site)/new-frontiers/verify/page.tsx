import type { Metadata } from "next";
import { Search, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { cn } from "cn";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  agreementFingerprint,
  agreementTerms,
  getApplicationForVerification,
  getLendingSettings,
  type LendingApplication,
} from "@/lib/lending/server";
import { formatCedis, formatDate, formatDateTime, formatPercent, isExecuted } from "@/lib/lending/shared";

/**
 * Public agreement verification — where the QR code on every executed PDF
 * points. It needs the agreement number plus the verification code printed
 * beside the QR code, so it confirms a document someone already holds
 * without exposing the lender's private token or letting anyone browse
 * agreements. Any mismatch reads the same as "not found".
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify a Lending Agreement",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

type Props = { searchParams: Promise<{ ref?: string | string[]; code?: string | string[] }> };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

export default async function VerifyAgreementPage({ searchParams }: Props) {
  const params = await searchParams;
  const ref = first(params.ref);
  const code = first(params.code);
  const submitted = Boolean(ref || code);

  const app = ref && code ? await getApplicationForVerification(ref, code) : null;

  return (
    <>
      <header className="bg-brand-black py-10 text-white sm:py-14">
        <Container className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-brand-gold uppercase">Operation New Frontiers</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">Agreement Verification</h1>
          <p className="mt-2 text-white/70">
            Check that a lending agreement issued by Adakings is genuine and unaltered.
          </p>
        </Container>
      </header>
      <section className="py-10 sm:py-14">
        <Container className="max-w-3xl space-y-10">
          {submitted ? app ? <Result app={app} /> : <NotVerified /> : null}

          <form method="get" className="space-y-4 rounded-3xl border border-border p-6 sm:p-8">
            <p className="font-semibold">Enter the details printed beside the QR code</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="ref" className="text-sm font-medium">
                  Agreement number
                </label>
                <Input id="ref" name="ref" defaultValue={ref} placeholder="ONF-2026-0001" className="h-11 font-mono uppercase" />
              </div>
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Verification code
                </label>
                <Input id="code" name="code" defaultValue={code} placeholder="XXXX-XXXX-XXXX" className="h-11 font-mono uppercase" />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full px-6 text-base sm:w-auto">
              <Search className="size-4" /> Verify
            </Button>
          </form>
        </Container>
      </section>
    </>
  );
}

function NotVerified() {
  return (
    <Banner icon={ShieldAlert} tone="negative" title="Not verified">
      No agreement matches this agreement number and verification code. Check both against the document. If they
      match exactly, treat the document as not genuine and contact Adakings directly.
    </Banner>
  );
}

async function Result({ app }: { app: LendingApplication }) {
  if (!isExecuted(app)) {
    return (
      <Banner icon={ShieldQuestion} tone="caution" title="Not yet executed">
        Agreement {app.agreementNumber} exists but has not been executed. Only an executed agreement is legally
        binding.
      </Banner>
    );
  }

  const settings = await getLendingSettings();
  const parties = agreementTerms(app, settings);
  // Agreements without a stored fingerprint (signed before fingerprints existed) can't be integrity-checked.
  const intact = app.agreementHash ? app.agreementHash === agreementFingerprint(app, settings) : null;

  const rows: [string, string][] = [
    ["Agreement number", app.agreementNumber ?? "—"],
    ["Status", app.status === "COMPLETED" ? "Executed · Archived" : "Executed · Active"],
    ["Lender", app.fullName],
    ["Borrower", parties.borrowerCompany],
    ["Principal", formatCedis(app.negotiatedAmount)],
    ["Interest rate", formatPercent(app.interestRate)],
    ["Total repayment", formatCedis(app.repaymentAmount)],
    ["Funding date", formatDate(app.fundedDate)],
    ["Maturity date", formatDate(app.maturityDate)],
    ["Payment reference", app.paymentReference ?? app.agreementNumber ?? "—"],
    ["Executed (lender consent)", formatDateTime(app.consentAt)],
  ];

  return (
    <div className="space-y-6">
      {intact === false ? (
        <Banner icon={ShieldAlert} tone="negative" title="Record mismatch">
          Agreement {app.agreementNumber} is genuine, but its current record no longer matches the fingerprint taken
          when the lender consented. Contact Adakings before relying on it.
        </Banner>
      ) : (
        <Banner icon={ShieldCheck} tone="positive" title="Authentic agreement">
          This agreement was issued by {parties.borrowerCompany} and executed electronically. Compare the details
          below with your document — they must match exactly.
        </Banner>
      )}

      <dl className="divide-y divide-border rounded-2xl border border-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      {app.agreementHash ? (
        <p className="text-xs break-all text-muted-foreground">
          Fingerprint (SHA-256): <span className="font-mono">{app.agreementHash}</span>
          {intact ? " — matches the current record." : null}
        </p>
      ) : null}
    </div>
  );
}

function Banner({
  icon: Icon,
  tone,
  title,
  children,
}: {
  icon: typeof ShieldCheck;
  tone: "positive" | "negative" | "caution";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-2xl border p-5 text-sm leading-relaxed",
        tone === "positive" && "border-emerald-600/25 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
        tone === "negative" && "border-destructive/30 bg-destructive/5 text-destructive",
        tone === "caution" && "border-brand-gold/40 bg-brand-gold/10",
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1">{children}</p>
      </div>
    </div>
  );
}
