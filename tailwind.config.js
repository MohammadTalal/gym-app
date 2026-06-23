/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d9f1ff',
          200: '#bce7ff',
          300: '#8ed8ff',
          400: '#59c0ff',
          500: '#33a3ff',
          600: '#1c84f5',
          700: '#156be1',
          800: '#1857b6',
          900: '#1a4b8f',
        },
      },
      fontFamily: {
        // Inter renders Latin; Tajawal covers Arabic glyphs (browsers pick
        // per-character), so one stack works for both languages.
        sans: ['Inter', 'Tajawal', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)',
        'card-dark': '0 2px 12px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
