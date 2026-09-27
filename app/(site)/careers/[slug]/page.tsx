import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Building2, CalendarClock, MapPin, Wallet, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { RichText } from "@/components/journal/portable-text";
import { DepartmentBadge } from "@/components/careers/department-badge";
import { ApplicationForm } from "@/components/careers/application-form";
import { MobileApplyBar } from "@/components/careers/mobile-apply-bar";
import { EmptyJobs } from "@/components/careers/empty-jobs";
import { getJobBySlug, getOpenJobs } from "@/lib/careers";
import { branchShortName, formatDeadline, isAcceptingApplications } from "@/lib/career-utils";
import { getSiteSettings } from "@/lib/site-settings";
import { buildMetadata } from "@/lib/seo";
import { extractPlainText } from "@/sanity/lib/portable-text";
import { JsonLd, breadcrumbSchema, jobPostingSchema } from "@/lib/structured-data";
import type { JobPosting } from "@/types/career";
import type { PortableTextBlock } from "@/types/sanity";

export async function generateStaticParams() {
  const jobs = await getOpenJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

function metaDescription(job: JobPosting): string {
  const fromBody = extractPlainText(job.description).replace(/\s+/g, " ").trim();
  const text = job.summary || fromBody || `${job.title} at Adakings — ${job.employmentType}, ${job.location}.`;
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  return buildMetadata({
    path: `/careers/${job.slug}`,
    title: [job.title, job.department?.title].filter(Boolean).join(" · "),
    description: metaDescription(job),
    // Closed/filled/expired roles drop out of search results, per Google's job-posting guidelines.
    seo: { ...job.seo, noIndex: Boolean(job.seo?.noIndex) || !isAcceptingApplications(job) },
    hasOwnOgImage: true,
  });
}

function MetaItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-gold">
        <Icon className="size-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <dt className="text-xs font-medium tracking-wide text-white/60 uppercase">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-white">{value}</dd>
      </div>
    </div>
  );
}

function JobSection({ title, value }: { title: string; value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return (
    <section className="border-t border-border pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      <div className="*:first:mt-3">
        <RichText value={value} />
      </div>
    </section>
  );
}

export default async function JobPostingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [job, settings] = await Promise.all([getJobBySlug(slug), getSiteSettings()]);
  if (!job) notFound();

  const accepting = isAcceptingApplications(job);
  const branchName = branchShortName(job.branch);
  const deadlineLabel = job.deadline ? formatDeadline(job.deadline) : "Open until filled";
  const closedReason =
    job.status === "Filled"
      ? "This position has been filled."
      : "This position is no longer accepting applications.";

  return (
    <>
      <JsonLd
        data={[
          ...(accepting && !job.noIndex ? [jobPostingSchema(job, settings)] : []),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
            { name: job.title, path: `/careers/${job.slug}` },
          ]),
        ]}
      />

      <section className="bg-brand-black text-white">
        <Container className="py-10 sm:py-14 md:py-16">
          <Link
            href="/careers#open-roles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All openings
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {job.department ? <DepartmentBadge department={job.department} tone="dark" /> : null}
            {!accepting ? (
              <span className="inline-flex h-6 items-center rounded-4xl bg-white/10 px-2.5 text-xs font-medium text-white/80">
                {job.status === "Filled" ? "Filled" : "Closed"}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">{job.title}</h1>
          {job.summary ? <p className="mt-4 max-w-2xl text-white/70 text-pretty sm:text-lg">{job.summary}</p> : null}

          <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <MetaItem icon={Briefcase} label="Employment type" value={job.employmentType} />
            <MetaItem icon={Building2} label="Branch" value={branchName} />
            <MetaItem icon={MapPin} label="Location" value={job.location} />
            <MetaItem icon={Wallet} label="Salary" value={job.salary} />
            <MetaItem icon={CalendarClock} label="Apply by" value={deadlineLabel} />
          </dl>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article className="max-w-3xl space-y-8">
            <JobSection title="About the role" value={job.description} />
            <JobSection title="Responsibilities" value={job.responsibilities} />
            <JobSection title="Requirements" value={job.requirements} />
            <JobSection title="Benefits" value={job.benefits} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-muted/40 p-6">
              <p className="text-sm font-semibold">{accepting ? "Interested in this role?" : closedReason}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {accepting
                  ? job.deadline
                    ? `Applications close on ${deadlineLabel}.`
                    : "Applications are open until the role is filled."
                  : "Take a look at our other openings."}
              </p>
              <Button
                render={<a href={accepting ? "#apply" : "/careers#open-roles"} />}
                className="mt-5 h-10 w-full bg-primary text-primary-foreground hover:bg-brand-red-dark"
              >
                {accepting ? "Apply now" : "View open roles"}
              </Button>
            </div>
          </aside>
        </Container>
      </Section>

      <Section id="apply" className="scroll-mt-16 bg-muted/40 pb-28 lg:pb-24">
        <Container className="max-w-2xl">
          {accepting ? (
            <>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Apply for this Position</h2>
              <p className="mt-2 text-muted-foreground">
                {job.title}
                {branchName ? ` · ${branchName}` : ""}
              </p>
              <div className="mt-8 rounded-2xl border border-border bg-background p-5 sm:p-8">
                <ApplicationForm
                  jobId={job._id}
                  jobTitle={job.title}
                  defaultEmploymentType={job.employmentType}
                />
              </div>
            </>
          ) : (
            <EmptyJobs
              title={closedReason}
              description="Thanks for your interest. Browse our current openings, or join the talent pool so we can reach you when a similar role opens."
              cta={{ label: "View open roles", href: "/careers#open-roles" }}
            />
          )}
        </Container>
      </Section>

      {accepting ? <MobileApplyBar title={job.title} subtitle={`Apply by ${deadlineLabel}`} /> : null}
    </>
  );
}
