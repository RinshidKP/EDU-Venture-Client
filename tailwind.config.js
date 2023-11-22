/** @type {import('tailwindcss').Config} */
import animated from 'tailwindcss-animated';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      roboto: ['Roboto', 'sans'],
      poppins: ['Poppins', 'sans'],
      sans: ['Open Sans', 'sans'],
    },
  },
  plugins: [
    animated
  ],
}