/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'night': '#1E2A38',
        'arcane': '#5B3C88',
        'cyan-light': '#4FD1C5',
        'silver': '#D1D5DB',
        'soft-white': '#F9FAFB',
      },
    },
  },
  plugins: [],
};
