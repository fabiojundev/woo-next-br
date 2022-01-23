module.exports = {
  // @see https://tailwindcss.com/docs/upcoming-changes
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  content: [
    './src/components/**/*.js',
    './pages/**/*.js'],
  theme: {
    fontFamily: {
      sans: [
        '"Open Sans"', 
        'Arial',
        'sans-serif',
        '"Helvetica Neue"',
      ],
    },
    extend: {
      height: {
        'almost-screen': 'calc(-16rem + 100vh)',
        '100px': '6.25rem',
        '308px': '19.25rem',
        '500px' : '31.25rem'
      },
      width: {
        '100px': '6.25rem',
        '308px': '19.25rem',
        '600px': '37.5rem',
      },
      maxHeight: {
        '500px' : '31.25rem'
      }
    },
  },
  variants: {},
  plugins: [
    require( 'tailwindcss' ),
    require( 'precss' ),
    require( 'autoprefixer' )
  ]
}
