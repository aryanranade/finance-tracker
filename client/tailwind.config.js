/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          50:  '#f0edff',
          100: '#e0dbff',
          200: '#c2b7ff',
          300: '#a490ff',
          400: '#8b6eff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b1278',
        },
        // App surface colors
        surface: {
          900: '#0b0b1e',
          800: '#13132b',
          700: '#1a1a3e',
          600: '#222250',
          500: '#2d2d6b',
        },
        // Borders
        border: {
          DEFAULT: '#2d2d5e',
          light: '#3d3d7e',
        },
        // Status
        success: '#10b981',
        danger:  '#ef4444',
        warning: '#f59e0b',
        info:    '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(124,58,237,0.35)',
        'glow-green': '0 0 20px rgba(16,185,129,0.25)',
        'glow-red': '0 0 20px rgba(239,68,68,0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
