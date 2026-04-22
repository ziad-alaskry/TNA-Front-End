import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        en: 'var(--font-en)',
        ar: 'var(--font-ar)',
        mono: 'var(--font-mono)',
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '7': 'var(--space-7)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
      },
      borderRadius: {
        'xs': 'var(--radius-xs)',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'pill': 'var(--radius-pill)',
      },
      colors: {
        'brand': {
          'primary': 'var(--color-brand-primary)',
          'secondary': 'var(--color-brand-secondary)',
          'accent': 'var(--color-brand-accent)',
        },
        'status': {
          'success': 'var(--color-success)',
          'success-bg': 'var(--color-success-bg)',
          'error': 'var(--color-error)',
          'error-bg': 'var(--color-error-bg)',
          'warning': 'var(--color-warning)',
          'warning-bg': 'var(--color-warning-bg)',
          'info': 'var(--color-info)',
          'info-bg': 'var(--color-info-bg)',
          'pending': 'var(--color-pending)',
          'pending-bg': 'var(--color-pending-bg)',
        },
        'neutral': {
          '50': 'var(--neutral-50)',
          '100': 'var(--neutral-100)',
          '200': 'var(--neutral-200)',
          '300': 'var(--neutral-300)',
          '400': 'var(--neutral-400)',
          '500': 'var(--neutral-500)',
          '600': 'var(--neutral-600)',
          '700': 'var(--neutral-700)',
          '800': 'var(--neutral-800)',
          '900': 'var(--neutral-900)',
        },
        'surface': {
          '100': 'var(--surface-100)',
          '200': 'var(--surface-200)',
          '300': 'var(--surface-300)',
          'dark-100': 'var(--surface-dark-100)',
          'dark-200': 'var(--surface-dark-200)',
        },
        'primitive': {
          'cyan-light': 'var(--primitive-cyan-light)',
          'cyan-mid': 'var(--primitive-cyan-mid)',
          'cyan-hover': 'var(--primitive-cyan-hover)',
          'navy': 'var(--primitive-navy)',
          'navy-dark': 'var(--primitive-navy-dark)',
          'navy-light': 'var(--primitive-navy-light)',
          'amber': 'var(--primitive-amber)',
          'green': 'var(--primitive-green)',
          'red': 'var(--primitive-red)',
          'orange': 'var(--primitive-orange)',
        },
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'modal': 'var(--shadow-modal)',
        'btn': 'var(--shadow-btn)',
      },
      height: {
        'navbar': 'var(--navbar-height)',
        'btn-primary': 'var(--btn-primary-height)',
        'btn-outline': 'var(--btn-outline-height)',
        'input': 'var(--input-height)',
      },
    },
  },
  plugins: [],
}

export default config
