import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // hover: solo en dispositivos con puntero; evita estados pegados al tocar en el celular
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      colors: {
        // Base monocromatica en escala zinc / neutral
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        // Brasa (marca) y estados: unico uso de color fuera del isotipo
        brand: {
          DEFAULT: 'var(--brand)',
          hover: 'var(--brand-hover)',
          foreground: 'var(--brand-foreground)',
          soft: 'var(--brand-soft)',
          'soft-foreground': 'var(--brand-soft-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          hover: 'var(--success-hover)',
          foreground: 'var(--success-foreground)',
          soft: 'var(--success-soft)',
          'soft-foreground': 'var(--success-soft-foreground)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          hover: 'var(--danger-hover)',
          foreground: 'var(--danger-foreground)',
          soft: 'var(--danger-soft)',
          'soft-foreground': 'var(--danger-soft-foreground)',
        },
        warning: {
          soft: 'var(--warning-soft)',
          'soft-foreground': 'var(--warning-soft-foreground)',
        },
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
