/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farmGreen: "#2E7D32",
        farmDark: "#1B5E20",
        farmBg: "#F1F8E9",
        farmLeaf: "#81C784",
      },
    },
  },
  plugins: [],
}