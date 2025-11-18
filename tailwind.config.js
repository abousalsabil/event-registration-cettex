/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39FF14',
        'dark-purple': '#0b0014',
        'cettex-navy': '#1e3a8a',      // Dark Blue/Navy for CTAs, footers, and important sections
        'cettex-navy-dark': '#1e40af', // Darker navy for hover states
        'cettex-cyan': '#22d3ee',      // Lighter Cyan/Aqua for accent color
        'cettex-cyan-light': '#67e8f9', // Light cyan for highlights
        'cettex-gray': '#f8fafc',      // Light Gray for main content background
        'cettex-gray-dark': '#64748b',  // Dark gray for text
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          'from': {
            textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #39FF14, 0 0 20px #39FF14',
            boxShadow: '0 0 5px #39FF14, 0 0 10px #39FF14, inset 0 0 5px #39FF14'
          },
          'to': {
            textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #39FF14, 0 0 40px #39FF14',
            boxShadow: '0 0 10px #39FF14, 0 0 20px #39FF14, inset 0 0 10px #39FF14'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}