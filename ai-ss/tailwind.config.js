/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./public/index.html",         // 선택 사항
  ],
  theme: {
    extend: {
        colors: {
            primary: {
                DEFAULT: 'rgb(112,137,170)', // 메인 색 (투명도 56%)
                hover: '#002D67', // hover 시 완전 불투명
                //hover: '#7089AA',
                foreground: '#ffffff', // 글자색 (흰색)
            },
        },
    },
  },
  plugins: [],
}
