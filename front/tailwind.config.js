import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      blur: {
        "4xl": "40px",
        "5xl": "50px",
        "6xl": "60px",
        max: "100px",
      },
      colors: {
        main: "#7575FE",
        lightGrey: {
          100: "#F9F9F9",
          200: "#F0F0F0",
          primary: "#16a34a",
          secondary: "#a7f3d0",
        },
        dark: {
          100: "#3F3F46",
          200: "#27272A",
          300: "#141414",
        },
      },
      screens: {
        xs: "250px",
      },

      borderRadius: {
        xl: "1rem",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
