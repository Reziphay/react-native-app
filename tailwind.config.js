/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: '#C65D1A',
        'accent-strong': '#8E3B0C',
        'accent-soft': '#F1C8AB',
        border: '#D6C7B5',
        canvas: '#F3EFE6',
        danger: '#B0302C',
        ink: '#1F1A17',
        'ink-soft': '#5C5147',
        success: '#1E6A4A',
        surface: '#FFFDF8',
        'surface-muted': '#E9DED0',
        warning: '#9A6A12',
      },
      borderRadius: {
        xl: '20px',
        '2xl': '28px',
      },
      fontFamily: {
        display: ['System'],
        sans: ['System'],
      },
      spacing: {
        18: '72px',
        22: '88px',
      },
    },
  },
  plugins: [],
};
