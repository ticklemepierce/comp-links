import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        'xl': '1em',
      }
    },
  },
  plugins: [],
} satisfies Config

