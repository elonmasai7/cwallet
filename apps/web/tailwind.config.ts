import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sunrise: "#f97316",
        mint: "#34d399",
        sand: "#f8efe3",
        ocean: "#0f766e",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 18px 45px rgba(15, 23, 42, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;

