const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-elevated/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-content items-center justify-between gap-4 px-6 py-4">
        <a
          href="#about"
          className="font-display text-base text-text no-underline hover:underline"
        >
          smit patel
        </a>
        <ul className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-text-muted no-underline transition-colors hover:text-text hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
