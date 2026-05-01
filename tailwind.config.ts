import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury palette
        "verde-salvia": {
          50: "#f9fdf8",
          100: "#f0f5f0",
          200: "#d4e4d0",
          300: "#b8d3b0",
          400: "#8db080",
          500: "#628d50",
          600: "#4d7241",
          700: "#3d5a33",
          800: "#2e4426",
          900: "#1f2f1a",
          950: "#0f170d",
        },
        "panna": {
          50: "#fdfaf5",
          100: "#faf5ed",
          200: "#f2e8d9",
          300: "#eadcc5",
          400: "#dcc4a0",
          500: "#cfb27c",
          600: "#c9a876",
          700: "#b89966",
          800: "#a68455",
          900: "#946f46",
          950: "#7a5635",
        },
        "oro-vintage": {
          50: "#fffaf4",
          100: "#fef4e8",
          200: "#fce4c9",
          300: "#fad4aa",
          400: "#f6b970",
          500: "#f3a855",
          600: "#e0933d",
          700: "#c9783a",
          800: "#a56230",
          900: "#854e2a",
          950: "#602d16",
        },
      },
      fontFamily: {
        sans: "var(--font-geist-sans)",
        mono: "var(--font-geist-mono)",
        serif: "var(--font-playfair)",
        display: "var(--font-playfair)",
      },
      spacing: {
        "safe-top": "max(1rem, env(safe-area-inset-top))",
        "safe-bottom": "max(1rem, env(safe-area-inset-bottom))",
      },
    },
  },
  plugins: [],
} satisfies Config;
