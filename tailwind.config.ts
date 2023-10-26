import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("tailwindcss-animate")],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        "btn-danger": "#FF5354",
        "btn-primary": "#4681f4",
        "btn-success": "#40B68B",
      },
      keyframes: {
        rotate0: {
          from: { transform: "rotate(90deg)" },
          to: { transform: "rotate(0deg)" },
        },
        rotate90: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(90deg)" },
        },
        slideDown: {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
};
export default config;
