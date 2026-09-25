import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

const REPAYMENT_TABLE = [
  { investment: "GHS 5,000", interest: "GHS 875", total: "GHS 5,875" },
  { investment: "GHS 10,000", interest: "GHS 1,750", total: "GHS 11,750" },
  { investment: "GHS 20,000", interest: "GHS 3,500", total: "GHS 23,500" },
  { investment: "GHS 50,000", interest: "GHS 8,750", total: "GHS 58,750" },
];

export function NewFrontiersInvestmentTerms() {
  return (
    <Section className="bg-muted/40">
      <Container className="max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="Investment Terms"
            title="Semester Lending Facility"
            align="center"
            className="max-w-2xl"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 rounded-3xl border border-border bg-card p-10 text-center sm:p-14">
          <p className="text-6xl font-semibold tracking-tight text-primary sm:text-7xl">17.5%</p>
          <p className="mt-4 text-base text-muted-foreground">
            Fixed return paid as one lump sum after 4 months.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
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
              {REPAYMENT_TABLE.map((row, index) => (
                <tr
                  key={row.investment}
                  className={index < REPAYMENT_TABLE.length - 1 ? "border-b border-border" : undefined}
                >
                  <td className="px-6 py-4 font-medium">{row.investment}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.interest}</td>
                  <td className="px-6 py-4 font-semibold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-center text-sm text-pretty text-muted-foreground">
            Minimum participation is GHS 1,000. This is a fixed-term private debt facility and
            does not confer equity ownership.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
