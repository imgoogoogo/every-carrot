/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#F29100",
        "brand-red": "#E94E1B",
        "brand-yellow": "#FDC300",
        "brand-soft": "#FEEBC8",
      },
      fontFamily: {
        app: ["Pretendard", "Apple SD Gothic Neo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
