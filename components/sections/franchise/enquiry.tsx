import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { FranchiseEnquiryForm } from "@/components/forms/franchise-enquiry-form";

export function FranchiseEnquiry({
  heading,
  description,
}: {
  heading?: string;
  description?: string;
}) {
  return (
    <Section id="enquiry" className="bg-muted/40">
      <Container className="max-w-2xl">
        <SectionHeading eyebrow="Franchise Enquiry" title={heading ?? ""} description={description} align="center" className="mx-auto" />
        <div className="mt-10">
          <FranchiseEnquiryForm />
        </div>
      </Container>
    </Section>
  );
}
