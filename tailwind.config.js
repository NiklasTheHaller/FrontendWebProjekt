/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: {
        50: "#eef0ff",
        100: "#dfe3ff",
        200: "#c5caff",
        300: "#a3a8fe",
        400: "#817efb",
        500: "#6d5ff5",
        600: "#5e42e9",
        700: "#5234ce",
        800: "#422da6",
        900: "#392c83",
        950: "#231a4c",
      },
      secondary: {
        50: "#fcf3f7",
        100: "#fbe8f1",
        200: "#f8d2e3",
        300: "#f4adcb",
        400: "#ec7aa8",
        500: "#e45d8f",
        600: "#d03264",
        700: "#b4224d",
        800: "#951f40",
        900: "#7d1e38",
        950: "#4c0b1d",
      },
      neutral: {
        100: "#FFFFFF",
        200: "#F0F0F5",
        300: "#D9D9E2",
        400: "#9999A8",
        500: "#666675",
        600: "#333342",
        700: "#1C1C28",
      },
      success: "#4CAF50",
      error: "#D32F2F",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};
