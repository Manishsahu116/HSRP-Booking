/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#0a1d35', 900: '#102b4e', 800: '#173c68' },
        orange: { 500: '#f28b30', 600: '#df741b' }
      },
      boxShadow: { soft: '0 18px 55px rgba(15, 42, 75, .10)' }
    }
  },
  plugins: []
}
