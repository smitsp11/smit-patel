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
  title: "Smit Patel | Software Engineer & Photographer",
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
  openGraph: {
    title: "Smit Patel | Software Engineer & Photographer",
    description:
      "A vintage photography-themed portfolio showcasing software engineering projects and creative work.",
    type: "website",
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
        <HeroProvider>
          <LenisProvider>
            <BackgroundLayer />
            <LensCursor />
            {children}
          </LenisProvider>
        </HeroProvider>
      </body>
    </html>
  );
}
