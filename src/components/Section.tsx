import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("py-12 md:py-14", className)}>
      <h2 className="font-display mb-8 text-2xl text-text">{title}</h2>
      {children}
    </section>
  );
}
