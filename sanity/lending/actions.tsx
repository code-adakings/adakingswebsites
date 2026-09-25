import { useState } from "react";
import { useToast } from "@sanity/ui";
import {
  useClient,
  useCurrentUser,
  type DocumentActionComponent,
  type SanityDocument,
} from "sanity";
import {
  STATUS_LABELS,
  addMonths,
  agreementNumberPrefix,
  calculateInterest,
  calculateRepayment,
  formatCedis,
  formatPercent,
  nextAgreementNumber,
  nextStatus,
  type LendingStatus,
} from "../../lib/lending/shared";

type LendingDoc = SanityDocument & {
  status?: LendingStatus;
  fullName?: string;
  email?: string;
  negotiatedAmount?: number;
  interestRate?: number;
  termMonths?: number;
  maturityDate?: string;
  paymentMethod?: string;
};

/** Fields the admin can edit in a draft; carried onto the published doc on transition. */
const EDITABLE_FIELDS = [
  "fullName",
  "email",
  "phone",
  "address",
  "negotiatedAmount",
  "interestRate",
  "termMonths",
  "maturityDate",
  "adminNotes",
  "paymentMethod",
  "paymentNotes",
] as const;

type Step = {
  label: string;
  tone: "primary" | "positive" | "caution";
  confirm: (doc: LendingDoc) => string;
  /** Returns an error message when the step can't run yet. */
  validate?: (doc: LendingDoc) => string | null;
  /** Extra fields to set alongside the status. */
  fields?: (doc: LendingDoc, now: string, latestAgreementNumber: string | null) => Record<string, unknown>;
};

// Keyed by the status the application is moving *to*. PAYMENT_RECEIVED →
// CONSENT_SIGNED is deliberately absent: only the lender can sign.
const STEPS: Partial<Record<LendingStatus, Step>> = {
  UNDER_REVIEW: {
    label: "Start review",
    tone: "primary",
    confirm: (doc) => `Move ${doc.fullName}'s application to Under Review? No email is sent at this step.`,
  },
  APPROVED: {
    label: "Approve & send agreement",
    tone: "positive",
    validate: (doc) => {
      if (!doc.negotiatedAmount || doc.negotiatedAmount <= 0) return "Set the approved principal first.";
      if (doc.interestRate == null || doc.interestRate < 0) return "Set the interest rate first.";
      if (!doc.termMonths || doc.termMonths < 1) return "Set the term first.";
      if (!doc.email) return "The applicant has no email address.";
      return null;
    },
    confirm: (doc) =>
      `Approve ${formatCedis(doc.negotiatedAmount)} at ${formatPercent(doc.interestRate)} for ${doc.termMonths} months ` +
      `(repayment ${formatCedis(calculateRepayment(doc.negotiatedAmount!, doc.interestRate!))})? ` +
      `The terms lock and ${doc.email} is emailed their provisional agreement link.`,
    fields: (doc, now, latest) => ({
      agreementNumber: nextAgreementNumber(latest, new Date(now).getUTCFullYear()),
      repaymentAmount: calculateRepayment(doc.negotiatedAmount!, doc.interestRate!),
      interestAmount: calculateInterest(doc.negotiatedAmount!, doc.interestRate!),
      approvedAt: now,
    }),
  },
  PAYMENT_PENDING: {
    label: "Send payment instructions",
    tone: "primary",
    confirm: (doc) =>
      `Unlock the bank and MoMo details on ${doc.fullName}'s page and email them payment instructions?`,
  },
  PAYMENT_RECEIVED: {
    label: "Confirm payment received",
    tone: "positive",
    validate: (doc) =>
      doc.paymentMethod ? null : "Select the payment method (Payment tab) before confirming.",
    confirm: (doc) =>
      `Confirm you have received ${formatCedis(doc.negotiatedAmount)} from ${doc.fullName}? ` +
      `Their agreement becomes Verified & Active and they're emailed to sign it.`,
    fields: (doc, now) => ({
      fundedAt: now,
      maturityDate: doc.maturityDate || addMonths(now, doc.termMonths ?? 4),
    }),
  },
  COMPLETED: {
    label: "Mark repaid & complete",
    tone: "caution",
    confirm: (doc) => `Confirm ${doc.fullName} has been repaid in full and close this agreement?`,
    fields: (_doc, now) => ({ completedAt: now }),
  },
};

/**
 * The single action that moves a lending application forward one status.
 * It publishes any pending edits together with the new status (guarded by
 * the published revision, so a double click or a concurrent lender consent
 * can't apply twice), then asks the site to send the email for that status.
 */
export const LendingTransitionAction: DocumentActionComponent = (props) => {
  const { id, draft, published, onComplete } = props;
  const client = useClient({ apiVersion: "2025-01-01" });
  const user = useCurrentUser();
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const current = published as LendingDoc | null;
  const target = nextStatus(current?.status);
  const step = target ? STEPS[target] : undefined;
  if (!current || !target || !step) return null;

  const doc = { ...current, ...(draft as LendingDoc | null) };
  const blocker = step.validate?.(doc) ?? null;

  const run = async () => {
    setBusy(true);
    try {
      const now = new Date().toISOString();
      const latest = await client.fetch<string | null>(
        `*[_type == "lendingApplication" && string::startsWith(agreementNumber, $prefix)] | order(agreementNumber desc)[0].agreementNumber`,
        { prefix: agreementNumberPrefix(new Date(now).getUTCFullYear()) },
      );

      const edits = Object.fromEntries(
        EDITABLE_FIELDS.filter((field) => doc[field] !== undefined).map((field) => [field, doc[field]]),
      );

      await client
        .transaction()
        .patch(id, (patch) =>
          patch
            .ifRevisionId(current._rev)
            .set({ ...edits, ...step.fields?.(doc, now, latest), status: target })
            .setIfMissing({ statusHistory: [] })
            .append("statusHistory", [
              { _type: "statusChange", _key: crypto.randomUUID(), status: target, at: now, by: user?.name ?? user?.email },
            ]),
        )
        .delete(`drafts.${id}`)
        .commit();

      const response = await fetch("/api/lending/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = (await response.json().catch(() => ({}))) as { sent?: string; message?: string };

      toast.push({
        status: response.ok ? "success" : "warning",
        title: `Moved to ${STATUS_LABELS[target]}`,
        description: response.ok
          ? result.sent
            ? `Lender emailed (${result.sent}).`
            : undefined
          : `Status saved, but the email failed: ${result.message ?? response.statusText}`,
      });
    } catch (error) {
      toast.push({
        status: "error",
        title: "Couldn't update the application",
        description: (error as Error).message.includes("revision")
          ? "It changed since you opened it — reload and try again."
          : (error as Error).message,
      });
    } finally {
      setBusy(false);
      setDialogOpen(false);
      onComplete();
    }
  };

  return {
    label: busy ? "Working…" : step.label,
    tone: step.tone,
    disabled: busy || Boolean(blocker),
    title: blocker ?? undefined,
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen
      ? {
          type: "confirm",
          tone: step.tone === "caution" ? "caution" : "default",
          message: draft
            ? `${step.confirm(doc)} Your unpublished edits will be published with it.`
            : step.confirm(doc),
          onCancel: () => {
            setDialogOpen(false);
            onComplete();
          },
          onConfirm: run,
        }
      : null,
  };
};
