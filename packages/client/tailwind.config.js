/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blue: '#6065cb',
        red: '#a00000',
        green: '#00b400',
        yellow: '#ffd023'
      }
    },
  },
  plugins: [],
}

