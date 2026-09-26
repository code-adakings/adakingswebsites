import { useEffect, useRef, useState } from "react";
import { Button, Card, Flex, Select, Stack, Text, TextArea, useToast } from "@sanity/ui";
import {
  useClient,
  useCurrentUser,
  type DocumentActionComponent,
  type SanityClient,
  type SanityDocument,
} from "sanity";
import { DEFAULT_AGREEMENT_CLAUSES, DEFAULT_BORROWER } from "../../lib/lending/default-clauses";
import {
  LENDING_SETTINGS_ID,
  STATUSES,
  STATUS_LABELS,
  addMonths,
  agreementCounterId,
  agreementNumberPrefix,
  agreementSequence,
  calculateInterest,
  calculateRepayment,
  formatAgreementNumber,
  formatCedis,
  formatDate,
  formatPercent,
  generateVerificationCode,
  nextStatus,
  statusIndex,
  type AgreementSnapshot,
  type LendingStatus,
} from "../../lib/lending/shared";

type LendingDoc = SanityDocument & {
  status?: LendingStatus;
  fullName?: string;
  email?: string;
  negotiatedAmount?: number;
  interestRate?: number;
  termMonths?: number;
  agreementNumber?: string;
  verificationCode?: string;
  paymentReference?: string;
  fundedDate?: string;
  maturityDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentVerified?: boolean;
  consentAt?: string;
};

type Client = SanityClient;
type Transaction = ReturnType<Client["transaction"]>;

const API_VERSION = "2025-01-01";

/** Fields the admin can edit in a draft; carried onto the published doc on transition. */
const EDITABLE_FIELDS = [
  "fullName",
  "email",
  "phone",
  "address",
  "negotiatedAmount",
  "interestRate",
  "termMonths",
  "paymentReference",
  "fundedDate",
  "maturityDate",
  "adminNotes",
  "paymentMethod",
  "transactionId",
  "paymentVerified",
  "paymentNotes",
] as const;

const historyEntry = (status: LendingStatus, at: string, by: string | undefined, extra: object = {}) => ({
  _type: "statusChange",
  _key: crypto.randomUUID(),
  status,
  at,
  by,
  ...extra,
});

const today = (now: string) => now.slice(0, 10);

/**
 * Reserves the next agreement number for `year`. Returns the number plus the
 * counter mutation to commit in the same transaction as the approval: the
 * counter write is guarded by its revision (or fails as a duplicate create),
 * so two simultaneous approvals can never be issued the same number.
 */
async function reserveAgreementNumber(client: Client, year: number) {
  const id = agreementCounterId(year);
  const counter = await client.fetch<{ _rev: string; last: number } | null>(`*[_id == $id][0]{ _rev, last }`, { id });

  let last = counter?.last;
  if (last == null) {
    // First approval of the year: continue from any numbers issued before the counter existed.
    const issued = await client.fetch<string[]>(
      `*[_type == "lendingApplication" && string::startsWith(agreementNumber, $prefix)].agreementNumber`,
      { prefix: agreementNumberPrefix(year) },
    );
    last = Math.max(0, ...issued.map((number) => agreementSequence(number, year)));
  }

  const next = last + 1;
  return {
    agreementNumber: formatAgreementNumber(year, next),
    apply: (tx: Transaction) =>
      counter
        ? tx.patch(id, (patch) => patch.ifRevisionId(counter._rev).set({ last: next }))
        : tx.create({ _id: id, _type: "lendingCounter", year, last: next }),
  };
}

/** Freezes the current Lending Settings wording onto the agreement being approved. */
async function takeAgreementSnapshot(client: Client, now: string): Promise<AgreementSnapshot & { _type: string }> {
  const settings = await client.fetch<Partial<AgreementSnapshot> | null>(
    `*[_id == $id][0]{ borrowerCompany, borrowerSignatory, borrowerSignatoryTitle, clauses[]{ heading, body } }`,
    { id: LENDING_SETTINGS_ID },
  );
  const clauses = settings?.clauses?.length ? settings.clauses : DEFAULT_AGREEMENT_CLAUSES;
  return {
    _type: "agreementSnapshot",
    borrowerCompany: settings?.borrowerCompany || DEFAULT_BORROWER.borrowerCompany,
    borrowerSignatory: settings?.borrowerSignatory || DEFAULT_BORROWER.borrowerSignatory,
    borrowerSignatoryTitle: settings?.borrowerSignatoryTitle ?? DEFAULT_BORROWER.borrowerSignatoryTitle,
    clauses: clauses.map(({ heading, body }) => ({ _type: "clause", _key: crypto.randomUUID(), heading, body })),
    takenAt: now,
  };
}

type Prepared = { fields: Record<string, unknown>; apply?: (tx: Transaction) => Transaction };

