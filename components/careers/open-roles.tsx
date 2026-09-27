import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { JobCard } from "@/components/careers/job-card";
import { EmptyJobs } from "@/components/careers/empty-jobs";
import type { JobPostingCard } from "@/types/career";

/** The roles picked in Careers Page Settings → Open Roles (see `getListedJobs`). */
export function OpenRoles({ jobs }: { jobs: JobPostingCard[] }) {
  return (
    <Section id="open-roles" className="scroll-mt-16">
      <Container>
        <SectionHeading
          eyebrow="Open Positions"
          title="Current openings"
          description="Every role comes with training, staff meals, and a real path to promotion."
        />

        {jobs.length ? (
          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="mt-8 sm:mt-12">
            <EmptyJobs />
          </div>
        )}
      </Container>
    </Section>
  );
}
