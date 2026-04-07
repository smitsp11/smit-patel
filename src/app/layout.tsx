import type { Metadata } from "next";
import { Playfair_Display, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { BackgroundLayer } from "@/components/ui/BackgroundLayer";
import { LensCursor } from "@/components/ui/LensCursor";
import { HeroProvider } from "@/contexts/HeroContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwritten",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smit Patel | Software Engineer",
  description:
    "A vintage photography-themed portfolio showcasing software engineering projects, experience, and creative work.",
  keywords: [
    "software engineer",
    "portfolio",
    "photography",
    "web developer",
    "react",
    "nextjs",
  ],
  authors: [{ name: "Smit Patel" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  openGraph: {
    title: "Smit Patel | Software Engineer & Photographer",
    description:
      "A vintage photography-themed portfolio showcasing software engineering projects and creative work.",
    type: "website",
    siteName: "Smit Patel Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smit Patel | Software Engineer & Photographer",
    description:
      "A vintage photography-themed portfolio showcasing software engineering projects and creative work.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body className="antialiased film-grain">
        {/* Skip to main content link for accessibility */}
        <a
          href="#about"
          className="
            sr-only focus:not-sr-only
            focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
            focus:px-4 focus:py-2
            focus:bg-vintage-darkroom focus:text-vintage-cream
            focus:rounded-md focus:outline-none focus:ring-2 focus:ring-vintage-sepia
          "
        >
          Skip to main content
        </a>
        
        <HeroProvider>
          <LenisProvider>
            <BackgroundLayer />
            <LensCursor />
            {children}
            {/* Canadian Webring Widget */}
            <div 
              className="text-white"
              data-webring="ca" 
              data-member="smit-patel"
            ></div>
            <script src="https://webring.ca/embed.js" defer></script>
          </LenisProvider>
        </HeroProvider>
      </body>
    </html>
  );
}
