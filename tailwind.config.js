/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./templates/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    colors,
    extend: {},
  },
  plugins: [],
}

