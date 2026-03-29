import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        farmGreen: "#2E7D32", // Primary Branding
        farmDark: "#1B5E20",
        farmBg: "#F1F8E9",
        farmLeaf: "#81C784",
        // Unified Design System Tokens
        neutral: {
          50: "#F7F8FA", // Base Background
          100: "#E5E7EB",
          200: "#D1D5DB",
          300: "#9CA3AF",
          400: "#6B7280",
          500: "#374151",
          600: "#1F2937",
          700: "#111827", // Surface / Cards (Dark)
          800: "#0B1220", // Background (Dark)
          900: "#060D1F",
        },
      },
      borderRadius: {
        xl: "12px",
        lg: "8px",
        md: "6px",
      },
    },
  },
  plugins: [tailwindAnimate],
};
