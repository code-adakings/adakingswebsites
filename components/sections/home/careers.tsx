import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { ScrollRail, ScrollRailItem } from "@/components/ui/scroll-rail";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/careers/job-card";
import { getCareersPage, getListedJobs } from "@/lib/careers";

export async function Careers() {
  const [{ homeCta }, openJobs] = await Promise.all([getCareersPage(), getListedJobs()]);

  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={homeCta.eyebrow}
            title={homeCta.heading ?? ""}
            description={homeCta.description}
          />
          <Button variant="outline" render={<Link href="/careers" />} className="hidden shrink-0 sm:inline-flex">
            View All Roles
          </Button>
        </div>

        {openJobs.length > 0 ? (
          <ScrollRail className="mt-8 sm:mt-12 sm:grid-cols-3 sm:gap-4">
            {openJobs.map((job) => (
              <ScrollRailItem key={job._id} className="flex w-[80%]">
                <JobCard job={job} className="w-full" />
              </ScrollRailItem>
            ))}
          </ScrollRail>
        ) : (
          <p className="mt-12 text-sm text-muted-foreground">
            No open positions right now — check back soon.
          </p>
        )}

        <Button variant="outline" render={<Link href="/careers" />} className="mt-8 w-full sm:hidden">
          View All Roles
        </Button>
      </Container>
    </Section>
  );
}
