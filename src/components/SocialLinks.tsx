import type { SocialLink } from "@/types";

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <p className="text-sm">
      {links.map((link, index) => (
        <span key={link.platform}>
          {index > 0 && (
            <span className="text-text-muted" aria-hidden="true">
              {" · "}
            </span>
          )}
          <a
            href={link.url}
            target={link.platform === "email" ? undefined : "_blank"}
            rel={link.platform === "email" ? undefined : "noopener noreferrer"}
            className="text-text underline-offset-2 hover:underline"
          >
            {link.label}
          </a>
        </span>
      ))}
    </p>
  );
}
