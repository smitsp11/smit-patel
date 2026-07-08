import { Section } from "@/components/Section";
import { SocialLinks } from "@/components/SocialLinks";
import { PhotoStrip } from "@/components/PhotoStrip";
import { ExperienceItem } from "@/components/ExperienceItem";
import { jobs, photos, socialLinks } from "@/data/content";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-content px-6 pb-20">
        <section id="about" className="pt-16 pb-6 md:pt-24 md:pb-8">
          <h1 className="font-display text-4xl text-text md:text-5xl">
            Smit Patel
          </h1>
          <p className="mb-6 mt-2 text-text-muted">
            Software Engineer · Photographer
          </p>

          <ul className="mb-6 list-disc space-y-1.5 pl-5 leading-relaxed text-text marker:text-text-muted">
            <li>
              Computer Engineering at the{" "}
              <a
                href="https://www.utoronto.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                University of Toronto
              </a>
            </li>
            <li>Software engineer building full-stack AI products</li>
            <li>Outside code: photography, Formula 1, and lifting</li>
          </ul>

          <SocialLinks links={socialLinks} />

          <div className="mt-10">
            <PhotoStrip photos={photos} />
          </div>
        </section>

        <Section id="experience" title="Experience">
          <div>
            {jobs.map((job) => (
              <ExperienceItem key={job.id} job={job} />
            ))}
          </div>
        </Section>

        <section id="contact" className="border-t border-border py-16 md:py-20">
          <div className="mb-8 flex justify-center text-text-muted">
            <div data-webring="ca" data-member="smit-patel" />
          </div>

          <footer className="text-center text-xs text-text-muted">
            © {new Date().getFullYear()} Smit Patel
          </footer>
        </section>
      </main>

      <Script src="https://webring.ca/embed.js" strategy="lazyOnload" />
    </>
  );
}
