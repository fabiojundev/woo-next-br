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
      },
      colors: {
        'gray-default': '#4a4e57',
        'green-default': '#74975d',
        'bg-green-default': '#65bc7b',
        'green-500': '#97B584',
      },  
    },
  },
  variants: {},
  plugins: [
    require( 'tailwindcss' ),
    require( 'precss' ),
    require( 'autoprefixer' )
  ]
}
