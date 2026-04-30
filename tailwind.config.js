/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs personnalisées
        primary: '#2563eb',
        secondary: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}