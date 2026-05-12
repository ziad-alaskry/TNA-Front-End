// tailwind.config.js
// TNA — Temporary National Address Design Tokens
// Extracted from 14 Figma screenshots

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {

      colors: {
        primary:    '#2196C9',
        'primary-dark':  '#1565A8',
        'primary-light': '#E8F4FB',
        orange:     '#F5A623',
        'orange-light': '#FFF3DC',
        teal:       '#26C6DA',
        success:    '#4CAF50',
        'success-light': '#E8F5E9',
        error:      '#C62828',
        'error-border':  '#D32F2F',
        'error-light':   '#FFEBEE',
        background: '#F2F2F7',
        surface:    '#FFFFFF',
        divider:    '#E0E0E0',
        'border-light': '#EEEEEE',
        't-primary':    '#1A1A1A',
        't-secondary':  '#555555',
        't-placeholder':'#AAAAAA',
        't-disabled':   '#9E9E9E',
        't-caption':    '#777777',
      },

      fontFamily: {
        arabic:  ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'sans-serif'],
        sans:    ['IBM Plex Sans', 'Roboto', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },

      fontSize: {
        'xs':   ['11px', { lineHeight: '1.5' }],
        'sm':   ['13px', { lineHeight: '1.5' }],
        'base': ['15px', { lineHeight: '1.5' }],
        'md':   ['17px', { lineHeight: '1.4' }],
        'lg':   ['20px', { lineHeight: '1.3' }],
        'xl':   ['24px', { lineHeight: '1.2' }],
        '2xl':  ['28px', { lineHeight: '1.2' }],
        '3xl':  ['34px', { lineHeight: '1.2' }],
      },

      fontWeight: {
        regular:   '400',
        medium:    '500',
        semibold:  '600',
        bold:      '700',
        extrabold: '800',
      },

      spacing: {
        '1':  '4px',
        '2':  '8px',
        '3':  '12px',
        '4':  '16px',
        '5':  '20px',
        '6':  '24px',
        '7':  '28px',
        '8':  '32px',
        '10': '40px',
        '12': '48px',
        'screen-margin': '20px',
        'card':          '16px',
        'navbar':        '83px',
        'header':        '44px',
      },

      borderRadius: {
        'none':   '0px',
        'sm':     '6px',
        'md':     '10px',
        'lg':     '14px',
        'xl':     '18px',
        '2xl':    '24px',
        'full':   '9999px',
      },

      boxShadow: {
        'card':        '0px 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover':  '0px 4px 16px rgba(0, 0, 0, 0.10)',
        'button':      '0px 4px 12px rgba(33, 150, 201, 0.35)',
        'button-red':  '0px 4px 12px rgba(198, 40, 40, 0.30)',
        'navbar':      '0px -1px 4px rgba(0, 0, 0, 0.08)',
        'header':      '0px 1px 4px rgba(0, 0, 0, 0.06)',
        'input':       'inset 0px 1px 3px rgba(0, 0, 0, 0.04)',
      },

      height: {
        'btn':    '52px',
        'btn-sm': '40px',
        'input':  '52px',
        'navbar': '83px',
        'header': '44px',
      },

      backgroundImage: {
        'primary-gradient':    'linear-gradient(to left, #2196C9, #1565A8)',
        'teal-gradient':       'linear-gradient(to left, #26C6DA, #1E88E5)',
        'splash-stripes':      'repeating-linear-gradient(-45deg, #E8EDF2 0px, #E8EDF2 2px, #F0F4F8 2px, #F0F4F8 12px)',
      },

      transitionDuration: {
        'fast':   '150ms',
        'normal': '250ms',
        'slow':   '400ms',
      },

      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in':      'cubic-bezier(0.4, 0, 1, 1)',
        'out':     'cubic-bezier(0, 0, 0.2, 1)',
      },

      zIndex: {
        'header': '100',
        'navbar': '100',
        'modal':  '200',
        'toast':  '300',
      },

    },
  },
  plugins: [],
};
