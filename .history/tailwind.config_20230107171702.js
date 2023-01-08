/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/*.{html,js,jsx}",
    "./src/**/*.{html,js,jsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {},
    fontFamily: {
      body: ['Lato',],
      header: ['Prata',],
    },
  },
  plugins: [],
}
