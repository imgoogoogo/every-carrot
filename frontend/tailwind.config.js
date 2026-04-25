/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#F29100",          // 메인 주황
        "brand-red": "#E94E1B",    // 포인트 빨강
        "brand-yellow": "#FDC300", // 포인트 노랑
        "brand-soft": "#FEEBC8",   // 연한 주황 (배경용)
      },
      fontFamily: {
        app: ["Pretendard", "Apple SD Gothic Neo", "sans-serif"],
      },
    },
  },
  plugins: [],
}