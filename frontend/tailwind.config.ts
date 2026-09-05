import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta estrictamente monocromatica en escala zinc / neutral
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
      },
      borderRadius: {
        // Restriccion de geometria: maximo 6px a 8px
        DEFAULT: '0.375rem', // 6px
        sm: '0.25rem',      // 4px
        md: '0.375rem',     // 6px
        lg: '0.5rem',       // 8px
        xl: '0.5rem',       // Capado a 8px maximo segun regla de diseno
        '2xl': '0.5rem',    // Capado a 8px
      },
    },
  },
  plugins: [],
};

export default config;
