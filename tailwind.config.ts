import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#F9FAFF',
        brand: {
          blue: '#2E318A',
          cyan: '#00A6E7',
          purple: '#7F2A88',
          pink: '#E40084',
          white: '#FFFFFF',
          black: '#000000'
        },
        neutral: {
          50: '#FFFFFF',
          75: '#F4F6FD',
          100: '#E7ECFA',
          200: '#D5DEF4',
          700: '#273152',
          900: '#111327'
        }
      },
      fontFamily: {
        sans: ['"Inter var"', 'Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl: '24px'
      },
      boxShadow: {
        card: '0 25px 60px -30px rgba(17, 19, 39, 0.22)'
      }
    }
  },
  plugins: []
};

export default config;
