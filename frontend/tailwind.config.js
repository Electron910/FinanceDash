/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
  ],
  // ── Safelist dynamic classes that Tailwind can't statically scan ──
  safelist: [
    'text-green-400',
    'text-red-400',
    'text-blue-400',
    'text-yellow-400',
    'text-sand',
    'text-cream',
    'text-income',
    'text-expense',
    'bg-income',
    'bg-expense',
  ],
  theme: {
    extend: {
      colors: {
        'forest-dark': '#2C3930',
        forest: '#3F4F44',
        sand: '#A27B5C',
        cream: '#DCD7C9',
      },
      fontFamily: {
        marseille: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(162, 123, 92, 0.3)',
        'glow-lg': '0 0 40px rgba(162, 123, 92, 0.4)',
        card: '0 4px 24px rgba(44, 57, 48, 0.3)',
        'card-hover': '0 8px 32px rgba(44, 57, 48, 0.5)',
      },
    },
  },
  plugins: [],
};