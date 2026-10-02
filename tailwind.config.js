/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07070b',
          900: '#0b0b12',
          850: '#101019',
          800: '#151520',
          700: '#20202e',
          600: '#2c2c3d',
        },
        accent: {
          DEFAULT: '#8b7cff',
          soft: '#b9b0ff',
          cyan: '#5ee6ff',
        },
        error: '#f87171',
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        mega: ['clamp(2.6rem, 6vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.04em' }],
        h1: ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        h3: ['26px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        h4: ['21px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        content: '1160px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,124,255,0.35), 0 18px 60px -12px rgba(139,124,255,0.35)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.4, 1) infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
}
