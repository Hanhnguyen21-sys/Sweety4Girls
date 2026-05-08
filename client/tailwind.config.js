/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E2B59A",
        accent: "#B77466",
        neutral: "#957C62",
        soft: "#FFE1AF",
        cream: "#FFF7F2",
        dark: "#2E2E2E"
      }
    }
  },
  plugins: []
};