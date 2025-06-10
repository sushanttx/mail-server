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
        primary: {
          light: '#4285f4',
          dark: '#1a73e8',
        },
        background: {
          light: '#ffffff',
          dark: '#202124',
        },
        sidebar: {
          light: '#f6f8fc',
          dark: '#2d2e31',
        },
      },
    },
  },
  plugins: [],
} 