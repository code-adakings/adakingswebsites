import { useCallback, useEffect, useState } from "react";
import { Badge, Box, Card, Container, Flex, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { DocumentTextIcon } from "@sanity/icons";
import { useClient, type Tool } from "sanity";
import { IntentLink } from "sanity/router";
import {
  STATUSES,
  STATUS_DESCRIPTIONS,
  STATUS_LABELS,
  formatCedis,
  formatDate,
  type LendingStatus,
} from "../../lib/lending/shared";

type Row = {
  _id: string;
  fullName?: string;
  status?: LendingStatus;
  requestedAmount?: string;
  negotiatedAmount?: number;
  agreementNumber?: string;
  appliedAt?: string;
  consentAt?: string;
};

const QUERY = `*[_type == "lendingApplication" && !(_id in path("drafts.**"))] | order(appliedAt desc) {
  _id, fullName, status, requestedAmount, negotiatedAmount, agreementNumber, appliedAt, consentAt
}`;

function Pipeline() {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [rows, setRows] = useState<Row[] | null>(null);

  const load = useCallback(() => {
    client.fetch<Row[]>(QUERY).then(setRows);
  }, [client]);

  useEffect(() => {
    load();
    const subscription = client
      .listen(`*[_type == "lendingApplication"]`, {}, { visibility: "query" })
      .subscribe(() => load());
    return () => subscription.unsubscribe();
  }, [client, load]);

  if (!rows) {
    return (
      <Flex align="center" justify="center" padding={6}>
        <Spinner muted />
      </Flex>
    );
  }

  const byStatus = (status: LendingStatus) => rows.filter((row) => (row.status ?? "APPLIED") === status);
  const committed = rows
    .filter((row) => row.status && STATUSES.indexOf(row.status) >= STATUSES.indexOf("PAYMENT_RECEIVED"))
    .reduce((sum, row) => sum + (row.negotiatedAmount ?? 0), 0);

  return (
    <Container width={5} padding={4}>
      <Stack space={5}>
        <Flex align="flex-end" justify="space-between" wrap="wrap" gap={3}>
          <Stack space={3}>
            <Heading size={3}>Operation New Frontiers</Heading>
            <Text muted>
              Lending pipeline. Finance only needs three actions: Approve Terms, Confirm Payment (after checking our
              own statement), and Mark Completed.
            </Text>
          </Stack>
          <Card padding={3} radius={2} tone="positive" border>
            <Text size={1} muted>
              Funds received
            </Text>
            <Box marginTop={2}>
              <Text size={3} weight="semibold">
                {formatCedis(committed)}
              </Text>
            </Box>
          </Card>
        </Flex>

        <Grid columns={[1, 2, 3, 4]} gap={3}>
          {STATUSES.map((status) => {
            const items = byStatus(status);
            return (
              <Card key={status} padding={3} radius={3} border tone="transparent">
                <Stack space={3}>
                  <Flex align="center" justify="space-between">
                    <Text weight="semibold">{STATUS_LABELS[status]}</Text>
                    <Badge tone={items.length ? "primary" : "default"}>{items.length}</Badge>
                  </Flex>
                  <Text size={1} muted>
                    {STATUS_DESCRIPTIONS[status]}
                  </Text>
                  <Stack space={2}>
                    {items.map((row) => (
                      <Card
                        key={row._id}
                        as={IntentLink}
                        intent="edit"
                        params={{ id: row._id, type: "lendingApplication" }}
                        padding={3}
                        radius={2}
                        shadow={1}
                        style={{ textDecoration: "none" }}
                      >
                        <Stack space={2}>
                          <Text size={1} weight="semibold">
                            {row.fullName ?? "Unnamed"}
                          </Text>
                          <Text size={1} muted>
                            {[
                              row.negotiatedAmount != null ? formatCedis(row.negotiatedAmount) : row.requestedAmount,
                              row.agreementNumber ?? formatDate(row.appliedAt),
                              row.status === "PAYMENT_RECEIVED"
                                ? row.consentAt
                                  ? "Consented — ready to complete"
                                  : "Awaiting consent"
                                : null,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </Text>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
}

export const lendingPipelineTool: Tool = {
  name: "lending",
  title: "New Frontiers",
  icon: DocumentTextIcon,
  component: Pipeline,
};
