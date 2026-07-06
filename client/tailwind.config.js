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
        // Secondary accent (for gradients / highlights)
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        // App surface colors — true black scale
        surface: {
          900: '#060607',
          800: '#0b0b0d',
          700: '#131316',
          600: '#1b1b1f',
          500: '#232329',
        },
        // Borders — neutral, hairline
        border: {
          DEFAULT: '#232329',
          light: '#34343c',
        },
        // Status
        success: '#10b981',
        danger:  '#ef4444',
        warning: '#f59e0b',
        info:    '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.55)',
        'card-lg': '0 12px 48px rgba(0,0,0,0.65)',
        glow: '0 0 24px rgba(139,110,255,0.30)',
        'glow-lg': '0 0 48px rgba(139,110,255,0.40)',
        'glow-green': '0 0 20px rgba(16,185,129,0.25)',
        'glow-red': '0 0 20px rgba(239,68,68,0.25)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.25)',
        'inner-highlight': 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 8s ease-in-out infinite',
        'aurora': 'aurora 14s ease-in-out infinite alternate',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        aurora: {
          '0%':   { transform: 'translate(0, 0) scale(1)' },
          '50%':  { transform: 'translate(40px, -30px) scale(1.15)' },
          '100%': { transform: 'translate(-30px, 20px) scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
}
