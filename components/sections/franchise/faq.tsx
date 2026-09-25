import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { FranchiseFaqItem } from "@/types/sanity";

export function FranchiseFaq({
  eyebrow,
  heading,
  items,
}: {
  eyebrow?: string;
  heading?: string;
  items?: FranchiseFaqItem[];
}) {
  if (!items?.length) return null;

  return (
    <Section>
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} align="center" className="mx-auto" />
        <Accordion className="mt-10">
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
