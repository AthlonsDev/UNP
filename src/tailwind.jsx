/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'unp-green': '#629158',
        'unp-teal': '#00A3A3',
        'unp-orange': '#F97316',
        'unp-dark-gray': '#494948',
        'unp-dark-green': '#102C26',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}