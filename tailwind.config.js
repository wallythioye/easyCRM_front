/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
    },

    extend: {
      borderRadius: {
        'firstCoin': '30px'
      },
      colors : {
        colorHref: "#A3C644",
        easycrm: "#605E55",
        backgroundC : "#FAFAF7",
        sidebar: "#34332C",
        navbar: "#36352F",
        whiteOpacity: 'rgba(255, 255, 255, 0.26)',
        bColor: "#C2B280",
        btnBg: "#A3C644",
      },
    },

  },
  plugins: [],
}

