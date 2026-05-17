/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        neutral: { DEFAULT: '#404040' },
        zinc: {
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          500: '#71717a',
          800: '#27272a',
        },
        error: '#ef4444',
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        subhead: ['40px', { lineHeight: '48px', letterSpacing: '-0.02em' }],
        h1: ['36px', { lineHeight: '44px', letterSpacing: '-0.02em' }],
        h2: ['32px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        h3: ['28px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        h4: ['24px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
        h5: ['20px', { lineHeight: '24px', letterSpacing: '-0.02em' }],
        h6: ['16px', { lineHeight: '20px', letterSpacing: '-0.02em' }],
        p1: ['20px', { lineHeight: '24px', letterSpacing: '0.02em' }],
        p2: ['16px', { lineHeight: '20px', letterSpacing: '0.02em' }],
        p3: ['12px', { lineHeight: '16px', letterSpacing: '0.02em' }],
      },
      maxWidth: {
        content: '1100px',
      },
    },
  },
  plugins: [],
}
