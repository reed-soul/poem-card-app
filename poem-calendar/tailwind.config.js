/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#1a1a1a',
        'ink-gray': '#2d2d2d',
        'paper-cream': '#f5f2e8',
        'paper-white': '#faf9f6',
        'seal-red': '#c8102e',
        'gold-accent': '#d4af37',
      },
      fontFamily: {
        'serif': ['"Noto Serif SC"', '"STSong"', '"SimSun"', 'serif'],
        'handwriting': ['"KaiTi"', '"STKaiti"', 'serif'],
      },
    },
  },
  plugins: [],
}
