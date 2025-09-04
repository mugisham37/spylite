const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        antonio: ["var(--font-antonio)", "sans-serif"],
        "proxima-nova": ["var(--font-proxima-nova)", "sans-serif"],
        sans: ["var(--font-antonio)", "sans-serif"],
        paragraph: ["var(--font-proxima-nova)", "sans-serif"],
      },
      colors: {
        // Exact color palette from original design
        black: "#222123",
        "main-bg": "#232224",
        white: "#ffffff",
        "dark-brown": "#523122",
        "mid-brown": "#a26833",
        "light-brown": "#e3a458",
        "red-brown": "#7f3b2d",
        "yellow-brown": "#a26833",
        "milk-yellow": "#e3d3bc",
        red: "#a02128",
        milk: "#faeade",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        spin: "spin 20s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      screens: {
        xs: "475px",
        "3xl": "1600px",
      },
      backgroundImage: {
        "nutrition-gradient": "radial-gradient(circle, #f3ece2, #dcccb0)",
      },
    },
  },
  plugins: [],
};

export default config;
