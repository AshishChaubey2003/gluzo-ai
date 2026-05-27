/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        cream: {
          50:  "#FDFCFA",
          100: "#FAF8F4",
          200: "#F4F0E8",
          300: "#EBE4D6",
        },
        blush: {
          100: "#FDEEF2",
          200: "#F9D6E0",
          300: "#F0A8BC",
          400: "#E07898",
          500: "#C95070",
          600: "#A63254",
        },
        gold: {
          100: "#FDF6E3",
          200: "#F7E2A8",
          300: "#EDCA6A",
          400: "#D4A843",
          500: "#B08628",
        },
        stone: {
          50:  "#FAFAF9",
          100: "#F5F5F3",
          200: "#E8E6E1",
          300: "#D4D0C8",
          400: "#A8A39A",
          500: "#78746C",
          600: "#57534C",
          700: "#44403A",
          800: "#2C2925",
          900: "#1A1714",
        },
      },
      animation: {
        "fade-up":       "fadeUp 0.5s ease forwards",
        "fade-in":       "fadeIn 0.4s ease forwards",
        "slide-in-right":"slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-slow":    "pulse 3s ease-in-out infinite",
        "shimmer":       "shimmer 2s linear infinite",
        "typing":        "typing 1.2s steps(3, end) infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(100%)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        typing: {
          "0%,100%": { content: "'●'" },
          "33%":     { content: "'● ●'" },
          "66%":     { content: "'● ● ●'" },
        },
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        "glow-blush": "0 0 40px -8px rgba(201,80,112,0.25)",
        "glow-gold":  "0 0 40px -8px rgba(212,168,67,0.3)",
        "card":       "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06)",
        "chat":       "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
