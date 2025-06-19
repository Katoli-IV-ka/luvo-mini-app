/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      publicSans: ["Public Sans", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          light: "#ffffff",
          dark: "#000000",
        },
        text: {
          light: "#000000",
          dark: "#ffffff",
        },
        "primary-red": "#A62739",
        "primary-gray": "#B8BFC7",
        "gray-light": "#EEF1F6",
        "primary-yellow": "#FFE668",
        "orange-light": "#FFE3AC",
      },
    },
  },
};
