const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,tsx,ts,jsx,js}"
  ],
  theme: {
    colors: {
      action: colors.cyan[500],
      actionHighlight: colors.cyan[600],
      background: colors.slate[900],
      backgroundEmphasis: colors.slate[950],
      button: colors.slate[600],
      buttonActive: colors.zinc[800],
      primary: colors.yellow[400]
    },
    extend: {},
  },
  plugins: [],
}

