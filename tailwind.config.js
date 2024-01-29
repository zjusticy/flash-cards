const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "682px",
      lg: "976px",
      xl: "1440px",
      "2xl": "1800px",
    },
    extend: {
      fontFamily: {
        pressStart: ['"Press Start 2P"', "sans-serif"],
      },
      boxShadow: {
        "button-shadow": "0 0.5rem 0 0  rgb(219, 236, 227)",
        "button-shadow-active": "0 1px 0 white",
      },
      colors: {
        "custom-yellow": "#BAA333",
        "primary-color": "#333",
        "secondary-color": "rgb(236, 245, 240)",
        "button-color": "rgba(9, 132, 113, 0.9)",
      },
    },
  },
  plugins: [],
};
