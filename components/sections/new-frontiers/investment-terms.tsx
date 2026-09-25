import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import type { PrivateLandingRepaymentRow } from "@/types/sanity";

export function NewFrontiersInvestmentTerms({
  eyebrow,
  heading,
  headlineRate,
  rateCaption,
  repaymentRows = [],
  note,
}: {
  eyebrow?: string;
  heading?: string;
  headlineRate?: string;
  rateCaption?: string;
  repaymentRows?: PrivateLandingRepaymentRow[];
  note?: string;
}) {
  return (
    <Section className="bg-muted/40">
      <Container className="max-w-3xl">
        {heading ? (
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title={heading} align="center" className="max-w-2xl" />
          </Reveal>
        ) : null}

        {headlineRate ? (
          <Reveal delay={0.1} className="mt-8 rounded-3xl border border-border bg-card p-7 text-center sm:mt-12 sm:p-14">
            <p className="text-5xl font-semibold tracking-tight text-primary sm:text-7xl">
              {headlineRate}
            </p>
            {rateCaption ? (
              <p className="mt-4 text-base text-muted-foreground">{rateCaption}</p>
            ) : null}
          </Reveal>
        ) : null}

        {repaymentRows.length > 0 ? (
          <Reveal delay={0.15} className="mt-10 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-120 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/60">
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Investment
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Interest
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Total Repayment
                  </th>
                </tr>
              </thead>
              <tbody>
                {repaymentRows.map((row, index) => (
                  <tr
                    key={row.investment}
                    className={index < repaymentRows.length - 1 ? "border-b border-border" : undefined}
                  >
                    <td className="px-6 py-4 font-medium">{row.investment}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.interest}</td>
                    <td className="px-6 py-4 font-semibold">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        ) : null}

        {note ? (
          <Reveal delay={0.2}>
            <p className="mt-6 text-center text-sm text-pretty text-muted-foreground">{note}</p>
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
