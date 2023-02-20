module.exports = {
  mode: 'jit',
  purge: ['./public/*.html', './src/**/*.{html,js,jsx}'],
  theme: {
    colors: {
      'gray-100': '#1f1f1f',
      'gray-90': '#2f2f2f',
      'gray-80': '#424242',
      'gray-60': '#727272',
      'gray-50': '#949494',
      'gray-40': '#BBBBBB',
      'gray-20': '#EEEEEE',
      'blue-50': '#0078CE',
      'lemon-50': '#FBEB87',
      'lemon-40': '#FEEF88',
      'lemon-30': '#FBE97A',
      'lemon-20': '#FDF693',
      'lemon-10': '#FFFCCC',
      white: '#fff',
      'coral-100': '#A3003F',
      'coral-90': '#CB345F',
      'coral-80': '#D60057',
      'coral-70': '#E8005A',
      'extra-light-gray': '#fafafa',
      black: '#000'
    },
    extend: {
      boxShadow: {
        sticky: '0px 3px 3px rgba(0, 0, 0, 0.15)',
        object:
          '0px 0px 0px 1px rgba(0, 0, 0, 0.08), 0px 5px 8px rgba(0, 0, 0, 0.08)',
        button: '0px -4px 16px rgba(0, 0, 0, 0.08)'
      },
      keyframes: {
        fadeIn: {
          '0%, 50%': { opacity: 0 },
          '100%': { opacity: 100 }
        }
      },
      animation: {
        'delayed-fade-in': 'fadeIn 1s ease-in'
      }
    }
  },
  plugins: []
};
