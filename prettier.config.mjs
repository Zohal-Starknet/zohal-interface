/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["cva", "clsx", "twMerge"],
};

export default config;
