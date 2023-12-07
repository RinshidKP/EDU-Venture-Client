/** @type {import('tailwindcss').Config} */
import animated from 'tailwindcss-animated';
import tailwindcssBgPatterns from 'tailwindcss-bg-patterns';
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
    patterns: {
      opacities: {
        100: "1",
        80: ".80",
        60: ".60",
        40: ".40",
        20: ".20",
        10: ".10",
        5: ".05",
      },
      sizes: {
        1: "0.25rem",
        2: "0.5rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
      },
    },
  },
  plugins: [
    animated,
    tailwindcssBgPatterns
  ],
}