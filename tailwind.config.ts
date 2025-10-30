import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        coffee: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#E8DFD3',
          300: '#D4C4B0',
          400: '#B8916A',
          500: '#A67C52',
          600: '#8B6642',
          700: '#6B4E32',
          800: '#4A3522',
          900: '#2D2015',
        },
        cream: {
          50: '#FDFCFB',
          100: '#F9F6F1',
          200: '#F3EDE3',
          300: '#E8DFD0',
          400: '#DDD0BC',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
