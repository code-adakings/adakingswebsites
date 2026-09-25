import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrackClick } from "@/components/analytics/track-click";
import { getCareersPage, getOpenCareers } from "@/lib/careers";

export async function Careers() {
  const [{ homeCta }, allOpenCareers] = await Promise.all([getCareersPage(), getOpenCareers()]);
  const openCareers = allOpenCareers.slice(0, 3);

  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={homeCta.eyebrow}
            title={homeCta.heading ?? ""}
            description={homeCta.description}
          />
          <Button variant="outline" render={<a href="/careers" />} className="hidden shrink-0 sm:inline-flex">
            View All Roles
          </Button>
        </div>

        {openCareers.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {openCareers.map((career) => (
              <div
                key={career.slug}
                className="flex flex-col rounded-2xl border border-border bg-background p-6"
              >
                <h3 className="text-base font-semibold">{career.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="size-3" />
                    {career.location}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Briefcase className="size-3" />
                    {career.employmentType}
                  </Badge>
                </div>
                <TrackClick event="career_apply" params={{ method: "application_url", role: career.title }}>
                  <Button
                    render={<a href={career.applicationUrl} target="_blank" rel="noopener noreferrer" />}
                    className="mt-6 w-fit bg-primary text-primary-foreground hover:bg-brand-red-dark"
                  >
                    Apply Now
                    <ArrowRight className="size-4" />
                  </Button>
                </TrackClick>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-sm text-muted-foreground">
            No open positions right now — check back soon.
          </p>
        )}

        <Button variant="outline" render={<a href="/careers" />} className="mt-8 w-full sm:hidden">
          View All Roles
        </Button>
      </Container>
    </Section>
  );
}
