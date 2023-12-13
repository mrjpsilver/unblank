/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./templates/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    colors,
    extend: {
      gridTemplateRows: {
        'container': 'auto 1fr auto',
      },
      gridTemplateColumns: {
        'links-list': 'auto 1fr auto auto',
        'links-list-md': 'auto 1fr auto auto auto',
      },
    },
  },
  plugins: [],
}

