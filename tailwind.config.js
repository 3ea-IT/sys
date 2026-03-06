import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          primary: '#0F2A44',     // main navy
          secondary: '#5F6C7B',   // slate text
          background: '#F7F9FC',  // app bg
          card: '#FFFFFF',
          border: '#E3E8EF',

          success: '#1F8A70',
          warning: '#F2A541',
          danger: '#D64545',
        },
      },
      boxShadow: {
        card: '0 6px 20px rgba(15,42,68,0.08)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
