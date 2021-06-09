module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        '2xs': '240px',
        'xs': '468px',
        '3xl': "2000px"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  important: true,
}
