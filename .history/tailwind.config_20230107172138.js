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
    extend: {
      colors: {
        'sasblack':'#5D5C61',
        'sasgrey': '#379683',
        'sasskyblue': '#7395AE',
        'sasnavyblue': '#557A95',
        'sasgold':'#B1A296',
      }
    },
    fontFamily: {
      button: ['Lato',],
      body: ['Prata',],
    },
  },
  plugins: [],
}
