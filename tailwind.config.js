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
      },
      animation: {
        'fadeOut': 'fadeOut 2s linear forwards'
      },
      keyframes: {
        fadeOut: {
          'from': {
            opacity: '1',
            PointerEvent: 'all',
          },
          'to': {
            opacity: '0',
            PointerEvent: 'none',
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  important: true,
}
