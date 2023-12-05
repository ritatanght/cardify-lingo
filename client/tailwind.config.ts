import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "color-1": "#f78888",
      "color-2": "#f3d250",
      "color-3": "#ececec",
      "color-4": "#90ccf4",
      "color-5": "#5da2d5",
      "darken-5-100": "#358bcb",
      "darken-5-200": "#25618e",
    },
    extend: {
      colors: {
        transparent: "transparent",
        white: "#fff",
        "slate-300": "rgb(203 213 225)",
        "gray-50": "rgb(249 250 251)",
        "gray-500": "rgb(107 114 128)",
        "gray-600": "rgb(75 85 99)",
      },
    },
  },
  plugins: [],
};
export default config;
