/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // your template files
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        avans: {
          red: "#c6002a",
          lightred: "#F15A24",
          dark: "#111111",
          gray: {
            100: "#F7F7F7",
            200: "#E1E1E1",
            300: "#CFCFCF",
            400: "#B1B1B1",
            500: "#9E9E9E",
            600: "#7E7E7E",
            700: "#626262",
            800: "#4B4B4B",
            900: "#333333",
          },
        },
      },
      fontFamily: {
        sans: ["Open Sans", "Helvetica", "Arial", "sans-serif"],
        heading: ["Roboto Slab", "Georgia", "serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },
      borderRadius: {
        lg: "0.75rem",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active", "hover"],
      textColor: ["active", "hover"],
      borderColor: ["hover", "focus"],
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
