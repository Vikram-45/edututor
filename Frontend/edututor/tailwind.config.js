/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#e8621a',
          hover: '#d05510',
          light: '#fff0e8',
        },
        surface: {
          DEFAULT: '#f6f5f0',
          card: '#ffffff',
        },
        ink: {
          DEFAULT: '#0d0f14',
          soft: '#2a2d36',
          muted: '#6b7080',
        },
      },
    },
  },
  plugins: [],
}