/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          50: '#E6F2FF',
          100: '#CCE5FF',
          500: '#0066CC',
          600: '#0052A3',
          700: '#003D7A'
        },
        secondary: {
          DEFAULT: '#4A90E2',
          50: '#F0F6FF',
          100: '#E1EDFF',
          500: '#4A90E2',
          600: '#2B73D1'
        },
        accent: {
          DEFAULT: '#00C896',
          50: '#E6FBF5',
          100: '#CCF7EB',
          500: '#00C896',
          600: '#00A078'
        },
        surface: '#FFFFFF',
        background: '#F5F7FA',
        success: '#00C896',
        warning: '#FFA726',
        error: '#EF5350',
        info: '#42A5F5'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.12)'
      }
    },
  },
  plugins: [],
}