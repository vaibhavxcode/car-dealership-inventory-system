export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dbe9',
          300: '#a6bdd7',
          400: '#7599c1',
          500: '#527ba8',
          600: '#3e618b',
          700: '#334e71',
          800: '#2c425f',
          900: '#273951',
          950: '#1a2537',
        },
        accent: {
          50: '#fbf7f0',
          100: '#f4ebd8',
          200: '#e7d3af',
          300: '#d5b37b',
          400: '#c5944f',
          500: '#b17c3c',
          600: '#956030',
          700: '#7c4b2a',
          800: '#673e27',
          900: '#583624',
          950: '#321c12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
