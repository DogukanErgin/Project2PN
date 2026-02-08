import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050504",
        midnight: "#0B0A08",
        "midnight-soft": "#13110F",
        ember: "#B66A2A",
        amber: "#D9A15B",
        cream: "#F6E7D2",
        fog: "#A0978C",
        line: "#2A241E"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"]
      },
      boxShadow: {
        glow: "0 0 80px rgba(214, 141, 71, 0.28)",
        card: "0 14px 30px rgba(0, 0, 0, 0.3)"
      },
      maxWidth: {
        content: "1180px"
      }
    }
  },
  plugins: []
};

export default config;
