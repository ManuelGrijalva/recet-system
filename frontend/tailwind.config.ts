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
      // Micro animaciones: solo transform y opacidad, curvas ease-out fuertes
      transitionTimingFunction: {
        'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' } },
        riseIn: { from: { opacity: '0', transform: 'translateY(8px)' } },
        popIn: { from: { opacity: '0', transform: 'scale(0.92)' } },
        sheetIn: { from: { opacity: '0', transform: 'translateY(16px)' } },
        dialogIn: { from: { opacity: '0', transform: 'scale(0.96)' } },
        reactionPop: {
          '0%': { transform: 'scale(0.7)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      // fill backwards: al terminar no queda ningun transform, que romperia los hijos fixed
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.23, 1, 0.32, 1) backwards',
        'rise-in': 'riseIn 240ms cubic-bezier(0.23, 1, 0.32, 1) backwards',
        'pop-in': 'popIn 160ms cubic-bezier(0.23, 1, 0.32, 1) backwards',
        'sheet-in': 'sheetIn 240ms cubic-bezier(0.32, 0.72, 0, 1) backwards',
        'dialog-in': 'dialogIn 200ms cubic-bezier(0.23, 1, 0.32, 1) backwards',
        'reaction-pop': 'reactionPop 260ms cubic-bezier(0.23, 1, 0.32, 1)',
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
