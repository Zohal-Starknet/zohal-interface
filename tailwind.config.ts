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
        "button-primary": "#4681f4",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        slideDown: {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
        rotate90: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(90deg)" },
        },
        rotate0: {
          from: { transform: "rotate(90deg)" },
          to: { transform: "rotate(0deg)" },
        },
      },
    },
  },
  plugins: [],
  // We add our custom colors to the safeList to be able to use them for our components
  safelist: ["bg-button-primary"],
};
export default config;
