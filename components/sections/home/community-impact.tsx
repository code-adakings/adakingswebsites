import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { SanityImage } from "@/components/ui/sanity-image";
import { getCommunityImpact } from "@/lib/community-impact";

export async function CommunityImpact() {
  const { eyebrow, heading, description, initiatives, image } = await getCommunityImpact();

  return (
    <Section className="bg-muted/40">
      <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionHeading eyebrow={eyebrow} title={heading} description={description} />
          <dl className="mt-6 space-y-4 sm:mt-8 sm:space-y-6">
            {initiatives.map((item) => (
              <div key={item.title} className="border-l-2 border-primary pl-4">
                <dt className="font-semibold">{item.title}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <SanityImage image={image} fallbackLabel="Community initiative" className="aspect-4/3" />
      </Container>
    </Section>
  );
}