type Step = {
  label: string;
  tone: "primary" | "positive" | "caution";
  confirm: (doc: LendingDoc) => string;
  /** Returns an error message when the step can't run yet. */
  validate?: (doc: LendingDoc) => string | null;
  /** Fields to set alongside the status, plus any extra mutation for the same transaction. */
  prepare?: (doc: LendingDoc, now: string, context: { client: Client; user: string | undefined }) => Promise<Prepared>;
};

/**
 * Finance's three actions, keyed by the status the application moves *to*.
 * UNDER_REVIEW happens automatically on open, PAYMENT_PENDING when the lender
 * proceeds to payment, and consent is the lender's alone — none have buttons.
 */
const STEPS: Partial<Record<LendingStatus, Step>> = {
  APPROVED: {
    label: "Approve Terms",
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
      `The terms and agreement wording lock, an agreement number is issued, and ${doc.email} is emailed their provisional agreement.`,
    prepare: async (doc, now, { client }) => {
      // An application re-approved after an override keeps its number and code.
      const reserved = doc.agreementNumber ? null : await reserveAgreementNumber(client, new Date(now).getUTCFullYear());
      const agreementNumber = doc.agreementNumber ?? reserved!.agreementNumber;
      return {
        fields: {
          agreementNumber,
          verificationCode: doc.verificationCode ?? generateVerificationCode(),
          paymentReference: doc.paymentReference || agreementNumber,
          repaymentAmount: calculateRepayment(doc.negotiatedAmount!, doc.interestRate!),
          interestAmount: calculateInterest(doc.negotiatedAmount!, doc.interestRate!),
          agreementSnapshot: await takeAgreementSnapshot(client, now),
          approvedAt: now,
        },
        apply: reserved?.apply,
      };
    },
  },
  PAYMENT_RECEIVED: {
    label: "Confirm Payment",
    tone: "positive",
    validate: (doc) => {
      if (!doc.paymentMethod) return "Select the payment method (Payment tab).";
      if (!doc.transactionId?.trim()) return "Enter the bank / MoMo transaction ID (Payment tab).";
      if (!doc.paymentVerified) return "Tick that you've matched the transaction against our statement (Payment tab).";
      if (doc.fundedDate && doc.maturityDate && doc.maturityDate <= doc.fundedDate) {
        return "The maturity date must be after the funding date.";
      }
      return null;
    },
    confirm: (doc) => {
      const funded = doc.fundedDate || new Date().toISOString().slice(0, 10);
      const maturity = doc.maturityDate || addMonths(funded, doc.termMonths ?? 4);
      return (
        `Confirm ${formatCedis(doc.negotiatedAmount)} from ${doc.fullName} is on our own statement ` +
        `(transaction ${doc.transactionId})? Funded ${formatDate(funded)}, maturing ${formatDate(maturity)}. ` +
        `These dates lock, and the lender is emailed to give their digital consent.`
      );
    },
    prepare: async (doc, now, { user }) => {
      const fundedDate = doc.fundedDate || today(now);
      return {
        fields: {
          fundedAt: now,
          fundedDate,
          maturityDate: doc.maturityDate || addMonths(fundedDate, doc.termMonths ?? 4),
          paymentVerifiedBy: user,
        },
      };
    },
  },
  COMPLETED: {
    label: "Mark Completed",
    tone: "caution",
    validate: (doc) => (doc.consentAt ? null : "Waiting for the lender's digital consent."),
    confirm: (doc) =>
      `Archive ${doc.fullName}'s executed agreement ${doc.agreementNumber}? It becomes read-only; the lender can still download it.`,
    prepare: async (_doc, now) => ({ fields: { completedAt: now } }),
  },
};

/**
 * The single action that moves a lending application forward one status.
 * It publishes any pending edits together with the new status (guarded by
 * the published revision, so a double click or a concurrent lender action
 * can't apply twice), then asks the site to send the email for that status.
 *
 * It also moves a newly opened APPLIED application to UNDER_REVIEW — the
 * action is rendered whenever the document is open in Studio.
 */
