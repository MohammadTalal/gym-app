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
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Springy "pop" for celebrating an action (e.g. completing a set).
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        // Gentle bob for hero icons.
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        // Soft attention pulse (rest timer, ready states).
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.9' },
        },
        // A single confetti piece falling + spinning.
        confetti: {
          '0%': { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate3d(var(--dx), 110vh, 0) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.25s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        pop: 'pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        float: 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
