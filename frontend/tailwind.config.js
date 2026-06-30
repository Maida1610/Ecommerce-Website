/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ['Poppins', "sans-serif"],
      Outfit: ["Outfit", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#4361ee",
        "primary-dark": "#3a0ca3",
        secondary: "#f72585",
        accent: "#4cc9f0",
      },
      screens: {
        "1000px": "1050px",
        "1100px": "1110px",
        "800px": "800px",
        "1300px": "1300px",
        "400px": "400px"
      },
    },
  },
  plugins: [],
};