import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#58CC02',
          dark: '#58A700',
          light: '#89E219',
        },
        error: {
          DEFAULT: '#FF4B4B',
          dark: '#EA2B2B',
          light: '#FF6B6B',
        },
        success: {
          DEFAULT: '#58CC02',
          dark: '#58A700',
          light: '#89E219',
        },
        neutral: {
          50: '#FFFFFF',
          100: '#F7F9FA',
          200: '#E5E5E5',
          300: '#AFAFAF',
          400: '#777777',
          500: '#4B4B4B',
          600: '#3C3C3C',
          700: '#E5E5E5',
          800: '#FFFFFF',
          900: '#DFE3E8',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'pop': 'pop 0.2s ease-out',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
