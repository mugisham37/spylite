import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        antonio: ["var(--font-antonio)", "sans-serif"],
        "proxima-nova": ["var(--font-proxima-nova)", "system-ui", "arial"],
      },
    },
  },
};

export default config;
