import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, Check, Clock, Download, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { cn } from "cn";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { LendingConsentForm, ProceedToPaymentForm } from "@/components/lending/consent-form";
import {
  agreementTerms,
  getApplicationByToken,
  getLendingSettings,
  renderClauses,
  type LendingApplication,
  type LendingSettings,
} from "@/lib/lending/server";
import {
  formatCedis,
  formatDate,
  formatDateTime,
  formatPercent,
  isAtLeast,
  isExecuted,
} from "@/lib/lending/shared";

/**
 * A lender's private deal page — the only place their agreement lives. The
 * unguessable token in the URL is the access key, so the page is never
 * cached, indexed, or leaked via Referer. What it shows unlocks one status
 * at a time: review → provisional terms → payment details → consent → PDF.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Lending Agreement",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

type Params = { params: Promise<{ token: string }> };

export default async function LendingDealPage({ params }: Params) {
  const { token } = await params;
  const [app, settings] = await Promise.all([getApplicationByToken(token), getLendingSettings()]);
  if (!app) notFound();

  const approved = isAtLeast(app.status, "APPROVED");
  const executed = isExecuted(app);

  return (
    <>
      <DealHeader app={app} />
      <section className="py-10 sm:py-14">
        <Container className="max-w-3xl space-y-10 sm:space-y-12">
          {approved ? (
            <>
              <TermsSummary app={app} />
              {app.status === "APPROVED" ? (
                <div className="space-y-4">
                  <Notice icon={Lock}>
                    This is your provisional agreement. Please read it carefully below. When you&apos;re ready to fund
                    it, proceed to payment to see our bank and Mobile Money details.
                  </Notice>
                  <ProceedToPaymentForm token={token} />
                </div>
              ) : null}
              {app.status === "PAYMENT_PENDING" ? <PaymentPanel app={app} settings={settings} /> : null}
              {app.status === "PAYMENT_RECEIVED" && !executed ? (
                <Notice icon={ShieldCheck} tone="positive">
                  We&apos;ve received and verified your payment of {formatCedis(app.negotiatedAmount)}. Your final
                  agreement is below — give your digital consent at the end to download the executed copy.
                </Notice>
              ) : null}
              {executed ? (
                <Notice icon={ShieldCheck} tone="positive">
                  This agreement is fully executed. Your signed PDF is available to download at the end of this page.
                </Notice>
              ) : null}
              <AgreementText app={app} settings={settings} />
              <Execution app={app} settings={settings} token={token} />
            </>
          ) : (
            <UnderReview app={app} />
          )}
        </Container>
      </section>
    </>
  );
}

const GOLD_BADGE = "border-brand-gold/50 bg-brand-gold/10 text-brand-gold";
const GREEN_BADGE = "border-emerald-400/40 bg-emerald-400/10 text-emerald-300";

function badgeFor(app: LendingApplication): { label: string; className: string } {
  switch (app.status) {
    case "APPLIED":
      return { label: "Application Received", className: "border-white/25 text-white/80" };
    case "UNDER_REVIEW":
      return { label: "Under Review", className: "border-brand-gold/50 text-brand-gold" };
    case "APPROVED":
      return { label: "Provisional", className: GOLD_BADGE };
    case "PAYMENT_PENDING":
      return { label: "Provisional · Awaiting Payment", className: GOLD_BADGE };
    case "PAYMENT_RECEIVED":
      return app.consentAt
        ? { label: "Executed", className: GREEN_BADGE }
        : { label: "Payment Verified · Awaiting Consent", className: GREEN_BADGE };
    case "COMPLETED":
      return { label: "Executed", className: GREEN_BADGE };
  }
}

// Lender-facing milestones.
const MILESTONES: { label: string; reached: (app: LendingApplication) => boolean }[] = [
  { label: "Applied", reached: () => true },
  { label: "Terms", reached: (app) => isAtLeast(app.status, "APPROVED") },
  { label: "Payment", reached: (app) => isAtLeast(app.status, "PAYMENT_PENDING") },
  { label: "Verified", reached: (app) => isAtLeast(app.status, "PAYMENT_RECEIVED") },
  { label: "Executed", reached: isExecuted },
];

function DealHeader({ app }: { app: LendingApplication }) {
  const badge = badgeFor(app);

  return (
    <header className="bg-brand-black py-10 text-white sm:py-14">
      <Container className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase", badge.className)}>
            {badge.label}
          </span>
          {app.agreementNumber ? (
            <span className="text-sm text-white/60">Agreement #{app.agreementNumber}</span>
          ) : null}
        </div>
        <p className="mt-6 text-sm font-semibold tracking-wide text-brand-gold uppercase">Operation New Frontiers</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {isAtLeast(app.status, "APPROVED") ? "Private Lending Agreement" : "Your Lending Application"}
        </h1>
        <p className="mt-2 text-white/70">Prepared for {app.fullName}</p>

        <ol className="mt-8 grid grid-cols-5 gap-2" aria-label="Progress">
          {MILESTONES.map((milestone) => {
            const reached = milestone.reached(app);
            return (
              <li key={milestone.label} className="space-y-2">
                <div className={cn("h-1 rounded-full", reached ? "bg-brand-gold" : "bg-white/15")} />
                <p className={cn("text-[11px] font-medium sm:text-xs", reached ? "text-white" : "text-white/45")}>
                  {milestone.label}
                  <span className="sr-only">{reached ? " (done)" : " (pending)"}</span>
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </header>
  );
}

function UnderReview({ app }: { app: LendingApplication }) {
  return (
    <div className="space-y-6">
      <Notice icon={Clock}>
        Thank you for your interest. We&apos;re reviewing your application and will contact you shortly to discuss
        terms. Once agreed, your provisional agreement will appear on this page and we&apos;ll email you.
      </Notice>
      <dl className="divide-y divide-border rounded-2xl border border-border">
        {[
          ["Requested amount", app.requestedAmount ?? "—"],
          ["Submitted", formatDate(app.appliedAt)],
          ["Email", app.email],
          ["Phone", app.phone],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium break-all">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TermsSummary({ app }: { app: LendingApplication }) {
  const terms = [
    ["Principal", formatCedis(app.negotiatedAmount)],
    ["Interest", formatPercent(app.interestRate)],
    ["Term", `${app.termMonths} Months`],
    ["Repayment", formatCedis(app.repaymentAmount)],
  ];
  return (
    <div className="space-y-3">
      <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border sm:grid-cols-4">
        {terms.map(([label, value], index) => (
          <div
            key={label}
            className={cn(
              "border-border p-4 sm:p-5",
              index % 2 === 0 && "border-r sm:border-r",
              index < 2 && "border-b sm:border-b-0",
              index === 1 && "sm:border-r",
              index === 3 && "bg-muted/50",
            )}
          >
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</dt>
            <dd className={cn("mt-1 text-lg font-semibold tabular-nums sm:text-xl", index === 3 && "text-primary")}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-muted-foreground">
        Maturity:{" "}
        <span className="font-medium text-foreground">
          {app.maturityDate ? formatDate(app.maturityDate) : `${app.termMonths} months from the date funds are received`}
        </span>
        {app.fundedDate ? <> · Funded {formatDate(app.fundedDate)}</> : null}
      </p>
    </div>
  );
}

function PaymentPanel({ app, settings }: { app: LendingApplication; settings: LendingSettings }) {
  const { bank, momo } = settings;
  const hasBank = Boolean(bank?.accountNumber);
  const hasMomo = Boolean(momo?.number);

  return (
    <section id="payment" className="scroll-mt-24 overflow-hidden rounded-3xl border-2 border-brand-gold/60">
      <div className="bg-brand-gold/10 p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">Amount Due</p>
        <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
          {formatCedis(app.negotiatedAmount)}
        </p>
        <p className="mt-5 text-sm text-muted-foreground">Use your unique reference when paying.</p>
        <p className="mt-2 inline-block rounded-xl bg-brand-black px-5 py-2.5 font-mono text-lg font-semibold tracking-wider text-white select-all">
          {app.paymentReference ?? app.agreementNumber}
        </p>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2">
        {hasBank ? (
          <PaymentMethod
            icon={Building2}
            title="Bank Transfer"
            rows={[
              ["Bank", bank?.bankName],
              ["Branch", bank?.branch],
              ["Account", bank?.accountName],
              ["Number", bank?.accountNumber],
            ]}
          />
        ) : null}
        {hasMomo ? (
          <PaymentMethod
            icon={Smartphone}
            title="Mobile Money"
            rows={[
              ["Network", momo?.network],
              ["Number", momo?.number],
              ["Name", momo?.accountName],
            ]}
          />
        ) : null}
        {!hasBank && !hasMomo ? (
          <p className="bg-background p-6 text-sm text-muted-foreground sm:col-span-2">
            Our payment details are being finalised — we&apos;ll contact you directly with them.
          </p>
        ) : null}
      </div>

      {settings.paymentNote ? (
        <p className="border-t border-border bg-background p-5 text-center text-sm text-muted-foreground">
          {settings.paymentNote}
        </p>
      ) : null}
    </section>
  );
}

function PaymentMethod({
  icon: Icon,
  title,
  rows,
}: {
  icon: typeof Building2;
  title: string;
  rows: [string, string | undefined][];
}) {
  return (
    <div className="bg-background p-6">
      <p className="flex items-center gap-2 font-semibold">
        <Icon className="size-4 text-primary" /> {title}
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium select-all">{value}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}

function AgreementText({ app, settings }: { app: LendingApplication; settings: LendingSettings }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-6 sm:p-10">
      <header className="border-b border-border pb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Agreement {app.agreementNumber}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Operation New Frontiers</h2>
        <p className="text-muted-foreground">Private Lending Agreement</p>
      </header>
      <ol className="mt-8 space-y-7">
        {renderClauses(app, settings).map((clause, index) => (
          <li key={index}>
            <h3 className="font-semibold">
              {index + 1}. {clause.heading}
            </h3>
            {clause.paragraphs.map((paragraph, p) => (
              <p key={p} className="mt-2 text-[15px] leading-relaxed text-pretty text-foreground/85">
                {paragraph}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </article>
  );
}

function Execution({
  app,
  settings,
  token,
}: {
  app: LendingApplication;
  settings: LendingSettings;
  token: string;
}) {
  const signed = isExecuted(app);
  const terms = agreementTerms(app, settings);

  return (
    <section id="execution" className="scroll-mt-24 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Digital Execution</h2>

      {signed ? null : app.status === "PAYMENT_RECEIVED" ? (
        <LendingConsentForm token={token} lenderName={app.fullName} />
      ) : (
        <Notice icon={Lock}>
          Consent opens once our finance team has verified your payment against our bank or Mobile Money statement.
        </Notice>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <SignatureCard
          role="Lender"
          signature={signed ? app.consentName : undefined}
          name={app.fullName}
          meta={signed ? `Consented ${formatDateTime(app.consentAt)}` : "Awaiting consent"}
        />
        <SignatureCard
          role="Borrower"
          signature={terms.borrowerSignatory}
          name={terms.borrowerSignatory}
          meta={[terms.borrowerSignatoryTitle, terms.borrowerCompany].filter(Boolean).join(", ")}
        />
      </div>

      {signed && app.consentVersion ? (
        <p className="text-xs text-muted-foreground">
          Electronic consent {app.consentVersion} recorded {formatDateTime(app.consentAt)}
          {app.consentIp ? <> from IP {app.consentIp}</> : null}.
        </p>
      ) : null}

      {signed ? (
        <Button
          size="lg"
          nativeButton={false}
          render={<a href={`/new-frontiers/d/${token}/pdf`} download />}
          className="h-11 w-full px-6 text-base sm:w-auto"
        >
          <Download className="size-4" /> Download Executed Agreement (PDF)
        </Button>
      ) : null}
    </section>
  );
}

function SignatureCard({
  role,
  signature,
  name,
  meta,
}: {
  role: string;
  signature?: string;
  name: string;
  meta: string;
}) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{role}</p>
      <p className={cn("mt-3 h-8 font-serif text-2xl italic", !signature && "text-muted-foreground/40")}>
        {signature ?? "—"}
      </p>
      <div className="mt-2 border-t border-border pt-2">
        <p className="flex items-center gap-1.5 font-semibold">
          {name}
          {signature ? <Check className="size-4 text-emerald-600" aria-label="Signed" /> : null}
        </p>
        <p className="text-sm text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

function Notice({
  icon: Icon,
  tone = "default",
  children,
}: {
  icon: typeof Lock;
  tone?: "default" | "positive";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border p-5 text-sm leading-relaxed",
        tone === "positive"
          ? "border-emerald-600/25 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
          : "border-border bg-muted/40",
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
