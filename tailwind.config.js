/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: "#9381FF",
      background: "#272727",
      accent: "#5C946E",
      light: "#E0FBFC",
    },
    extend: {},
  },
  plugins: [],
};
