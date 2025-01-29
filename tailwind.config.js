module.exports = {
  prefix: 'tw-',
  corePlugins: {
    container: false,
  },
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
  ],
  theme: {
    screens: {
      sm: '420px',
      md: '767px',
      lg: '992px',
      xl: '1200px',
      xlg: '1440px',
      x2lg: '1920px',
      pageMaxWidth: '1440px',
    },
    extend: {
      fontFamily: {
        tangerine: ['Tangerine', 'serif'],
        tangerineBold: ['Tangerine-Bold', 'serif'],
        snell: ['Snell Roundhand', 'serif'],
      },

      colors: {
        primary: {
          black: '#211E19',
          white: '#FFFFFF',
          'off-white': '#FAFAFA',
          'grey-mid': '#D8D8D8',
          'soft-ivory': '#F6F3F2',
        },
        secondary: {
          blue: '#007CBC',
          pink: '#D43976',
          orange: '#D24700',
          green: '#008933',
          purple: '#754193',
          navy: '#2A3572',
          grey: '#757778',
          slate: '#3E3F3F',
          plum: '#6E2B62',
        },
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px',
        xxl: '64px',
      },
    
    },
  },
  plugins: [],
};
