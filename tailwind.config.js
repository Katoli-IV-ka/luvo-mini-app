/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      publicSans: ["Public Sans", "sans-serif"],
    },
    extend: {
      colors: {
        "primary-red": "#A62739",
        "primary-gray": "#B8BFC7",
        "gray-light": "#EEF1F6",
        //
        "primary-10": "rgba(255, 255, 255, 0.1)",
        "icon-white": "#FFFFFF",
        "additional-yellow": "#FFCC00",
        "additional-yellow-30": "rgba(255, 204, 0, 0.3)",
        "button-primary-active": "#5AAD6D",
        "icon-grey": "rgba(255, 255, 255, 0.4)",
        "button-secondary-active": "rgba(255, 255, 255, 0.1)",
        "additional-green": "#34C759",
        "additional-dark-green": "#113E28",
        "additional-blue": "#0170A9",
        "additional-red": "#FF3B30",
        "surface-secondary": "#18191D",
        "custom-teal": "#59EAEB",
        "custom-teal-10": "rgba(89, 234, 235, 0.1)",
        "surface-primary": "#0e0f13",
        "stroke-gray": "#E9EAEB",
      },
    },
  },
  plugins: [],
};
