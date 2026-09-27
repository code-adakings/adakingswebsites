import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { JobCard } from "@/components/careers/job-card";
import { EmptyJobs } from "@/components/careers/empty-jobs";
import type { JobPostingCard } from "@/types/career";

export function FeaturedJobs({
  featured,
  otherOpenJobs = [],
}: {
  featured: JobPostingCard[];
  /** Open roles that aren't featured — listed below so they stay discoverable. */
  otherOpenJobs?: JobPostingCard[];
}) {
  const hasAny = featured.length > 0 || otherOpenJobs.length > 0;

  return (
    <Section id="open-roles" className="scroll-mt-16">
      <Container>
        <SectionHeading
          eyebrow="Open Positions"
          title={featured.length ? "Featured openings" : "Current openings"}
          description="Every role comes with training, staff meals, and a real path to promotion."
        />

        {!hasAny ? (
          <div className="mt-8 sm:mt-12">
            <EmptyJobs />
          </div>
        ) : null}

        {featured.length ? (
          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featured.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : null}

        {otherOpenJobs.length ? (
          <div className="mt-10 sm:mt-14">
            {featured.length ? <h3 className="text-lg font-semibold">More open roles</h3> : null}
            <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {otherOpenJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
