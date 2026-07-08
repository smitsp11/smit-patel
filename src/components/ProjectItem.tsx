import type { Project } from "@/types";

interface ProjectItemProps {
  project: Project;
}

export function ProjectItem({ project }: ProjectItemProps) {
  const title = project.githubUrl ? (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-text underline-offset-2 hover:underline"
    >
      {project.title}
    </a>
  ) : (
    <span>{project.title}</span>
  );

  return (
    <article className="border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0">
      <h3 className="mb-1 font-medium">
        {title}
        <span className="ml-2 font-normal text-text-muted">({project.year})</span>
      </h3>
      <p className="mb-2 leading-relaxed text-text">{project.description}</p>
      <p className="text-sm text-text-muted">{project.techStack.join(" · ")}</p>
    </article>
  );
}
