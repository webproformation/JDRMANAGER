/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'night': '#1B2A3F', 
        'arcane': '#583B84', 
        'cyan-light': '#2DD4BF', 
        // LA CORRECTION EST ICI : Couleur exacte de tes blocs Hubs
        'vtt-card-bg': '#242643', 
        'silver': '#D1D5DB',
        'soft-white': '#F9FAFB',
      },
      backgroundImage: {
        'ultimate-gradient': 'linear-gradient(135deg, #1B2A3F 0%, #583B84 100%)',
      }
    },
  },
  plugins: [],
};