/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5B2C8E",
          light: "#7B3FA0",
          soft: "#9B59B6",
        },
        accent: "#F5A623",
      },
      fontFamily: {
        app: ["'Pretendard'", "'Apple SD Gothic Neo'", "sans-serif"],
      },
      keyframes: {
        fadeSlideIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-slide": "fadeSlideIn 0.3s ease both",
      },
    },
  },
  plugins: [],
};
