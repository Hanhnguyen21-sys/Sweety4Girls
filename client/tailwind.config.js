/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#E2B59A",
        accent: "#B77466",
        neutral: "#957C62",
        soft: "#FFE1AF",
        cream: "#FFF7F2",
        dark: "#2E2E2E",
      },

     

      animation: {
        fadeUp: "fadeUp 0.8s ease-out both",
        fadeUpSlow: "fadeUp 1s ease-out both",
        fadeIn: "fadeIn 1s ease-out both",
      },

      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(25px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
    },
  },

  plugins: [],
};