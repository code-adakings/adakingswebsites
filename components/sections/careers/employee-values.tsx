import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { CareersValue } from "@/types/sanity";

export function EmployeeValues({
  eyebrow,
  heading,
  description,
  values,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  values?: CareersValue[];
}) {
  if (!values?.length) return null;

  return (
    <Section className="bg-muted/40">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} description={description} align="center" className="mx-auto" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-2xl border border-border bg-background p-6">
              <h3 className="text-lg font-semibold">{value.title}</h3>
              {value.description ? (
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
