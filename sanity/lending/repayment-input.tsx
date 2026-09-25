import { Card, Stack, Text } from "@sanity/ui";
import { useFormValue, type NumberInputProps } from "sanity";
import {
  calculateInterest,
  calculateRepayment,
  formatCedis,
  formatPercent,
} from "../../lib/lending/shared";

/**
 * Read-only repayment field that recalculates live as the principal and
 * interest rate are negotiated. The stored `repaymentAmount` is written by
 * the Approve action, so the figure the lender sees is locked at approval.
 */
export function RepaymentInput(props: NumberInputProps) {
  const principal = useFormValue(["negotiatedAmount"]) as number | undefined;
  const rate = useFormValue(["interestRate"]) as number | undefined;

  if (principal == null || rate == null) {
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>
          Enter the approved principal and interest rate to calculate repayment.
        </Text>
      </Card>
    );
  }

  const repayment = props.value ?? calculateRepayment(principal, rate);

  return (
    <Card padding={3} radius={2} tone="positive" border>
      <Stack space={3}>
        <Text size={3} weight="semibold">
          {formatCedis(repayment)}
        </Text>
        <Text size={1} muted>
          {formatCedis(principal)} + {formatPercent(rate)} ({formatCedis(calculateInterest(principal, rate))} interest)
        </Text>
      </Stack>
    </Card>
  );
}
