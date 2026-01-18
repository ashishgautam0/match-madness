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
          dark: '#4CAE00',
          light: '#6FE012',
        },
        error: {
          DEFAULT: '#FF4B4B',
          dark: '#E63535',
          light: '#FF6B6B',
        },
        success: {
          DEFAULT: '#58CC02',
          dark: '#4CAE00',
          light: '#6FE012',
        },
        neutral: {
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          300: '#A4A4A4',
          400: '#7E7E7E',
          500: '#5E5E5E',
          600: '#4A4A4A',
          700: '#3D3D3D',
          800: '#2A2A2A',
          900: '#1A1A1A',
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
