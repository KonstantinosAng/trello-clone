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
        'fadeOut': 'fadeOut 2s linear forwards',
        'width': 'width 200ms linear forwards',
        'shine': 'shine 700ms infinite'
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
        width: {
          '0%': {
            width: '0',
          },
          '50%': {
            width: '5',
          },
          '100%': {
            width: 'full',
          }
        },
        shine: {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(100%)'
          }
        }
      },
      backgroundImage: {
        'photoSidebar': "url('/src/assets/backgroundPhotos.jpg')",
      },
      placeholderColor: {
        'primary': '#3490dc',
        'secondary': '#ffed4a',
        'danger': '#e3342f',
      }
    },
  },
  variants: {
    extend: {
      placeholderColor: ['hover', 'active'],
    },
    animation: ['responsive', 'motion-safe', 'motion-reduce']
  },
  plugins: [],
  important: true,
}
