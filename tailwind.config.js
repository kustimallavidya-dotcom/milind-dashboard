/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
        },
        dark: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        neon: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
          green: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'shine': 'shine 2s infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
