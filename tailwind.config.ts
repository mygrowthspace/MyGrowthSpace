import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9f7f4',
          100: '#f3ede7',
          200: '#e8ddd4',
          300: '#dcccc0',
          400: '#d1bcad',
          500: '#c5ab99',
          600: '#b89a85',
          700: '#ac8971',
          800: '#a0785d',
          900: '#946749',
          950: '#6b2f1f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
