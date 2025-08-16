/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        riesgo: {
          bajo: '#16a34a',
          medio: '#ca8a04',
          alto: '#f97316',
          critico: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}
