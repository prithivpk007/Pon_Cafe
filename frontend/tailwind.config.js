/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          50: '#FDF8F3',
          100: '#FAF0E6',
          200: '#F5E1CE',
          300: '#ECCBAE',
          400: '#DEAB7F',
          500: '#D97706', // Primary warm amber/honey
          600: '#B45309', // Deep amber
          700: '#853A04', // Cinnamon
          800: '#5C2703', // Rich mocha/chocolate
          900: '#381601', // Dark roast
          950: '#200C00', // Deep espresso
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFFBEB',
          200: '#FEF3C7',
          300: '#FDE68A',
        },
        cinnamon: '#C05621',
        gold: '#D97706',
        caramel: '#C27803',
        espresso: '#271911',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(217, 119, 6, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'warm': '0 10px 30px -5px rgba(180, 83, 9, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px rgba(217, 119, 6, 0.35)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
