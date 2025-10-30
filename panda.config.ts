import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './styles/**/*.{js,jsx,ts,tsx}',
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      breakpoints: {
        pc: '1024px',
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',

  // JSX framework
  jsxFramework: 'react',
});
