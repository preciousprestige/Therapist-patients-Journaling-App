module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: { 50:'#f4f7f4', 100:'#e6ede6', 200:'#ccdccc', 300:'#a5c0a5', 400:'#739f73', 500:'#527f52', 600:'#3f6340', 700:'#334f34', 800:'#2b402c', 900:'#243525' },
        warm: { 50:'#fdf8f0', 100:'#faefd9', 200:'#f5ddb0', 300:'#edc57e', 400:'#e3a74e', 500:'#d98d2e', 600:'#c47323', 700:'#a35a1e', 800:'#84481f', 900:'#6c3c1d' },
        blush: { 50:'#fdf4f4', 100:'#fce8e8', 200:'#f9d4d4', 300:'#f4b0b0', 400:'#ec8080', 500:'#e05555', 600:'#cc3636', 700:'#ab2828', 800:'#8e2424', 900:'#762323' },
      },
      fontFamily: {
        sans: ['"Nunito"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
