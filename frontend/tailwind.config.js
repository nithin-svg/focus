/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        focus: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAE0FD',
          300: '#7CC5FB',
          400: '#38A5F8',
          500: '#0E86D4',
          600: '#006DB8',
          700: '#005796',
          800: '#054A7D',
          900: '#0B3E68',
          950: '#072744',
        },
        navy: {
          800: '#0f172a',
          900: '#090d16',
          950: '#040711',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 30px -5px rgba(0, 87, 150, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 35px -5px rgba(14, 134, 212, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px rgba(14, 134, 212, 0.25)',
      }
    },
  },
  plugins: [],
}
