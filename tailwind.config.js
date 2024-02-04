import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{html,tsx,ts,jsx,js}'
  ],
  theme: {
    colors: {
      action: colors.cyan[500],
      actionHighlight: colors.cyan[600],
      background: colors.slate[900],
      backgroundEmphasis: colors.slate[950],
      button: colors.slate[600],
      buttonActive: colors.zinc[800],
      buttonDisabled: colors.gray[500],
      danger: colors.red[900],
      primary: colors.yellow[400],
      primaryContrast: colors.slate[900],
      
      // Status
      dispatched: colors.blue[800],
      unavailable: colors.red[800],
    },
    extend: {
      keyframes: {
        tinyPing: {
          '50%': {
            transform: 'scale(1.01)'
          },
          '100%': {
            transform: 'scale(1)'
          }
        }
      },
      animation: {
        tinyPing: 'tinyPing 1.5s cubic-bezier(0, 0, 1, 1) infinite'
      }
    },
  },
  plugins: [],
}

