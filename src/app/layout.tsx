import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Smit Patel | Software Engineer",
  description:
    "Software engineer and photographer. Computer Engineering at the University of Toronto.",
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
      "Software engineer and photographer. Computer Engineering at the University of Toronto.",
    type: "website",
    siteName: "Smit Patel",
  },
  twitter: {
    card: "summary",
    title: "Smit Patel | Software Engineer & Photographer",
    description:
      "Software engineer and photographer. Computer Engineering at the University of Toronto.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-text focus:outline-none focus:ring-2 focus:ring-border"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
