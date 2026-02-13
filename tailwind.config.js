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
        // 语义化别名（匹配组件中的类名）
        'paper': '#f5f2e8',     // 卡片背景
        'ink': '#1a1a1a',       // 正文文字
        'accent': '#d4af37',    // 装饰/高亮
        'muted': '#7a7a7a',     // 次要文字（比 ink-gray 更浅）
        'secondary': '#c8102e', // 次要强调（如印章、作者）
      },
      fontFamily: {
        'serif': ['"Noto Serif SC"', '"STSong"', '"SimSun"', 'serif'],
        'handwriting': ['"KaiTi"', '"STKaiti"', 'serif'],
      },
    },
  },
  plugins: [],
}
