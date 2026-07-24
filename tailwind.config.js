/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aether: {
          primary: "#00E5FF",
          secondary: "#7C3AED",
          accent: "#00FFB3",
          bg: "#050816",
          surface: "#0B1120",
          card: "#111827",
          border: "#1F2937",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
        glow: {
          cyan: "#22D3EE",
          blue: "#3B82F6",
          purple: "#8B5CF6",
          pink: "#EC4899",
        },
      },
    },
  },
  plugins: [],
};