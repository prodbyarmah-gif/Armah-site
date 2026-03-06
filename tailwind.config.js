/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        armah: {
          black: '#000000',
          red: '#FB3640',
          purple: '#7C3AED',
        },
      },
      fontFamily: {
        head: ['"Heading Trial 38"', 'Anton', 'Oswald', 'Impact', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
