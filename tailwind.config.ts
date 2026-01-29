import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vintage Photography Palette
        vintage: {
          cream: "var(--color-cream)",
          sepia: "var(--color-sepia)",
          rust: "var(--color-rust)",
          "dark-brown": "var(--color-dark-brown)",
          darkroom: "var(--color-darkroom)",
          // High Dynamic Range Contrast Colors
          "iron-gall": "var(--color-iron-gall)",
          "muted-umber": "var(--color-muted-umber)",
          brass: "var(--color-vintage-brass)",
          "warm-cream": "var(--color-warm-cream)",
          "parchment-grey": "var(--color-parchment-grey)",
          "antique-white": "var(--color-antique-white)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        handwritten: ["var(--font-handwritten)", "cursive"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
