import Image from "next/image";
import type { Job } from "@/types";

interface ExperienceItemProps {
  job: Job;
}

export function ExperienceItem({ job }: ExperienceItemProps) {
  const meta = [
    job.startDate && `${job.startDate} – ${job.endDate}`,
    job.location,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3 className="inline-flex items-center gap-2 font-medium text-text">
          {job.logo && (
            <Image
              src={job.logo}
              alt=""
              width={18}
              height={18}
              className="rounded-[3px]"
            />
          )}
          {job.companyUrl ? (
            <a
              href={job.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              {job.company}
            </a>
          ) : (
            job.company
          )}
        </h3>
        <span className="text-text-muted">—</span>
        <span className="text-text">{job.role}</span>
      </div>
      {meta && <p className="mb-2 text-sm text-text-muted">{meta}</p>}
      {job.description && (
        <p className="leading-relaxed text-text">{job.description}</p>
      )}
    </article>
  );
}
