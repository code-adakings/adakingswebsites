import Link from "next/link";
import { ArrowRight, Briefcase, CalendarClock, MapPin, Wallet } from "lucide-react";
import { cn } from "cn";
import { DepartmentBadge } from "@/components/careers/department-badge";
import { formatDeadline, jobLocationLabel } from "@/lib/career-utils";
import type { JobPostingCard } from "@/types/career";

export function JobCard({ job, className }: { job: JobPostingCard; className?: string }) {
  const location = jobLocationLabel(job);

  return (
    <Link
      href={`/careers/${job.slug}`}
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-background p-6 transition-all outline-none hover:border-primary/40 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      {job.department ? <DepartmentBadge department={job.department} /> : null}

      <h3 className="mt-4 text-lg font-semibold text-balance group-hover:text-primary">{job.title}</h3>
      {job.summary ? (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{job.summary}</p>
      ) : null}

      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        {location ? (
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {location}
          </li>
        ) : null}
        <li className="flex items-center gap-2">
          <Briefcase className="size-4 shrink-0" aria-hidden />
          {job.employmentType}
        </li>
        {job.salary ? (
          <li className="flex items-center gap-2">
            <Wallet className="size-4 shrink-0" aria-hidden />
            {job.salary}
          </li>
        ) : null}
        {job.deadline ? (
          <li className="flex items-center gap-2">
            <CalendarClock className="size-4 shrink-0" aria-hidden />
            Apply by {formatDeadline(job.deadline)}
          </li>
        ) : null}
      </ul>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary">
        View role
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
