/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#5B2C8E",
        "brand-soft": "#7B3FA0",
      },
      fontFamily: {
        app: ["Pretendard", "Apple SD Gothic Neo", "sans-serif"],
      },
    },
  },
  plugins: [],
}