export const LendingTransitionAction: DocumentActionComponent = (props) => {
  const { id, draft, published, onComplete } = props;
  const client = useClient({ apiVersion: API_VERSION });
  const user = useCurrentUser();
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const autoReviewed = useRef(false);

  const current = published as LendingDoc | null;
  const userName = user?.name ?? user?.email;

  useEffect(() => {
    if (!current || (current.status ?? "APPLIED") !== "APPLIED" || autoReviewed.current) return;
    autoReviewed.current = true;
    client
      .patch(id)
      .ifRevisionId(current._rev)
      .set({ status: "UNDER_REVIEW" })
      .setIfMissing({ statusHistory: [] })
      .append("statusHistory", [historyEntry("UNDER_REVIEW", new Date().toISOString(), userName, { note: "Opened for review" })])
      .commit()
      .catch(() => {
        // Someone else opened it at the same moment — their review stands.
      });
  }, [client, current, id, userName]);

  const target = nextStatus(current?.status);
  if (!current || !target || current.status === "APPLIED" || !current.status) return null;

  const step = STEPS[target];
  if (!step) {
    // APPROVED → PAYMENT_PENDING belongs to the lender.
    return {
      label: "Waiting for lender to proceed to payment",
      disabled: true,
      onHandle: () => {},
    };
  }

  const doc = { ...current, ...(draft as LendingDoc | null) };
  const blocker = step.validate?.(doc) ?? null;

  const run = async () => {
    setBusy(true);
    try {
      const now = new Date().toISOString();
      const { fields, apply } = (await step.prepare?.(doc, now, { client, user: userName })) ?? { fields: {} };

      const edits = Object.fromEntries(
        EDITABLE_FIELDS.filter((field) => doc[field] !== undefined).map((field) => [field, doc[field]]),
      );

      let tx = client.transaction().patch(id, (patch) =>
        patch
          .ifRevisionId(current._rev)
          .set({ ...edits, ...fields, status: target })
          .setIfMissing({ statusHistory: [] })
          .append("statusHistory", [historyEntry(target, now, userName)]),
      );
      if (apply) tx = apply(tx);
      if (draft) tx = tx.delete(`drafts.${id}`);
      await tx.commit();

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
      const message = (error as Error).message;
      toast.push({
        status: "error",
        title: "Couldn't update the application",
        description: /revision|already exists/i.test(message)
          ? "It (or the agreement counter) changed since you opened it — reload and try again."
          : message,
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

/**
 * Administrator-only escape hatch: moves an application back to an earlier
 * status, with a required reason recorded in its history. Never available
 * once the lender has consented — an executed agreement is not rewritten.
 */
export const LendingOverrideAction: DocumentActionComponent = (props) => {
  const { id, published, onComplete } = props;
  const client = useClient({ apiVersion: API_VERSION });
  const user = useCurrentUser();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");

  const current = published as LendingDoc | null;
  const isAdmin = user?.roles.some((role) => role.name === "administrator");
  const index = statusIndex(current?.status);
  // Never back to APPLIED: it would immediately re-enter review on open anyway.
  const targets = STATUSES.slice(1, Math.max(1, index));
  const [target, setTarget] = useState<LendingStatus | undefined>(undefined);
  const chosen = target && targets.includes(target) ? target : targets.at(-1);

  if (!current || !isAdmin || current.consentAt || targets.length === 0) return null;

  const close = () => {
    setOpen(false);
    setReason("");
    onComplete();
  };

  const run = async () => {
    if (!chosen) return;
    setBusy(true);
    try {
      let patch = client
        .patch(id)
        .ifRevisionId(current._rev)
        .set({ status: chosen })
        .setIfMissing({ statusHistory: [] })
        .append("statusHistory", [
          historyEntry(chosen, new Date().toISOString(), user?.name ?? user?.email, {
            event: "override",
            note: reason.trim(),
          }),
        ]);
      // Payment must be re-verified against the statement if it's confirmed again.
      if (statusIndex(chosen) < statusIndex("PAYMENT_RECEIVED")) {
        patch = patch.unset(["paymentVerified", "paymentVerifiedBy"]);
      }
      await patch.commit();
      toast.push({ status: "success", title: `Moved back to ${STATUS_LABELS[chosen]}`, description: "No email was sent." });
      close();
    } catch (error) {
      toast.push({ status: "error", title: "Override failed", description: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return {
    label: "Override status…",
    tone: "critical",
    onHandle: () => setOpen(true),
    dialog: open
      ? {
          type: "dialog",
          header: "Move application back (admin override)",
          onClose: close,
          content: (
            <Stack space={4}>
              <Card padding={3} radius={2} tone="caution" border>
                <Text size={1}>
                  Statuses only move forward in normal use. This is recorded permanently in the status history, and
                  the lender is not emailed — contact them directly.
                </Text>
              </Card>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Move from {STATUS_LABELS[current.status ?? "APPLIED"]} back to
                </Text>
                <Select value={chosen} onChange={(event) => setTarget(event.currentTarget.value as LendingStatus)}>
                  {targets.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </Select>
              </Stack>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Reason (required)
                </Text>
                <TextArea
                  rows={3}
                  value={reason}
                  onChange={(event) => setReason(event.currentTarget.value)}
                  placeholder="e.g. Lender asked to change the principal before paying"
                />
              </Stack>
              <Flex justify="flex-end" gap={2}>
                <Button mode="ghost" text="Cancel" onClick={close} />
                <Button
                  tone="critical"
                  text={busy ? "Moving…" : "Move back"}
                  disabled={busy || reason.trim().length < 5}
                  onClick={run}
                />
              </Flex>
            </Stack>
          ),
        }
      : null,
  };
};
