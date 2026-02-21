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
        wood: {
          light: '#a8e6cf',
          DEFAULT: '#4caf50',
          dark: '#2e7d32',
        },
        fire: {
          light: '#ffccbc',
          DEFAULT: '#f44336',
          dark: '#c62828',
        },
        earth: {
          light: '#fff9c4',
          DEFAULT: '#ffeb3b',
          dark: '#f57f17',
        },
        metal: {
          light: '#e0e0e0',
          DEFAULT: '#9e9e9e',
          dark: '#616161',
        },
        water: {
          light: '#b3e5fc',
          DEFAULT: '#2196f3',
          dark: '#0d47a1',
        },
      },
    },
  },
  plugins: [],
}
